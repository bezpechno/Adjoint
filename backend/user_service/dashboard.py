# dashboard.py
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity 
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask import redirect, url_for, current_app, request
from flask_cors import cross_origin 
from backend.db import get_db
from werkzeug.exceptions import NotFound
import jwt

class Dashboard(Resource):
    @cross_origin()
    @jwt_required()  # Protect this route with JWT
    def get(self):
        db = get_db()
        try:
            # Get the JWT token from the request headers
            auth_header = request.headers.get('Authorization', None)
            if auth_header:
                token = auth_header.split(' ')[1]
                # Decode the JWT token (without verifying the signature)
                decoded_token = jwt.decode(token, options={"verify_signature": False})
                current_app.logger.info(f"Decoded JWT token: {decoded_token}")
            email = get_jwt_identity()  # Get the email of the logged-in user
            user = db.users.find_one({"email": email})
            if user:
                return {'username': user['username']}, 200  # Return the username in JSON format
            else:
                # Log the error and the request path
                error_message = "No users found"
                current_app.logger.error(f"404 error: {error_message}")
                current_app.logger.error(f"Path not found: {request.path}")

                # Raise a 404 error with a detailed message
                raise NotFound(description=f"{error_message}. Path: {request.path}")
        except NoAuthorizationError as e:
            current_app.logger.error(f"NoAuthorizationError: {str(e)}")
            return redirect(url_for('user_bp.login'))  # Redirect unauthenticated users to the login page