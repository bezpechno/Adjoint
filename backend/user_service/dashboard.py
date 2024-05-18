# dashboard.py
from flask_restx import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import current_app, request
from flask_cors import cross_origin
from backend.db import get_db
from werkzeug.exceptions import NotFound
import jwt
from jwt.exceptions import ExpiredSignatureError
from datetime import datetime, timedelta
import numpy as np

class Dashboard(Resource):
    @cross_origin()
    @jwt_required()
    def get(self):
        db = get_db()
        try:
            auth_header = request.headers.get('Authorization', None)
            if auth_header:
                token = auth_header.split(' ')[1]
                decoded_token = jwt.decode(token, options={"verify_signature": False})
                current_app.logger.info(f"Decoded JWT token: {decoded_token}")
            email = get_jwt_identity()
            user = db.users.find_one({"email": email})
            if user:
                analytics_data = self.fetch_analytics_data(user['username'])
                analytics_data['username'] = user['username']
                return analytics_data, 200
            else:
                error_message = "No users found"
                current_app.logger.error(f"404 error: {error_message}")
                current_app.logger.error(f"Path not found: {request.path}")
                raise NotFound(description=f"{error_message}. Path: {request.path}")
        except ExpiredSignatureError as e:
            current_app.logger.error(f"Token has expired: {str(e)}")
            return {"message": "Signature has expired"}, 401
        except Exception as e:
            current_app.logger.error(f"Error in Dashboard endpoint: {str(e)}")
            return {"error": str(e)}, 500

    def fetch_analytics_data(self, username):
        db = get_db()
        top_dishes = list(db.menu.aggregate([
            {"$match": {"username": username}},
            {
                "$project": {
                    "name": 1,
                    "details": 1,
                    "price": 1,
                    "allergens": 1,
                    "photo": 1,
                    "likes": {"$size": {"$ifNull": ["$likes", []]}},
                    "views": {"$size": {"$ifNull": ["$views", []]}}
                }
            },
            {"$sort": {"likes": -1}},
            {"$limit": 5}
        ]))
        for dish in top_dishes:
            dish["_id"] = str(dish["_id"])

        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)

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

        device_usage = list(db.analytics.aggregate([
            {"$match": {"username": username}},
            {"$group": {"_id": "$user_agent_info.device.family", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]))

        # Прогнозирование просмотров
        forecast = self.forecast_views(views_over_time)

        return {
            'top_dishes': top_dishes,
            'views_over_time': views_over_time,
            'likes_over_time': likes_over_time,
            'device_usage': device_usage,
            'forecast': forecast
        }

    def forecast_views(self, views_over_time):
        counts = [view['count'] for view in views_over_time]
        forecast_days = 3
        historical_days = 5
        forecast = []

        if len(counts) >= historical_days:
            for i in range(forecast_days):
                forecast.append(np.mean(counts[-historical_days:]))
            forecast_dates = [(datetime.utcnow() + timedelta(days=i+1)).strftime("%Y-%m-%d") for i in range(forecast_days)]
            forecast_data = {
                "dates": forecast_dates,
                "counts": forecast
            }
        else:
            forecast_data = None

        return forecast_data
