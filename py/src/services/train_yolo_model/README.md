# Increment Learning with YOLOv11

## 前提条件


- 元のデータセット

読み取り専用の元データセットが以下のようなディレクトリ構造で保存されていることを想定しています。
```
py/datasets/predefined_dataset/{group}/test/  
py/datasets/predefined_dataset/{group}/train/  
py/datasets/predefined_dataset/{group}/valid/  
py/datasets/predefined_dataset/{group}/data.yaml  
```

- 追加データ

追加データは、以下のような構造で保存されている必要があります。
```
py/datasets/additional_dataset/{group}/\*.txt  
py/datasets/additional_dataset/{group}/\*.jpg  
```


## increment_learning.pyの実行内容

`increment_learning.py` を実行すると、以下の処理が行われます。

1. **元のデータセットをコピー**  
 読み取り専用の元データセットを、新たなディレクトリにコピーして「コピーデータセット」として使用します。このディレクトリは追加データの保存や編集が可能です。  
 - 例: `py/datasets/predefined_dataset/{group}/` → `py/datasets/tmp/dataset_copy/{group}/`

2. **追加データをコピーデータセットに追加**  
 追加データの `.txt` と `.jpg` ファイルを、それぞれ以下のディレクトリにコピーします。
 - `.txt` ファイル → `py/datasets/tmp/dataset_copy/{group}/train/labels/`
 - `.jpeg` ファイル → `py/datasets/tmp/dataset_copy/{group}/train/images/`

3. **モデルのファインチューニング**  
 コピーデータセットを用いて、`py/models/YOLOv11/yolo11n` をファインチューニングします。

4. **学習済みモデルの保存**  
 学習後の最良モデル (`best.pt`) を `py/models/YOLOv11/{group}/best.pt` として保存します。


