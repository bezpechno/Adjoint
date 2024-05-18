from flask import Response, request
from bson import ObjectId, json_util
from flask_restx import Resource, Namespace
from flask_cors import cross_origin
import logging
import ua_parser.user_agent_parser as ua_parser
from datetime import datetime
import pymongo
import random
from datetime import datetime, timedelta
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
                "allergens": dish.get("allergens", []),  # Предполагаем, что allergens - это массив
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
            event_types = ["dish_view"]
            dish_ids = ["6648a0c60ebb5ea729040718"]
            usernames = ["final"]
            user_agents = [
                {"family": "Chrome", "major": "124", "minor": "0", "patch": "0"},
                {"family": "Mobile Safari", "major": "16", "minor": "6", "patch": None},
                {"family": "Firefox", "major": "88", "minor": "0", "patch": None}
            ]
            oses = [
                {"family": "Windows", "major": "10", "minor": None, "patch": None, "patch_minor": None},
                {"family": "iOS", "major": "16", "minor": "6", "patch": None, "patch_minor": None},
                {"family": "Android", "major": "11", "minor": None, "patch": None, "patch_minor": None}
            ]
            devices = [
                {"family": "Other", "brand": None, "model": None},
                {"family": "iPhone", "brand": "Apple", "model": "iPhone"},
                {"family": "PC", "brand": "Dell", "model": "XPS"}
            ]

            def generate_random_data(start_date, end_date, num_records_per_day):
                current_date = start_date
                while current_date <= end_date:
                    for _ in range(num_records_per_day):
                        record = {
                            "data": {
                                "event_type": random.choice(event_types),
                                "data": {
                                    "dish_id": random.choice(dish_ids)
                                },
                                "username": random.choice(usernames)
                            },
                            "ip": "127.0.0.1",
                            "timestamp": {
                                "$date": {
                                    "$numberLong": str(int(current_date.timestamp() * 1000))
                                }
                            },
                            "user_agent_info": {
                                "user_agent": random.choice(user_agents),
                                "os": random.choice(oses),
                                "device": random.choice(devices)
                            },
                            "username": random.choice(usernames)
                        }
                        db.clicks.insert_one(record)
                    current_date += timedelta(days=1)

            # Задание параметров генерации данных
            start_date = datetime.utcnow() - timedelta(days=5)
            end_date = datetime.utcnow()
            num_records_per_day = 50

            # Генерация и вставка данных
            generate_random_data(start_date, end_date, num_records_per_day)

            print("Исторические данные успешно добавлены в MongoDB.")
            db.clicks.delete_many({ "data.data.dish_id": "6648a1280ebb5ea72904071e" })
            db.clicks.delete_many({ "data.dish_id": "6648a1280ebb5ea72904071e" })



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
