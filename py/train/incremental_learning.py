import os
import shutil
from ultralytics import YOLO
import torch

# GPUが有効かチェック 
if torch.cuda.is_available():
    device = 'cuda:0'
    print("CUDA:0 が有効です。")
else:
    device = 'cpu'
    print("CPU を使用します。")


# ../additional_dataset/の中身は.txtと.jpgの組み合わせの集合
# .txtを ../../aespa_dataset1/train/images にコピーする
# .jpgを ../../aespa_dataset1/train/labels にコピーする

# コピー元ディレクトリ
source_dir = os.path.abspath('../additional_dataset/')

# コピー先ディレクトリ
txt_destination = os.path.abspath('../../aespa_dataset1/train/labels/')
jpg_destination = os.path.abspath('../../aespa_dataset1/train/images/')

# .txt と .jpg ファイルをそれぞれ対応するディレクトリにコピー
for filename in os.listdir(source_dir):
    file_path = os.path.join(source_dir, filename)
    if filename.endswith('.txt'):
        shutil.copy(file_path, txt_destination)
        print(f"{filename} を {txt_destination} にコピーしました。")
    elif filename.endswith('.jpg'):
        shutil.copy(file_path, jpg_destination)
        print(f"{filename} を {jpg_destination} にコピーしました。")



# 追加されたデータを用いて最初から学習し直す
model = YOLO("yolo11n.pt") 
model.train(data=os.path.abspath('../../aespa_dataset1/data.yaml'), epochs=100, imgsz=640) 

