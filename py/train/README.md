# Increment Learning with YOLOv11

## 前提条件


- 元のデータセット

読み取り専用の元データセットが以下のようなディレクトリ構造で保存されていることを想定しています。
```
py/dataset/aespa/test/  
py/dataset/aespa/train/  
py/dataset/aespa/valid/  
py/dataset/aespa/data.yaml  
```

- 追加データ

追加データは、以下のような構造で保存されている必要があります。
```
py/additional_dataset/aespa/\*.txt  
py/additional_dataset/aespa/\*.jpg  
```


## increment_learning.pyの実行内容

`increment_learning.py` を実行すると、以下の処理が行われます。

1. **元のデータセットをコピー**  
 読み取り専用の元データセットを、新たなディレクトリにコピーして「コピーデータセット」として使用します。このディレクトリは追加データの保存や編集が可能です。  
 - 例: `py/dataset/aespa/` → `py/dataset_copy/aespa/`

2. **追加データをコピーデータセットに追加**  
 追加データの `.txt` と `.jpg` ファイルを、それぞれ以下のディレクトリにコピーします。
 - `.txt` ファイル → `py/dataset_copy/aespa/train/labels/`
 - `.jpg` ファイル → `py/dataset_copy/aespa/train/images/`

3. **モデルのファインチューニング**  
 コピーデータセットを用いて、`yolo11n` モデルをファインチューニングします。

4. **学習済みモデルの保存**  
 学習後の最良モデル (`best.pt`) を `py/train/best.pt` に保存します。


