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
        "original_video_height": 360
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
    if group_name:
        filtered_videos = [video for video in VIDEOS if video["group_name"] == group_name]
        return jsonify(filtered_videos)
    return jsonify(VIDEOS)


@app.route("/api/videos/<video_id>", methods=["GET"])
def get_video_data(video_id):
    """Get specific video data including overlay"""
    video = next((video for video in VIDEOS if video["id"] == video_id), None)
    if video is None:
        return jsonify({"error": "Video not found"}), 404

    # Load overlay JSON
    overlay_path = os.path.join("overlays", f"{video_id}_overlay.json")
    if os.path.exists(overlay_path):
        with open(overlay_path) as overlay_file:
            video["overlay_data"] = json.load(overlay_file)
    else:
        video["overlay_data"] = {}

    return jsonify(video)

# TODO:　曲名がかぶる可能性があるから曲名ではなくて、idを使うべき
# TODO: ユニークなIDを生成する関数を作成する

# TODO: this should be implemented in a separate module
def create_overlay(video_file)-> str:
    """ Creates overlay data in Json for the given video file.
        Returns the path to the overlay file.
            ex.) /overlays/video1_overlay.json
        If the filename of the video file is video1.mp4, 
        the overlay file should be named video1_overlay.json.
    """
    return "/overlays/video1_overlay.json"


@app.route("/api/upload", methods=["POST"])
def upload_video():
    """Upload a new video and generate its overlay as JSON"""
    title = request.form.get("title")
    group_name = request.form.get("group_name")
    video_file = request.files.get("video")

    print(title, group_name, video_file)

    if not title or not group_name or not video_file:
        return jsonify({"error": "Missing required fields"}), 400

    # Save the uploaded video file
    video_filename = secure_filename(video_file.filename)
    video_file.save(os.path.join("videos", video_filename))

    # Generate overlay JSON file
    overlay_path = create_overlay(video_file)

    # Create new video entry
    new_video = {
        "id": video_filename.split(".")[0],
        "title": title,
        "group_name": group_name,
        "video_url": f"/videos/{video_filename}",
        "overlay_url": overlay_path,
    }
    VIDEOS.append(new_video)
    return jsonify(new_video), 201


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
