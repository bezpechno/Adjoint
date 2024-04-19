# register.py
from flask import request
from flask_restx import Resource
from werkzeug.security import generate_password_hash
import uuid  # Import the uuid module

class Register(Resource):
    def post(self):
        from backend.db import get_db
        db = get_db()

        data = request.get_json()
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        # Generate a unique menu_id for this user
        menu_id = str(uuid.uuid4())
        # Add the menu_id to the user document
        user = {"username": data['username'], "email": data['email'], "password": hashed_password, "menu_id": menu_id}

        # Check if a user with this username or email already exists
        existing_user = db.users.find_one({"$or": [{"username": data['username']}, {"email": data['email']}]})
        if existing_user:
            return {'error': 'User with this username or email already exists'}, 400

        db.users.insert_one(user)
        return {'message': 'Registered successfully'}, 201