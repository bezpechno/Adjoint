import logging
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask import jsonify, request
from flask_cors import cross_origin
from bson import json_util, ObjectId

# Set up logging
logging.basicConfig(level=logging.INFO)

class Menu(Resource):
    @cross_origin()
    @jwt_required()
    def get(self):
        from backend.db import get_db
        db = get_db()
        try:
            logging.info(f"Authorization: {request.headers.get('Authorization')}")
            email = get_jwt_identity()
            user = db.users.find_one({"email": email})
            if user:
                menu_items = db.menu.find({"menu_id": user['menu_id']})
                menu_items_json = json_util.dumps(list(menu_items))
                return {'username': user['username'], 'menu': menu_items_json}, 200
            else:
                return {'error': "No users found"}, 404
        except NoAuthorizationError:
            return jsonify({"error": "Unauthorized"}), 401

    @cross_origin()
    @jwt_required()
    def post(self):
        from backend.db import get_db
        db = get_db()
        try:
            email = get_jwt_identity()
            user = db.users.find_one({"email": email})
            if user:
                menu_data = request.get_json()
                for item in menu_data:
                    # Remove _id field before insertion
                    item.pop('_id', None)
                    item['menu_id'] = user['menu_id']
                    db.menu.insert_one(item)
                return {'message': 'Menu updated successfully'}, 200
            else:
                return {'error': "No users found"}, 404
        except NoAuthorizationError:
            return jsonify({"error": "Unauthorized"}), 401

    @cross_origin()
    @jwt_required()
    def delete(self):
        from backend.db import get_db
        db = get_db()
        try:
            email = get_jwt_identity()
            user = db.users.find_one({"email": email})
            if user:
                _id = request.get_json()
                db.menu.delete_one({"_id": ObjectId(_id), "menu_id": user['menu_id']})
                return {'message': 'Menu items deleted successfully'}, 200
            else:
                return {'error': "No users found"}, 404
        except NoAuthorizationError:
            return jsonify({"error": "Unauthorized"}), 401

    @cross_origin()
    @jwt_required()
    def put(self):
        from backend.db import get_db
        db = get_db()
        try:
            email = get_jwt_identity()
            user = db.users.find_one({"email": email})
            if not user:
                return {'error': "No users found"}, 404

            item = request.get_json()
            if not item or '_id' not in item or not item['_id']:
                return {'error': "Missing or invalid '_id' field"}, 400

            # Extract `_id` safely and ensure it's converted to `ObjectId`
            try:
                if isinstance(item['_id'], dict) and '$oid' in item['_id']:
                    item['_id'] = ObjectId(item['_id']['$oid'])
                else:
                    item['_id'] = ObjectId(item['_id'])
            except Exception as e:
                logging.error(f"Invalid ObjectId: {e}")
                return {'error': "Invalid '_id' format"}, 400

            criteria = {"_id": item['_id'], "menu_id": user['menu_id']}
            update_result = db.menu.update_one(criteria, {"$set": item})

            if update_result.matched_count == 0:
                return {'error': "No matching item found for update"}, 404

            return {'message': 'Menu item updated successfully'}, 200

        except NoAuthorizationError:
            return jsonify({"error": "Unauthorized"}), 401
        except Exception as e:
            logging.error(f"Error updating menu item: {e}")
            return {'error': 'Server error while updating menu item'}, 500
