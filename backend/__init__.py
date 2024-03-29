# backend/__init__.py
from flask import Flask
from flask_cors import CORS
from .extensions import mongo
from .user_service.routes import user_bp
from .menu_service.routes import menu_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('backend.config.Config')

    mongo.init_app(app)

    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(menu_bp, url_prefix='/menu')

    # Ensure CORS is setup after registering blueprints
    CORS(app, supports_credentials=True, origins="http://localhost:3000", resources={r"/user/*": {"origins": "http://localhost:3000"}})

    return app
