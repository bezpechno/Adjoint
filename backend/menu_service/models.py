from flask_pymongo import ObjectId
from backend import mongo

class MenuItem:
    @staticmethod
    def create_item(data):
        mongo.db.menu_items.insert_one(data)

    @staticmethod
    def get_all_items():
        return list(mongo.db.menu_items.find({}))

    # Additional CRUD operations here
