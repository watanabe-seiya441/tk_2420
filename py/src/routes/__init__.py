from flask import Flask

from routes.overlays import overlays_bp
from routes.videos import videos_bp


def register_routes(app: Flask):
    """すべてのBlueprintを登録する"""
    app.register_blueprint(videos_bp)
    app.register_blueprint(overlays_bp)
