#!/usr/bin/env bash
# TODO: Find a better way to set PYTHONPATH.

# 環境変数が空であれば初期化
PYTHONPATH="${PYTHONPATH:-}"
echo "Current PYTHONPATH: $PYTHONPATH"

# プロジェクトルートを追加
PYTHONPATH="${PYTHONPATH}:$(pwd)"
export PYTHONPATH
echo "Updated PYTHONPATH: $PYTHONPATH"
