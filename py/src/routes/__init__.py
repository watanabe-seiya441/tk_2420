from flask import Flask

from routes.annotations import annotations_bp
from routes.idol_suggestion import idol_suggestion_bp
from routes.ml_models import ml_models_bp
from routes.oshi_photos import oshi_photos_bp
from routes.overlays import overlays_bp
from routes.videos import videos_bp


def register_routes(app: Flask):
    """すべてのBlueprintを登録する"""
    app.register_blueprint(annotations_bp)
    app.register_blueprint(idol_suggestion_bp)
    app.register_blueprint(ml_models_bp)
    app.register_blueprint(oshi_photos_bp)
    app.register_blueprint(overlays_bp)
    app.register_blueprint(videos_bp)
