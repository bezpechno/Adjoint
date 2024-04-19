# menu_service/menu.py
import logging  # Add this import
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask import jsonify, request
from flask_cors import cross_origin 
from bson import json_util  # Add this import

# Set up logging
logging.basicConfig(level=logging.INFO)

class Menu(Resource):
    @cross_origin()
    @jwt_required()  # Protect this route with JWT
    def get(self):
        from backend.db import get_db
        db = get_db()
        try:
            # Log the Authorization header
            logging.info(f"Authorization: {request.headers.get('Authorization')}")
            
            email = get_jwt_identity()  # Get the email of the logged-in user
            user = db.users.find_one({"email": email})
            if user:
                # Get the menu items associated with this user
                menu_items = db.menu.find({"menu_id": user['menu_id']})
                # Convert the menu items to a list and then to a JSON string
                menu_items_json = json_util.dumps(list(menu_items))
                return {'username': user['username'], 'menu': menu_items_json}, 200
            else:
                return {'error': "No users found"}, 404  # Return an error if no users are found
        except NoAuthorizationError:
            return jsonify({"error": "Unauthorized"}), 401  # Return a 401 error if the user is not authenticated

    @cross_origin()
    @jwt_required()  # Protect this route with JWT
    def post(self):
        from backend.db import get_db
        db = get_db()
        try:
            email = get_jwt_identity()  # Get the email of the logged-in user
            user = db.users.find_one({"email": email})
            if user:
                menu_data = request.get_json()  # Get the data from the request
                for item in menu_data:
                    # Add the menu_id to each item
                    item['menu_id'] = user['menu_id']
                    # Save each item in the database
                    db.menu.insert_one(item)
                return {'message': 'Menu updated successfully'}, 200
            else:
                return {'error': "No users found"}, 404  # Return an error if no users are found
        except NoAuthorizationError:
            return jsonify({"error": "Unauthorized"}), 401  # Return a 401 error if the user is not authenticated