import os

from env import PROCESSED_DATA_DIR
from flask import Blueprint, jsonify

# Blueprintの初期化
idol_suggestion_bp = Blueprint("idol_suggestion", __name__, url_prefix="/")

PROCESSED_VIDEO_DIR = os.path.join(PROCESSED_DATA_DIR, "videos")
PROCESSED_OVERLAY_DIR = os.path.join(PROCESSED_DATA_DIR, "overlays")


# TODO: move to a different file.


@idol_suggestion_bp.route("/api/upload_kpop_face_match", methods=["POST"])
def upload_kpop_face_match():
    dummy_data = "Winter"
    return jsonify({"idol_name": dummy_data}), 201
