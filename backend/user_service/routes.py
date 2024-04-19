# user_service/routes.py

from flask_cors import CORS
from flask_restx import Namespace, Api
from ..auth_service.register import Register
from ..auth_service.login import Login
from .set_username import SetUsername
from ..auth_service.get_user import GetUser
from .dashboard import Dashboard

def init_routes_user_service(api):
    auth_ns = Namespace('auth', description='Auth operations')
    user_ns = Namespace('user', description='User operations')
    dashboard_ns = Namespace('dashboard', description='Dashboard operations')

    auth_ns.add_resource(Register, '/register')
    auth_ns.add_resource(Login, '/login')
    user_ns.add_resource(SetUsername, '/set_username')
    user_ns.add_resource(GetUser, '/get_user')
    dashboard_ns.add_resource(Dashboard, '/')

    api.add_namespace(auth_ns, path='/api/auth')
    api.add_namespace(user_ns, path='/api/user')
    api.add_namespace(dashboard_ns, path='/api/dashboard')