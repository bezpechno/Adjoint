from flask import Response, request
from bson import ObjectId, json_util
from flask_restx import Resource, Namespace
from flask_cors import cross_origin
import logging
import ua_parser.user_agent_parser as ua_parser
from datetime import datetime

# Setup logging configuration
logging.basicConfig(level=logging.DEBUG)

# Create a namespace for the public routes
public_ns = Namespace('public', description='Public operations')

# Analytics function
def log_event(event_type, data, username, menu_id):
    from backend.db import get_db
    db = get_db()
    db.analytics.insert_one({
        'event_type': event_type,
        'data': data,
        'username': username,
        'menu_id': menu_id,
        'timestamp': datetime.utcnow()
    })

# Function to get user agent info
def get_user_agent_info(user_agent):
    parsed_string = ua_parser.Parse(user_agent)
    return {
        'user_agent': parsed_string['user_agent'],
        'os': parsed_string['os'],
        'device': parsed_string['device']
    }

@public_ns.route('/<string:username>/categories')
class Categories(Resource):
    @cross_origin()
    def get(self, username):
        from backend.db import get_db
        db = get_db()

        try:
            user = db.users.find_one({"username": username})
            logging.debug(f"User found: {user}")
            if not user:
                return Response(json_util.dumps({"error": "User not found"}), status=404, mimetype='application/json')

            categories = list(db.categories.find({"menu_id": user['menu_id']}))
            logging.debug(f"Categories found: {categories}")
            if not categories:
                return Response(json_util.dumps({"error": "No categories found"}), status=404, mimetype='application/json')

            simplified_categories = [{
                "_id": str(category["_id"]),
                "name": category["category"],
                "dishes": category.get("dishes", [])
            } for category in categories]

            return Response(json_util.dumps(simplified_categories), mimetype='application/json')

        except Exception as e:
            logging.error("Server error", exc_info=True)
            return Response(json_util.dumps({"error": "Internal server error"}), status=500, mimetype='application/json')

@public_ns.route('/<string:username>/dishes')
class Dishes(Resource):
    @cross_origin()
    def get(self, username):
        from backend.db import get_db
        db = get_db()

        try:
            user = db.users.find_one({"username": username})
            if not user:
                return Response(json_util.dumps({"error": "User not found"}), status=404, mimetype='application/json')
            menu_id = user.get('menu_id')

            dishes = list(db.menu.find({"menu_id": menu_id, "status": "active"}))
            logging.debug(f"Dishes found: {dishes}")
            simplified_dishes = [{
                "_id": str(dish["_id"]),
                "name": dish["name"],
                "details": dish["details"],
                "price": dish["price"],
                "photo": dish["photo"],
                "allergens": dish.get("allergens", {}),
                "status": dish["status"]
            } for dish in dishes]

            logging.debug(f"Simplified dishes: {simplified_dishes}")

            return Response(json_util.dumps(simplified_dishes), mimetype='application/json')

        except Exception as e:
            logging.error("Server error", exc_info=True)
            return Response(json_util.dumps({"error": "Internal server error"}), status=500, mimetype='application/json')

@public_ns.route('/dishes/<string:dish_id>/like', methods=['POST'])
class LikeDish(Resource):
    @cross_origin()
    def post(self, dish_id):
        from backend.db import get_db
        db = get_db()
        user_ip = request.remote_addr
        user_agent = request.headers.get('User-Agent')
        username = request.json.get('username')

        try:
            user = db.users.find_one({"username": username})
            if not user:
                return Response(json_util.dumps({"error": "User not found"}), status=404, mimetype='application/json')
            menu_id = user.get('menu_id')

            db.likes.insert_one({"dish_id": ObjectId(dish_id), "ip": user_ip, "timestamp": datetime.utcnow(), "username": username})
            log_event('like', {
                "dish_id": dish_id,
                "ip": user_ip,
                "user_agent_info": get_user_agent_info(user_agent)
            }, username, menu_id)

            return Response(json_util.dumps({"message": "Dish liked"}), mimetype='application/json')

        except Exception as e:
            logging.error("Server error", exc_info=True)
            return Response(json_util.dumps({"error": "Internal server error"}), status=500, mimetype='application/json')

@public_ns.route('/analytics/click', methods=['POST'])
class TrackClick(Resource):
    @cross_origin()
    def post(self):
        from backend.db import get_db
        db = get_db()
        data = request.json
        user_ip = request.remote_addr
        user_agent = request.headers.get('User-Agent')
        username = data.get('username')

        try:
            user = db.users.find_one({"username": username})
            if not user:
                return Response(json_util.dumps({"error": "User not found"}), status=404, mimetype='application/json')
            menu_id = user.get('menu_id')

            db.clicks.insert_one({
                "data": data,
                "ip": user_ip,
                "timestamp": datetime.utcnow(),
                "user_agent_info": get_user_agent_info(user_agent),
                "username": username
            })
            log_event('click', {
                "data": data,
                "ip": user_ip,
                "user_agent_info": get_user_agent_info(user_agent)
            }, username, menu_id)

            return Response(json_util.dumps({"message": "Click tracked"}), mimetype='application/json')

        except Exception as e:
            logging.error("Server error", exc_info=True)
            return Response(json_util.dumps({"error": "Internal server error"}), status=500, mimetype='application/json')

@public_ns.route('/analytics/popular_dishes')
class PopularDishes(Resource):
    @cross_origin()
    def get(self):
        from backend.db import get_db
        db = get_db()

        try:
            popular_dishes = db.menu.aggregate([
                {"$project": {"name": 1, "views": {"$size": "$views"}, "likes": {"$size": "$likes"}}},
                {"$sort": {"likes": -1, "views": -1}},
                {"$limit": 10}
            ])
            return Response(json_util.dumps(list(popular_dishes)), mimetype='application/json')

        except Exception as e:
            logging.error("Server error", exc_info=True)
            return Response(json_util.dumps({"error": "Internal server error"}), status=500, mimetype='application/json')

@public_ns.route('/analytics/device_usage')
class DeviceUsage(Resource):
    @cross_origin()
    def get(self):
        from backend.db import get_db
        db = get_db()

        try:
            device_usage = db.analytics.aggregate([
                {"$group": {"_id": "$user_agent_info.device.family", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}}
            ])
            return Response(json_util.dumps(list(device_usage)), mimetype='application/json')

        except Exception as e:
            logging.error("Server error", exc_info=True)
            return Response(json_util.dumps({"error": "Internal server error"}), status=500, mimetype='application/json')
