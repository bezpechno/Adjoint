from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, email, password, username=None):
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.username = username

    def to_dict(self):
        return {
            "email": self.email,
            "password_hash": self.password_hash,
            "username": self.username,
        }

    def set_username(self, username):
        self.username = username

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def update_password(self, new_password):
        self.password_hash = generate_password_hash(new_password)

    def update_email(self, new_email):
        self.email = new_email