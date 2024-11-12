import json
import numpy as np
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'AdaFace'))
from inference import load_pretrained_model, to_input
from face_alignment import align


def propose_similar_kpop_idol(input_photo_path="./Hashimoto_Kanna_at_Opening_Ceremony_of_the_Tokyo_International_Film_Festival_2017_(39304102215)_(cropped).jpg", embedding_json_path="./idol_features.json"):
    with open(embedding_json_path, "r") as f:
        idol_features = json.load(f)
        

    model = load_pretrained_model('ir_50')
    aligned_rgb_img = align.get_aligned_face(input_photo_path)
    bgr_tensor_input = to_input(aligned_rgb_img)
    face_feature, _ = model(bgr_tensor_input)
    face_feature = face_feature.detach().numpy()

    similarity_scores = {}
    for idol_name, idol_feature_list in idol_features.items():
        idol_feature = np.array(idol_feature_list)
        similarity_scores[idol_name] = face_feature @  idol_feature.T

    # 大きい順にソート
    sorted_similarity_scores = sorted(similarity_scores.items(), key=lambda x: x[1], reverse=True)

    # 類似度の高い順に出力
    for idol_name, similarity_score in sorted_similarity_scores:
        print(idol_name, similarity_score)


if __name__ == "__main__":
    propose_similar_kpop_idol()