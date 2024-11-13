import os
import json
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "AdaFace"))
from inference import load_pretrained_model, to_input
from face_alignment import align
import os
import json


def make_kpop_idle_embedding(
    kpop_idle_dir="propose_similar_kpop_idle/kpop_idle_dataset",
    model_path="propose_similar_kpop_idle/AdaFace/pretrained/adaface_ir50_ms1mv2.ckpt",
    output_json_path="propose_similar_kpop_idle/idol_features.json",
):
    model = load_pretrained_model("ir_50", model_path)

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

    with open(output_json_path, "w") as f:
        json.dump(idle_features, f, indent=4)


if __name__ == "__main__":
    make_kpop_idle_embedding()
