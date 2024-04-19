# menu_service/routes.py
from flask_restx import Namespace
from .menu import Menu
from .analytics import Analytics
from .settings import Settings
from .categories import Categories

def init_routes_menu_service(api):
    menu_ns = Namespace('menu', description='Menu operations')
    analytics_ns = Namespace('analytics', description='Analytics operations')
    settings_ns = Namespace('settings', description='Settings operations')
    categories_ns = Namespace('categories', description='Categories operations')

    menu_ns.add_resource(Menu, '/')
    analytics_ns.add_resource(Analytics, '/')
    settings_ns.add_resource(Settings, '/')
    categories_ns.add_resource(Categories, '/')

    api.add_namespace(menu_ns, path='/api/menu')
    api.add_namespace(analytics_ns, path='/api/menu/analytics')
    api.add_namespace(settings_ns, path='/api/menu/settings')
    api.add_namespace(categories_ns, path='/api/menu/categories')