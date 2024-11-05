from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import json
import uuid
from werkzeug.utils import secure_filename

from models import db, VideoInfo  # models からインポート

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///video_info.db"
CORS(app, origins=["http://localhost:3000"]) # Allow requests from React app.

# dbの初期化
db.init_app(app)

# Dummy in-memory storage for video data
VIDEOS = [
    {
        "id": "video1",
        "title": "Supernova",
        "group_name": "aespa",
        "video_url": "/videos/Supernova.mp4",
        "overlay_url": "/overlays/Supernova_overlay.json",
        "original_video_width": 640,
        "original_video_height": 360
    },
    {
        "id": "video2",
        "title": "Whiplash",
        "group_name": "aespa",
        "video_url": "/videos/Whiplash.mp4",
        "overlay_url": "/overlays/Whiplash_overlay.json",
        "original_video_width": 640,
        "original_video_height": 360
    },
    {
        "id": "video3",
        "title": "裸足でSummer",
        "group_name": "nokizaka",
        "video_url": "/videos/hadashidesummer_nise.mp4",
        "overlay_url": "/overlays/hadashidesummer_nise_overlay.json",
        "original_video_width": 640,
        "original_video_height": 350
    },
]

# Serve static files.
# Route to serve video files
@app.route("/videos/<path:filename>")
def serve_video(filename):
    return send_from_directory("videos", filename)

# Route to serve overlay JSON files
@app.route("/overlays/<path:filename>")
def serve_overlay(filename):
    return send_from_directory("overlays", filename)


@app.route("/api/videos", methods=["GET"])
def get_videos():
    """Get list of videos, optionally filtered by group_name"""
    group_name = request.args.get("group_name")
    query = db.select(VideoInfo).order_by(VideoInfo.title)
    if group_name:
        query = query.filter(VideoInfo.group_name == group_name)
    videos = db.session.execute(query).scalars().all()
    
    return jsonify([{
        "id": video.id,
        "title": video.title,
        "group_name": video.group_name,
        "video_url": video.video_url,
        "overlay_url": video.overlay_url,
        "original_video_width": video.original_video_width,
        "original_video_height": video.original_video_height
    } for video in videos])

# NOTE: This is not used by the frontend now. Consider removing this endpoint.
@app.route("/api/videos/<video_id>", methods=["GET"])
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
        "original_video_height": video.original_video_height
    }
    return jsonify(video_data)

# TODO: This should be implemented in a separate module
# TODO: This is sitll a dummy implementation. Implement the actual overlay creation logic.
def create_overlay(video_file, video_id: str) -> str:
    """Creates overlay data in JSON for the given video file using its unique ID."""
    overlay_path = f"/overlays/overlay_{video_id}.json"
    # Dummy overlay content for illustration
    overlay_data = {"data": "overlay content"}
    with open(os.path.join("overlays", f"overlay_{video_id}.json"), "w") as f:
        json.dump(overlay_data, f)
    return overlay_path


@app.route("/api/upload", methods=["POST"])
def upload_video():
    """When new video is uploaded, save the video file and create overlay data."""
    title = request.form.get("title")
    group_name = request.form.get("group_name")
    video_file = request.files.get("video")

    if not title or not group_name or not video_file:
        return jsonify({"error": "Missing required fields"}), 400

    video_id = str(uuid.uuid4())

    # Save the uploaded video file
    clean_title = secure_filename(title)
    if not clean_title:
        clean_title = "video"
    
    video_filename = f"{clean_title}_{video_id}.mp4"
    video_file.save(os.path.join("videos", video_filename))

    overlay_path = create_overlay(video_file, video_id)

    new_video = VideoInfo(
        id=video_id,
        title=title,
        group_name=group_name,
        video_url=f"/videos/{video_filename}",
        overlay_url=overlay_path
    )
    db.session.add(new_video)
    db.session.commit()

    return jsonify({
        "id": new_video.id,
        "title": new_video.title,
        "group_name": new_video.group_name,
        "video_url": new_video.video_url,
        "overlay_url": new_video.overlay_url
    }), 201


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
