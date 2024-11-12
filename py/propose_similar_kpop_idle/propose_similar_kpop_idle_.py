from AdaFace.inference import load_pretrained_model, to_input
from AdaFace.face_alignment import align
import os
import json

with open("", "r") as f:
    idle_features = json.load(f)
    
input_photo_path = "py/kpop_idle_dataset/Hashimoto_Kanna_at_Opening_Ceremony_of_the_Tokyo_International_Film_Festival_2017_(39304102215)_(cropped).jpg"

model = load_pretrained_model('ir_50')
aligned_rgb_img = align.get_aligned_face(input_photo_path)
bgr_tensor_input = to_input(aligned_rgb_img)
feature, _ = model(bgr_tensor_input)

similarity_scores = {}
for fname, idle_feature in idle_features.items():
    similarity_scores[fname] = feature @  idle_feature.T

# 大きい順にソート
sorted_similarity_scores = sorted(similarity_scores.items(), key=lambda x: x[1], reverse=True)

# 類似度の高い順に出力
for fname, score in sorted_similarity_scores:
    print(fname, score)