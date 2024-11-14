import os

# TODO: もっと良い方法を探す.

# プロジェクトのルートディレクトリ
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


# 各ディレクトリのパス
DATASETS_DIR = os.path.join(BASE_DIR, 'datasets')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
UPLOADS_DIR = os.path.join(BASE_DIR, 'uploads')
PROCESSED_DATA_DIR = os.path.join(BASE_DIR, 'processed_data')
