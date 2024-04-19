# set_username.py
from flask import request
from flask_restx import Resource
from flask_cors import cross_origin
class SetUsername(Resource):
    @cross_origin()
    def post(self):
        from backend.db import get_db
        db = get_db()
        data = request.get_json()
        user = db.users.find_one({"_id": data['user_id']})  # You need to pass user_id in your request
        if user and not user['username']:
            db.users.update_one({"_id": data['user_id']}, {"$set": {"username": data['username']}})
            return {"message": "Username set successfully"}, 200
        return {"error": "Invalid request"}, 400