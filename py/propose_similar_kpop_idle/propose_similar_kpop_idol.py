import json
import numpy as np
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'AdaFace'))
from inference import load_pretrained_model, to_input
from face_alignment import align

with open("./idol_features.json", "r") as f:
    idol_features = json.load(f)
    
input_photo_path = "./Hashimoto_Kanna_at_Opening_Ceremony_of_the_Tokyo_International_Film_Festival_2017_(39304102215)_(cropped).jpg"

model = load_pretrained_model('ir_50')
aligned_rgb_img = align.get_aligned_face(input_photo_path)
bgr_tensor_input = to_input(aligned_rgb_img)
feature, _ = model(bgr_tensor_input)
feature = feature.detach().numpy()

similarity_scores = {}
for fname, idol_feature_list in idol_features.items():
    idol_feature = np.array(idol_feature_list)
    similarity_scores[fname] = feature @  idol_feature.T

# 大きい順にソート
sorted_similarity_scores = sorted(similarity_scores.items(), key=lambda x: x[1], reverse=True)

# 類似度の高い順に出力
for fname, score in sorted_similarity_scores:
    print(fname, score)