from werkzeug.security import generate_password_hash, check_password_hash

from ..extensions import mongo

class User:
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password_hash = generate_password_hash(password)

    def save(self):
        user = mongo.db.users.find_one({"$or": [{"username": self.username}, {"email": self.email}]})
        if user:
            return False  # User already exists
        mongo.db.users.insert_one({
            "username": self.username,
            "email": self.email,
            "password_hash": self.password_hash
        })
        return True
