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
        # Check JWT token for 'GET' request
        token = get_jwt_identity()
        logging.info(f"Token: {token}")  # Log the token

        if not token:
            return redirect(url_for('user_bp.login'))  # Redirect unauthenticated users to the login page

        try:
            username = token  # Get the username of the logged-in user
            user = db.users.find_one({"email": username})  # Use "email" instead of "username"
            if user:
                return {'username': user['username']}, 200  # Return the username in JSON format
            else:
                return {'error': "No users found"}, 404  # Return an error if no users are found
        except NoAuthorizationError as e:
            logging.error(f"Authentication error: {e}")  # Log the error
            return jsonify({'error': 'Authentication required'}), 401