import os
from ultralytics import YOLO
import torch

# GPUが有効かチェック 
if torch.cuda.is_available():
    device = 'cuda:0'
    print("CUDA:0 が有効です。")
else:
    device = 'cpu'
    print("CPU を使用します。")

# 元々学習されたモデル
model = YOLO("hackv4i.pt")

# カスタムデータセットを用いて追加学習訓練
model.train(data=os.path.abspath('../../aespa_dataset1/data.yaml'), epochs=100, imgsz=640)




