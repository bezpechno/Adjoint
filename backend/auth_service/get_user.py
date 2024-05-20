# get_user.py
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask import jsonify, redirect, url_for
from flask_cors import cross_origin 
import logging

class GetUser(Resource):
    @jwt_required() 
    @cross_origin()
    def get(self):
        from backend.db import get_db
        db = get_db()
        token = get_jwt_identity()
        logging.info(f"Token: {token}")  
        if not token:
            return redirect(url_for('user_bp.login'))  

        try:
            username = token 
            user = db.users.find_one({"email": username}) 
            if user:
                return {'username': user['username']}, 200  
            else:
                return {'error': "No users found"}, 404  
        except NoAuthorizationError as e:
            logging.error(f"Authentication error: {e}")  
            return jsonify({'error': 'Authentication required'}), 401