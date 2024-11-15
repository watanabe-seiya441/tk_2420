import os

from env import PROCESSED_DATA_DIR
from flask import Blueprint, jsonify, request
from models import VideoInfo, db

# Blueprintの初期化
videos_bp = Blueprint("videos", __name__, url_prefix="/api/videos")

PROCESSED_VIDEO_DIR = os.path.join(PROCESSED_DATA_DIR, "videos")


# TODO: FIX ME LATER with the same prefix.
# @videos_bp.route("/<path:filename>", methods=["GET"])
# def serve_video(filename):
#     """動画ファイルを返す"""
#     return send_from_directory(PROCESSED_VIDEO_DIR, filename)


@videos_bp.route("/", methods=["GET"], strict_slashes=False)
def get_videos():
    """Get list of videos, optionally filtered by group_name"""
    group_name = request.args.get("group_name")
    query = db.select(VideoInfo).order_by(VideoInfo.title)
    if group_name:
        query = query.filter(VideoInfo.group_name == group_name)
    videos = db.session.execute(query).scalars().all()

    return jsonify(
        [
            {
                "id": video.id,
                "title": video.title,
                "group_name": video.group_name,
                "video_url": video.video_url,
                "overlay_url": video.overlay_url,
                "original_video_width": video.original_video_width,
                "original_video_height": video.original_video_height,
            }
            for video in videos
        ]
    )


# NOTE: This is not used by the frontend now. Consider removing this endpoint.
@videos_bp.route("/<video_id>", methods=["GET"])
def get_video_data(video_id: str):
    """Get specific video data including overlay"""
    video = db.get_or_404(VideoInfo, video_id)

    video_data = {
        "id": video.id,
        "title": video.title,
        "group_name": video.group_name,
        "video_url": video.video_url,
        "overlay_url": video.overlay_url,
        "original_video_width": video.original_video_width,
        "original_video_height": video.original_video_height,
    }
    return jsonify(video_data)
