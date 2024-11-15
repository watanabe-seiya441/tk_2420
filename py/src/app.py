import os
import sys
import uuid

# Add path to the parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from env import DATASETS_DIR, MODELS_DIR, PROCESSED_DATA_DIR
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from models import AnnotationLabel, db  # models からインポート
from routes import register_routes
from services.train_yolo_model.incremental_learning import update_model_with_additional_dataset
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///video_info.db"
CORS(app)  # Allow requests tentatively. TODO: tighten this up

# dbの初期化
db.init_app(app)

# Register routes
register_routes(app)

# Base directories for video, overlay, and annotation files
VIDEO_DIR = os.path.join(PROCESSED_DATA_DIR, "videos")
OVERLAY_DIR = os.path.join(PROCESSED_DATA_DIR, "overlays")
ANNOTATION_DIR = os.path.join(DATASETS_DIR, "additional_dataset")

# Ensure directories exist
os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(OVERLAY_DIR, exist_ok=True)
os.makedirs(ANNOTATION_DIR, exist_ok=True)


@app.route("/api/list_oshi_images", methods=["POST"])
def list_oshi_images():
    # フロントエンドから送られる動画タイトルとメンバーに基づいてディレクトリパスを作成
    video_title = request.json.get("videoTitle")  # title を videoTitle に変更
    member = request.json.get("member")
    if not video_title or not member:
        return jsonify({"error": "動画タイトルまたはメンバーが指定されていません"}), 400

    # 画像ディレクトリのパス
    directory_path = f"{PROCESSED_DATA_DIR}/oshi_photos/{video_title}/{member}/"

    # ディレクトリが存在する場合のみ処理
    if os.path.isdir(directory_path):
        # 画像のリンクを作成し、リストとして返す
        image_urls = [
            f"{request.host_url}processed_data/oshi_photos/{video_title}/{member}/{filename}"
            for filename in os.listdir(directory_path)
            if filename.endswith(".png")
        ]
        # ファイル名を数値でソートするためのキーを設定
        image_urls.sort(key=lambda url: int(url.split("/")[-1].split(".")[0]))

        return jsonify(image_urls), 201
    else:
        # ディレクトリが存在しない場合のエラーメッセージ
        return jsonify({"error": "指定されたディレクトリが存在しません"}), 404


# 推し画像を取得するエンドポイント
@app.route("/processed_data/oshi_photos/<video_title>/<member>/<path:filename>", methods=["GET"])
def get_image(video_title, member, filename):
    # フルパスを指定
    directory_path = f"{PROCESSED_DATA_DIR}/oshi_photos/{video_title}/{member}"
    return send_from_directory(directory_path, filename)


training_status = {"status": "idle"}  # 初期状態はidle


@app.route("/api/train_model", methods=["POST"])
def train_model():
    group_name = request.json.get("groupName")
    if not group_name:
        return jsonify({"error": "Group name is required"}), 400

    # 学習開始
    training_status["status"] = "training"
    update_model_with_additional_dataset(
        DATASETS_DIR=DATASETS_DIR,
        MODELS_DIR=MODELS_DIR,
        group=group_name,
    )
    training_status["status"] = "completed"

    return jsonify({"message": "Model training started"}), 200


@app.route("/api/train_status", methods=["GET"])
def get_train_status():
    return jsonify(training_status)


@app.route("/api/upload_kpop_face_match", methods=["POST"])
def upload_kpop_face_match():
    dummy_data = "Winter"
    return jsonify({"idol_name": dummy_data}), 201


@app.route("/api/upload_annotation", methods=["POST"])
def upload_annotation():
    """Upload new annotation data and save to the specified directory."""
    annotation_file = request.files.get("annotation")
    image_file = request.files.get("image")
    group_name = request.form.get("groupName")

    if not annotation_file or not image_file or not group_name:
        return jsonify({"error": "Missing annotation or image file or group name"}), 400

    group_dir = os.path.join(ANNOTATION_DIR, group_name)
    os.makedirs(group_dir, exist_ok=True)

    annotation_id = str(uuid.uuid4())

    annotation_filename = f"{annotation_id}.txt"
    annotation_path = os.path.join(group_dir, annotation_filename)
    annotation_file.save(annotation_path)

    image_filename = f"{annotation_id}.jpeg"
    image_path = os.path.join(group_dir, image_filename)
    image_file.save(image_path)

    print(f"Annotation saved to {annotation_path} and image saved to {image_path}")

    return jsonify(
        {
            "message": "Annotation and image uploaded successfully",
        }
    ), 201


@app.route("/api/annotation_labels", methods=["GET"])
def get_annotation_labels():
    """Get list of annotation labels"""
    group_name = request.args.get("groupName")
    print(f"group_name: {group_name}")

    labels = (
        db.session.execute(
            db.select(AnnotationLabel).filter_by(group_name=group_name).order_by(AnnotationLabel.label_id)
        )
        .scalars()
        .all()
    )

    # Convert to a list of dictionaries
    labels_dict = [
        {
            "label_id": label.label_id,
            "label_name": label.label_name,
            "label_color": label.label_color,
            "group_name": label.group_name,
        }
        for label in labels
    ]
    return jsonify(labels_dict)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
