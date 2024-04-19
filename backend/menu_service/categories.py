# menu_service/categories.py
import json
import logging
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask import jsonify, redirect, url_for, request
from flask_cors import cross_origin 
from bson.json_util import dumps, loads

class Categories(Resource):
    @cross_origin()
    @jwt_required()  # Protect this route with JWT
    def get(self):
        from backend.db import get_db
        db = get_db()
        try:
            logging.info(f"Authorization: {request.headers.get('Authorization')}")
            email = get_jwt_identity()  # Get the email of the logged-in user
            user = db.users.find_one({"email": email})
            if user:
                menu_id = user['menu_id']  # Get the user's menu_id
                categories = db.categories.find({"menu_id": menu_id})  # Find categories with the user's menu_id
                categories_list = [{
                    'id': str(category['_id']),  # Пример добавления ID
                    'name': category['category'],
                    'dishes': category.get('dishes', [])  # Пример добавления списка блюд
                } for category in categories]
                return {'email': user['email'], 'categories': categories_list}, 200

            else:
                return {'error': "No users found"}, 404  # Return an error if no users are found
        except NoAuthorizationError:
            return redirect(url_for('user_bp.login'))  # Redirect unauthenticated users to the login page

    @cross_origin()
    @jwt_required()  # Protect this route with JWT
    def post(self):
        from backend.db import get_db
        db = get_db()
        try:
            email = get_jwt_identity()  # Get the email of the logged-in user
            user = db.users.find_one({"email": email})
            if user:
                categories_data = request.get_json()  # Get the data from the request
                for item in categories_data:
                    if isinstance(item, str):  # Check if item is a string
                        item = json.loads(item)  # Convert the string to a dictionary
                    # Add the user_id to each item
                    item['menu_id'] = user['menu_id']
                    # Update or insert each item in the database
                    db.categories.update_one({'menu_id': item['menu_id'], 'category': item['category']}, {'$set': item}, upsert=True)
                return {'message': 'Categories updated successfully'}, 200
            else:
                return {'error': "No users found"}, 404  # Return an error if no users are found
        except NoAuthorizationError:
            return jsonify({"error": "Unauthorized"}), 401  # Return a 401 error if the user is not authenticated.
    @cross_origin()
    @jwt_required()  # Protect this route with JWT
    def put(self):
        from backend.db import get_db
        db = get_db()
        try:
            email = get_jwt_identity()  # Get the email of the logged-in user
            user = db.users.find_one({"email": email})
            if user:
                category_data = request.get_json()  # Get the data from the request
                if isinstance(category_data, str):  # Check if item is a string
                    category_data = json.loads(category_data)  # Convert the string to a dictionary
                # Add the user_id to each item
                category_data['menu_id'] = user['menu_id']
                # Update or insert each item in the database
                db.categories.update_one({'menu_id': category_data['menu_id'], 'category': category_data['oldName']}, {'$set': {'category': category_data['newName'], 'dishes': category_data['dishes']}}, upsert=True)
                return {'message': 'Category updated successfully'}, 200
            else:
                return {'error': "No users found"}, 404  # Return an error if no users are found
        except NoAuthorizationError:
            return jsonify({"error": "Unauthorized"}), 401  # Return a 401 error if the user is not authenticated.
    @cross_origin()
    @jwt_required()  # Protect this route with JWT
    def delete(self):
        from backend.db import get_db
        db = get_db()
        try:
            email = get_jwt_identity()  # Get the email of the logged-in user
            user = db.users.find_one({"email": email})
            if user:
                category_data = request.get_json()  # Get the data from the request
                if isinstance(category_data, str):  # Check if item is a string
                    category_data = json.loads(category_data)  # Convert the string to a dictionary
                # Delete the category from the database
                db.categories.delete_one({'menu_id': user['menu_id'], 'category': category_data['name']})
                return {'message': 'Category deleted successfully'}, 200
            else:
                return {'error': "No users found"}, 404  # Return an error if no users are found
        except NoAuthorizationError:
            return jsonify({"error": "Unauthorized"}), 401  # Return a 401 error if the user is not authenticated.