import os

from env import OVERLAY_URL_PREFIX, PROCESSED_DATA_DIR
from flask import Blueprint, send_from_directory

# Blueprintの初期化
overlays_bp = Blueprint("overlays", __name__, url_prefix=OVERLAY_URL_PREFIX)

PROCESSED_OVERLAY_DIR = os.path.join(PROCESSED_DATA_DIR, "overlays")


# Route to serve overlay JSON files
@overlays_bp.route("/file/<path:filename>")
def serve_overlay(filename):
    """Returns the overlay JSON file."""
    return send_from_directory(PROCESSED_OVERLAY_DIR, filename)
