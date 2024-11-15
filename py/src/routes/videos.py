import os
import uuid

import cv2
from env import MODELS_DIR, PROCESSED_DATA_DIR
from flask import Blueprint, jsonify, request, send_from_directory
from models import VideoInfo, db
from services.create_overlay.movie_detector import annotate_video
from werkzeug.utils import secure_filename

# Blueprintの初期化
videos_bp = Blueprint("videos", __name__, url_prefix="/")

PROCESSED_VIDEO_DIR = os.path.join(PROCESSED_DATA_DIR, "videos")
PROCESSED_OVERLAY_DIR = os.path.join(PROCESSED_DATA_DIR, "overlays")


# TODO: move to a different file.
def get_video_dimensions(video_path: str):
    """Get the width and height of the video file in pixels."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return jsonify({"error": "Could not open video file"}), 500
    video_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    video_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()
    return (video_width, video_height)


# TODO: FIX ME LATER with the same prefix.
@videos_bp.route("/videos/<path:filename>", methods=["GET"])
def serve_video(filename):
    """動画ファイルを返す"""
    return send_from_directory(PROCESSED_VIDEO_DIR, filename)


@videos_bp.route("/api/videos", methods=["GET"], strict_slashes=False)
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


@videos_bp.route("/api/upload", methods=["POST"])
def upload_video():
    """When new video is uploaded, save the video file and create overlay data."""
    title = request.form.get("title")
    group_name = request.form.get("group_name")
    video_file = request.files.get("video")

    if not title or not group_name or not video_file:
        print(title, group_name, video_file)
        return jsonify({"error": "Missing required fields"}), 400

    video_id = str(uuid.uuid4())
    # Save the uploaded video file
    clean_title = secure_filename(title) or "video"

    video_filename = f"{clean_title}_{video_id}.mp4"
    # TODO: FIX ME. upload/の下に
    video_path = os.path.join(PROCESSED_DATA_DIR, video_filename)
    video_file.save(video_path)

    video_width, video_height = get_video_dimensions(video_path)

    # Annotate the video (add bounding boxes and overlay data)
    overlay_path = f"{PROCESSED_OVERLAY_DIR}/overlay_{video_id}.json"
    output_path = f"{PROCESSED_DATA_DIR}/videos_with_nametags/{video_filename}.mp4"
    model_path = f"{MODELS_DIR}/YOLOv11/{group_name}/hackv4i.pt"
    annotate_video(video_path, output_path, overlay_path, model_path)

    # NOTE: 実際にファイルを保存するパスとリクエストを投げるパスは違う.
    new_video = VideoInfo(
        id=video_id,
        title=title,
        group_name=group_name,
        video_url=f"/videos/{video_filename}",
        overlay_url=f"/overlays/overlay_{video_id}.json",
        original_video_width=video_width,
        original_video_height=video_height,
    )
    db.session.add(new_video)
    db.session.commit()

    return jsonify(
        {
            "id": video_id,
            "title": title,
            "group_name": group_name,
            "video_url": f"/videos/{video_filename}",
            "overlay_url": f"/overlays/overlay_{video_id}.json",
            "original_video_width": video_width,
            "original_video_height": video_height,
        }
    ), 201
