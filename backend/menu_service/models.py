# menu_service/models.py
from flask_pymongo import ObjectId
import backend

class MenuItem:
    @staticmethod
    def create_item(data):
        backend.mongo_connector.mongo.db.menu_items.insert_one(data)

    @staticmethod
    def get_all_items():
        return list(backend.mongo_connector.mongo.db.menu_items.find({}))

