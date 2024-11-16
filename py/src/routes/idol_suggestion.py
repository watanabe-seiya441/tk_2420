import os

from env import PROCESSED_DATA_DIR, RECOMMENDATION_URL_PREFIX, DATASETS_DIR
from flask import Blueprint, jsonify, request, send_from_directory, url_for
from flask_cors import cross_origin
from services.propose_similar_kpop_idol.propose_similar_kpop_idol import propose_similar_kpop_idol
from werkzeug.utils import secure_filename

# Blueprintの初期化
idol_suggestion_bp = Blueprint("idol_suggestion", __name__, url_prefix=RECOMMENDATION_URL_PREFIX)

PROCESSED_VIDEO_DIR = os.path.join(PROCESSED_DATA_DIR, "videos")
PROCESSED_OVERLAY_DIR = os.path.join(PROCESSED_DATA_DIR, "overlays")


@idol_suggestion_bp.route('/idol_photo/<idol>/<filename>')
def serve_photo(idol, filename):
    return send_from_directory(f'{DATASETS_DIR}/kpop_idol_faces/{idol}', filename)


@idol_suggestion_bp.route("/upload_kpop_face_match", methods=["POST"])
@cross_origin()
def upload_kpop_face_match():
    try:
        # フロントエンドから送信された画像ファイルを取得
        image_file = request.files.get('image')
        if not image_file:
            return jsonify({"error": "No image file provided"}), 400

        # 画像を一時的なディレクトリに保存
        temp_dir = "temp_images"
        os.makedirs(temp_dir, exist_ok=True)
        temp_filename = secure_filename(image_file.filename)
        temp_filepath = os.path.join(temp_dir, temp_filename)
        image_file.save(temp_filepath)

        # 画像のパスをpropose_similar_kpop_idol関数に渡す
        # この関数は、idol_nameとphoto_pathを返すと仮定します
        idol_name, photo_path = propose_similar_kpop_idol(temp_filepath)

        # フルパスを作成
        full_photo_url = url_for('idol_suggestion.serve_photo', idol=idol_name, filename=f"{idol_name}.jpg", _external=True)
        print(full_photo_url)   


        # 一時ファイルを削除
        os.remove(temp_filepath)

        return jsonify({"idol_name": idol_name, "idol_photo_url": full_photo_url}), 201
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred on the server."}), 500
