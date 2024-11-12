import os
import json
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "AdaFace"))
from inference import load_pretrained_model, to_input
from face_alignment import align
import os
import json


def make_kpop_idle_embedding(kpop_idle_dir="./kpop_idle_dataset"):
    model = load_pretrained_model("ir_50")

    idle_features = {}
    # Get the feature of the test image
    for idol_name in os.listdir(kpop_idle_dir):
        face_features = []
        idle_photo_dir = os.path.join(kpop_idle_dir, idol_name)
        for photo in os.listdir(idle_photo_dir):
            idle_photo_path = os.path.join(idle_photo_dir, photo)
            aligned_rgb_img = align.get_aligned_face(idle_photo_path)
            bgr_tensor_input = to_input(aligned_rgb_img)
            face_emmbedding, _ = model(bgr_tensor_input)
            face_features.append(face_emmbedding)
            average_feature = (sum(face_features) / len(face_features)).tolist()
        idle_features[idol_name] = average_feature

    with open("idol_features.json", "w") as f:
        json.dump(idle_features, f)


if __name__ == "__main__":
    make_kpop_idle_embedding()
    