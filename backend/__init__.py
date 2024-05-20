# backend/__init__.py
import os
from dotenv import load_dotenv
import logging
from flask import Flask , g 
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restx import Api
from pymongo.mongo_client import MongoClient
from .db import init_db


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_app():
    global mongo

    app = Flask(__name__)
    api = Api(app, version='1.0', title='My API', description='A simple API')
    jwt = JWTManager(app)
    CORS(app, origins=['http://localhost:3000'], supports_credentials=True)

    from .user_service.routes import init_routes_user_service
    from .menu_service.routes import init_routes_menu_service
    init_routes_user_service(api)  #
    init_routes_menu_service(api)
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    
    app.config.from_object('backend.config.Config')

    init_db()

    return app