# menu_service/settings.py
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask import redirect, url_for
from flask_cors import cross_origin 
class Settings(Resource):
    @cross_origin()
    @jwt_required()  # Protect this route with JWT
    def get(self):
        from backend.db import get_db
        db = get_db()
        try:
            username = get_jwt_identity()  # Get the username of the logged-in user
            user = db.users.find_one({"username": username})
            if user:
                return {'username': user['username']}, 200  # Return the username in JSON format
            else:
                return {'error': "No users found"}, 404  # Return an error if no users are found
        except NoAuthorizationError:
            return redirect(url_for('user_bp.login'))  # Redirect unauthenticated users to the login page