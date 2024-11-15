import os

from env import PROCESSED_DATA_DIR
from flask import Blueprint, jsonify, request, send_from_directory

# Blueprintの初期化
oshi_photos_bp = Blueprint("oshi_photos", __name__, url_prefix="/")


@oshi_photos_bp.route("/api/list_oshi_photos", methods=["POST"])
def list_oshi_photos():
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
@oshi_photos_bp.route("/processed_data/oshi_photos/<video_title>/<member>/<path:filename>", methods=["GET"])
def get_image(video_title, member, filename):
    # フルパスを指定
    directory_path = f"{PROCESSED_DATA_DIR}/oshi_photos/{video_title}/{member}"
    return send_from_directory(directory_path, filename)
