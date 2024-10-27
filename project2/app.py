from flask import Flask, request, jsonify, send_from_directory, render_template
import cv2
from ultralytics import YOLO
import subprocess
import os

app = Flask(__name__, static_folder="static")
app.config["UPLOAD_FOLDER"] = "./uploads"
app.config["OUTPUT_FOLDER"] = "./public"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
os.makedirs(app.config["OUTPUT_FOLDER"], exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_video():
    if "video" not in request.files:
        return jsonify({"message": "動画ファイルが見つかりませんでした。"}), 400
    
    file = request.files["video"]
    video_path = os.path.join(app.config["UPLOAD_FOLDER"], "input.mp4")
    file.save(video_path)
    
    output_path = os.path.join(app.config["UPLOAD_FOLDER"], "tmp.mp4")
    final_output_path = os.path.join(app.config["OUTPUT_FOLDER"], "output.mp4")
    
    # YOLO モデルの初期化と処理
    try:
        model = YOLO("./hackv4i.pt")
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))
        
        while cap.isOpened():
            ret, frame = cap.read()
            if ret:
                results = model.track(frame, persist=True)
                annotated_frame = results[0].plot()
                out.write(annotated_frame)
            else:
                break
        
        cap.release()
        out.release()
        
        # FFmpeg を使用して音声を結合
        subprocess.run(
            [
                "ffmpeg", "-i", output_path, "-i", video_path,
                "-c:v", "libx264", "-c:a", "copy",
                "-map", "0:v:0", "-map", "1:a:0",
                "-y", final_output_path,
            ]
        )
        
        os.remove(output_path)
        
    except Exception as e:
        return jsonify({"message": f"エラーが発生しました: {str(e)}"}), 500
    
    return jsonify({
        "message": "動画が正常にアップロードされ、処理が完了しました。",
        "output_url": f"/public/output.mp4"
    })

@app.route('/public/<path:filename>')
def public_files(filename):
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)


if __name__ == "__main__":
    app.run(debug=True)
