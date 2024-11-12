import os
import json
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "AdaFace"))
from inference import load_pretrained_model, to_input
from face_alignment import align
import os
import json

model = load_pretrained_model("ir_50")
test_imp_path = "./kpop_idle_dataset/Hashimoto_Kanna_at_Opening_Ceremony_of_the_Tokyo_International_Film_Festival_2017_(39304102215)_(cropped).jpg"
kpop_idle_dir = "./kpop_idle_dataset"

idle_features = {}
# Get the feature of the test image
for fname in os.listdir(kpop_idle_dir):
    features = []
    idle_photo_dir = os.path.join(kpop_idle_dir, fname)
    for photo in os.listdir(idle_photo_dir):
        idle_photo_path = os.path.join(idle_photo_dir, photo)
        aligned_rgb_img = align.get_aligned_face(idle_photo_path)
        bgr_tensor_input = to_input(aligned_rgb_img)
        feature, _ = model(bgr_tensor_input)
        features.append(feature)
        average_feature = sum(features) / len(features)
        average_feature = average_feature.tolist()
    idle_features[fname] = average_feature

with open("idol_features.json", "w") as f:
    json.dump(idle_features, f)