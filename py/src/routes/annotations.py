import os
import uuid

from env import ANNOTATION_URL_PREFIX, DATASETS_DIR
from flask import Blueprint, jsonify, request
from models import AnnotationLabel, db

ANNOTATION_DIR = os.path.join(DATASETS_DIR, "additional_dataset")

# Blueprintの初期化
annotations_bp = Blueprint("annotations", __name__, url_prefix=ANNOTATION_URL_PREFIX)


@annotations_bp.route("/upload/annotation", methods=["POST"])
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


@annotations_bp.route("/annotation_labels", methods=["GET"])
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
