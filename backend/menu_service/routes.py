# menu_service/routes.py
import logging
from flask_restx import Namespace, Api

from .menu import Menu
from .analytics import Analytics
from .settings import Settings
from .categories import Categories
from .publicmenu import Categories as PublicCategories
from .publicmenu import Dishes, LikeDish, TrackClick, PopularDishes, DeviceUsage

logging.basicConfig(level=logging.DEBUG)

def init_routes_menu_service(api):
    logging.debug("Initializing routes")
    menu_ns = Namespace('menu', description='Menu operations')
    analytics_ns = Namespace('analytics', description='Analytics operations')
    settings_ns = Namespace('settings', description='Settings operations')
    categories_ns = Namespace('categories', description='Categories operations')
    public_ns = Namespace('public', description='Public operations')

    menu_ns.add_resource(Menu, '/')
    analytics_ns.add_resource(Analytics, '/')  # Убедитесь, что маршрут добавлен правильно
    settings_ns.add_resource(Settings, '/')
    categories_ns.add_resource(Categories, '/')
    public_ns.add_resource(PublicCategories, '/<string:username>/categories')
    public_ns.add_resource(Dishes, '/<string:username>/dishes')
    public_ns.add_resource(LikeDish, '/dishes/<string:dish_id>/like')
    public_ns.add_resource(TrackClick, '/analytics/click')
    analytics_ns.add_resource(PopularDishes, '/popular_dishes')
    analytics_ns.add_resource(DeviceUsage, '/device_usage')

    logging.debug("Adding namespaces to API")
    api.add_namespace(menu_ns, path='/api/menu')
    api.add_namespace(analytics_ns, path='/api/analytics')
    api.add_namespace(settings_ns, path='/api/menu/settings')
    api.add_namespace(categories_ns, path='/api/menu/categories')
    api.add_namespace(public_ns, path='/api/public')
    logging.debug("Routes initialized")
