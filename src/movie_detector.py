import cv2
from ultralytics import YOLO
import subprocess
import os

video_path = "input.mp4"
output_path = "tmp.mp4"

# model = YOLO("yolo8n.pt")
model = YOLO("../hackv4i.pt")
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
        cv2.imshow("Frame", annotated_frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    else:
        break

cap.release()
out.release()
cv2.destroyAllWindows()

# Combine the annotated frames with the original sound.
final_output_path = "../public/output.mp4"
subprocess.run(
    [
        "ffmpeg",
        "-i",
        output_path,
        "-i",
        video_path,
        "-c:v",
        "libx264", 
        "-c:a",
        "copy",    
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-y",
        final_output_path,
    ]
)

os.remove(output_path)
