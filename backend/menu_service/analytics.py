from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from flask_cors import cross_origin
from datetime import datetime, timedelta
import logging
from bson import ObjectId

logging.basicConfig(level=logging.DEBUG)

class Analytics(Resource):
    @cross_origin()
    @jwt_required()
    def get(self):
        logging.debug("Analytics GET request received")
        from backend.db import get_db
        db = get_db()
        try:
            email = get_jwt_identity()
            logging.debug(f"Fetching analytics for user: {email}")

            user = db.users.find_one({"email": email})
            if not user:
                logging.error("User not found")
                return {'error': "User not found"}, 404

            username = user.get('username')
            menu_id = user.get('menu_id')
            logging.debug(f"User's username: {username}, menu_id: {menu_id}")

            top_dishes = list(db.menu.aggregate([
                {"$match": {"menu_id": menu_id}},
                {
                    "$lookup": {
                        "from": "likes",
                        "localField": "_id",
                        "foreignField": "dish_id",
                        "as": "likes"
                    }
                },
                {
                    "$lookup": {
                        "from": "clicks",
                        "let": {"dishId": "$_id"},
                        "pipeline": [
                            {"$match": {"$expr": {"$and": [
                                {"$eq": ["$data.dish_id", "$$dishId"]},
                                {"$eq": ["$data.event_type", "dish_view"]}
                            ]}}},
                            {"$count": "count"}
                        ],
                        "as": "views"
                    }
                },
                {
                    "$project": {
                        "name": 1,
                        "details": 1,
                        "price": 1,
                        "allergens": 1,
                        "photo": 1,
                        "likes": {"$size": "$likes"},
                        "views": {"$ifNull": [{"$arrayElemAt": ["$views.count", 0]}, 0]}
                    }
                },
                {"$sort": {"likes": -1}},
                {"$limit": 5}
            ]))
            for dish in top_dishes:
                dish["_id"] = str(dish["_id"])
            logging.debug(f"Top dishes: {top_dishes}")

            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=30)
            logging.debug(f"Date range: {start_date} to {end_date}")

            views_over_time = list(db.clicks.aggregate([
                {"$match": {
                    "data.event_type": "dish_view",
                    "timestamp": {"$gte": start_date, "$lte": end_date},
                    "data.username": username
                }},
                {"$group": {
                    "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
                    "count": {"$sum": 1}
                }},
                {"$sort": {"_id": 1}}
            ]))
            logging.debug(f"Views over time: {views_over_time}")

            likes_over_time = list(db.likes.aggregate([
                {"$match": {
                    "timestamp": {"$gte": start_date, "$lte": end_date},
                    "username": username
                }},
                {"$group": {
                    "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
                    "count": {"$sum": 1}
                }},
                {"$sort": {"_id": 1}}
            ]))
            logging.debug(f"Likes over time: {likes_over_time}")

            device_usage = list(db.analytics.aggregate([
                {"$match": {"username": username}},
                {"$group": {
                    "_id": {"$ifNull": ["$data.user_agent_info.device.family", "Unknown"]},
                    "count": {"$sum": 1}
                }},
                {"$sort": {"count": -1}}
            ]))
            logging.debug(f"Device usage: {device_usage}")

            return jsonify({
                'email': email,
                'top_dishes': top_dishes,
                'views_over_time': views_over_time,
                'likes_over_time': likes_over_time,
                'device_usage': device_usage
            })

        except Exception as e:
            logging.error(f"Error in Analytics endpoint: {e}", exc_info=True)
            return {'error': str(e)}, 500
