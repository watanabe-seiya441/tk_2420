import os

from env import PROCESSED_DATA_DIR
from flask import Blueprint, send_from_directory

# Blueprintの初期化
videos_bp = Blueprint("videos", __name__, url_prefix="/videos")

PROCESSED_VIDEO_DIR = os.path.join(PROCESSED_DATA_DIR, "videos")


# TODO: FIX ME LATER with the same prefix.
# @videos_bp.route("/<path:filename>", methods=["GET"])
# def serve_video(filename):
#     """動画ファイルを返す"""
#     return send_from_directory(PROCESSED_VIDEO_DIR, filename)
