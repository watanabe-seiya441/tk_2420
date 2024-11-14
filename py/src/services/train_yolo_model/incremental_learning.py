import os
import shutil
import torch
from ultralytics import YOLO

def update_model_with_additional_dataset(
    group,
    source_dir,
    destination_dir,
    additional_dataset_dir,
    txt_destination,
    jpg_destination,
    data_yaml_path,
    models_dir,
    runs_dir,
):
    # GPUが有効かチェック
    if torch.cuda.is_available():
        device = "cuda:0"
        print("CUDA:0 が有効です。")
    elif torch.backends.mps.is_available():
        device = "mps"
        print("MPS が有効です。")
    else:
        device = "cpu"
        print("CPU を使用します。")

    # データセットのコピー
    os.makedirs(destination_dir, exist_ok=True)
    shutil.copytree(source_dir, destination_dir, dirs_exist_ok=True)

    # 追加データのコピー
    for filename in os.listdir(additional_dataset_dir):
        file_path = os.path.join(additional_dataset_dir, filename)
        if filename.endswith(".txt"):
            shutil.copy(file_path, txt_destination)
            print(f"{filename} を {txt_destination} にコピーしました。")
        elif filename.endswith(".jpeg"):
            shutil.copy(file_path, jpg_destination)
            print(f"{filename} を {jpg_destination} にコピーしました。")

    # モデルのトレーニング
    model = YOLO("yolo11n.pt").to(device)
    model.train(data=data_yaml_path, epochs=3, imgsz=640, device=device, project=runs_dir)

    # best.ptのコピー
    latest_train_dir = max(
        [d for d in os.listdir(runs_dir) if d.startswith("train")],
        key=lambda x: os.path.getctime(os.path.join(runs_dir, x)),
    )
    best_pt_path = os.path.join(runs_dir, latest_train_dir, "weights", "best.pt")

    if os.path.exists(best_pt_path):
        shutil.copy(best_pt_path, models_dir)
        print(f"best.pt を {best_pt_path} から {models_dir} にコピーしました。")
    else:
        print("best.pt ファイルが見つかりませんでした。")
