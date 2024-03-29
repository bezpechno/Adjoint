from flask import Blueprint, request, jsonify
from flask_cors import CORS
from .models import User
from werkzeug.security import check_password_hash
from backend import mongo
from flask import Blueprint
from flask import make_response

user_bp = Blueprint('user', __name__)
CORS(user_bp)
@user_bp.route('/register', methods=['POST','OPTIONS'])
def register():
    if request.method == 'OPTIONS':  # Respond to OPTIONS preflight
            return _build_cors_preflight_response()
    elif request.method == 'POST':
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')
        if not username or not email or not password:
            return jsonify({"error": "Missing data"}), 400
        user = User(username, email, password)
        if user.save():
            return jsonify({"message": "User registered successfully"}), 201
        return jsonify({"error": "User already exists"}), 400
        pass

@user_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = mongo.db.users.find_one({"username": username})
    if user and check_password_hash(user['password_hash'], password):
        # Generate and return JWT token (omitted for brevity)
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "*")  # You should specify the headers you use
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    return response
