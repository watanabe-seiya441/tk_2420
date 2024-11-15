from env import DATASETS_DIR, ML_MODEL_URL_PREFIX, MODELS_DIR
from flask import Blueprint, jsonify, request
from services.train_yolo_model.incremental_learning import update_model_with_additional_dataset

# Blueprintの初期化
ml_models_bp = Blueprint("ml_models", __name__, url_prefix=ML_MODEL_URL_PREFIX)

training_status = {"status": "idle"}  # 初期状態はidle


@ml_models_bp.route("/train_start", methods=["POST"])
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


@ml_models_bp.route("/train_status", methods=["GET"])
def get_train_status():
    return jsonify(training_status)
