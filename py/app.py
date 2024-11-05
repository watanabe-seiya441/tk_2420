from flask import Flask, jsonify, request
import os
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Dummy in-memory storage for video data
VIDEOS = [
    {
        "id": "video1",
        "title": "Supernova",
        "group": "aespa",
        "video_url": "/videos/Supernova.mp4",
        "overlay_url": "/overlays/Supernova_overlay.json",
    },
    {
        "id": "video2",
        "title": "Whiplash",
        "group": "aespa",
        "video_url": "/videos/Whiplash.mp4",
        "overlay_url": "/overlays/Whiplash_overlay.json",
    },
    {
        "id": "video3",
        "title": "裸足でSummer",
        "group": "nokizaka",
        "video_url": "/videos/hadashidesummer_nise.mp4",
        "overlay_url": "/overlays/hadashidesummer_nise_overlay.json",
    },
]


@app.route("/api/videos", methods=["GET"])
def get_videos():
    """Get list of videos, optionally filtered by group"""
    group = request.args.get("group")
    if group:
        filtered_videos = [video for video in VIDEOS if video["group"] == group]
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
    group = request.form.get("group")
    video_file = request.files.get("video")

    print(title, group, video_file)

    if not title or not group or not video_file:
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
        "group": group,
        "video_url": f"/videos/{video_filename}",
        "overlay_url": overlay_path,
    }
    VIDEOS.append(new_video)
    return jsonify(new_video), 201


if __name__ == "__main__":
    app.run(debug=True)
