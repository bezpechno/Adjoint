# login.py
from flask import request, make_response
from flask_restx import Resource
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from flask_cors import cross_origin
import logging

logger = logging.getLogger(__name__)

class Login(Resource):
    @cross_origin()
    def options(self):
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        return response
    @cross_origin()
    def post(self):
        from backend.db import get_db
        db = get_db()
        data = request.get_json()
        logger.info('Received login request for email: %s', data.get('email'))

        if 'email' not in data or 'password' not in data:
            logger.warning('Email and password not provided in login request')
            return {'error': 'Email and password are required'}, 400

        user = db.users.find_one({"email": data['email']})
        if not user:
            logger.warning('No user found with email: %s', data.get('email'))
            return {'error': 'Invalid email or password'}, 400

        if not check_password_hash(user['password'], data['password']):
            logger.warning('Invalid password provided for email: %s', data.get('email'))
            return {'error': 'Invalid email or password'}, 400

        access_token = create_access_token(identity=data['email'])
        logger.info('Successfully logged in user: %s', data.get('email'))
        return {"message": "Login successful", "token": access_token}, 200