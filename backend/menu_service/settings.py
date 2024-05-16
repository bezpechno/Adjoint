# menu_service/settings.py
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask import redirect, url_for, jsonify, request
from flask_cors import cross_origin 
from werkzeug.security import generate_password_hash


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
        
    @cross_origin()
    @jwt_required()
    def post(self):
        from backend.db import get_db
        db = get_db()
        email = get_jwt_identity()  # Используем email из JWT токена в качестве идентификатора
        data = request.get_json()
        setting_type = data.get('setting_type')
        new_value = data.get('value')

        if setting_type == 'username':
            if db.users.find_one({"username": new_value}):
                return jsonify({'error': 'This username is already taken'}), 400
            db.users.update_one({"email": email}, {"$set": {"username": new_value}})
            return jsonify({'success': "Username updated"}), 200
        
        elif setting_type == 'email':
            if db.users.find_one({"email": new_value}):
                return jsonify({'error': 'This email is already in use'}), 400
            db.users.update_one({"email": email}, {"$set": {"email": new_value}})
            return jsonify({'success': "Email updated"}), 200

        elif setting_type == 'password':
            hashed_password = generate_password_hash(new_value, method='pbkdf2:sha256')
            db.users.update_one({"email": email}, {"$set": {"password": hashed_password}})
            return jsonify({'success': "Password updated"}), 200

        elif setting_type == 'delete':
            db.users.delete_one({"email": email})
            return jsonify({'success': "Account deleted"}), 200

        else:
            return jsonify({'error': "Invalid setting type"}), 400