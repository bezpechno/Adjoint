# register.py
from flask import request
from flask_restx import Resource
from werkzeug.security import generate_password_hash
import uuid  

class Register(Resource):
    def post(self):
        from backend.db import get_db
        db = get_db()

        data = request.get_json()
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        menu_id = str(uuid.uuid4())
        user = {"username": data['username'], "email": data['email'], "password": hashed_password, "menu_id": menu_id}

        existing_user = db.users.find_one({"$or": [{"username": data['username']}, {"email": data['email']}]})
        if existing_user:
            return {'error': 'User with this username or email already exists'}, 400

        db.users.insert_one(user)
        return {'message': 'Registered successfully'}, 201