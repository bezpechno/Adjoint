from flask import Blueprint, request, jsonify
from .models import MenuItem

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('/items', methods=['POST'])
def create_item():
    data = request.json
    MenuItem.create_item(data)
    return jsonify({"message": "Item created successfully"}), 201

@menu_bp.route('/items', methods=['GET'])
def get_items():
    items = MenuItem.get_all_items()
    return jsonify(items), 200

# Additional endpoints for update and delete
