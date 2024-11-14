import json
import random

# ランダムシードの設定（オプション）
random.seed(42)

# オーバーレイの基本設定
overlays = []
colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"]
contents = ["Person A", "Person B", "Person C", "Person D"]
font_sizes = ["16px", "18px", "20px", "22px"]

# フレームレートと時間設定
fps = 4  # フレームレートを4fpsに変更
total_seconds = 30
total_frames = fps * total_seconds  # 4fps × 30秒 = 120フレーム

# 位置のランダム範囲設定（必要に応じて調整してください）
position_ranges = {"startX": (0, 300), "startY": (0, 320), "endX": (0, 640), "endY": (0, 320)}

for i in range(4):
    overlay = {
        "id": f"text{i+1}",
        "content": contents[i],
        "color": colors[i],
        "fontSize": font_sizes[i],
        "lineColor": colors[i],
        "lineWidth": 2,
        "positions": [],
    }

    for frame in range(total_frames + 1):
        time = round(frame / fps, 4)

        # ランダムな位置を生成
        X1 = round(random.uniform(*position_ranges["startX"]), 2)
        startY = round(random.uniform(*position_ranges["startY"]), 2)
        X2 = round(random.uniform(*position_ranges["endX"]), 2)
        endY = startY
        # endY = round(random.uniform(*position_ranges["endY"]), 2)

        position = {
            "time": time,
            "startX": min(X1, X2),
            "startY": startY,
            "endX": max(X1, X2),
            "endY": endY,
            "visible": True,
        }
        overlay["positions"].append(position)

    overlays.append(overlay)

# 最終的なJSON構造
data = {"overlays": overlays}

# JSONをファイルに保存
with open("overlays.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("overlays.json が正常に生成されました。")
