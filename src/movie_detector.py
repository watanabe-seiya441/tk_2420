import cv2
from ultralytics import YOLO
import subprocess
import os
import logging

input_video_path = "../Whiplash.mp4"
output_path = "../output.mp4"
display_window_while_processing = False

logger = logging.getLogger(__name__)

def annotate_video(input_video_path:str, output_path:str) -> None:
    model = YOLO("yolo11x-seg.pt")
    # model = YOLO("../hackv4i.pt")
    cap = cv2.VideoCapture(input_video_path)

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    tmp_output_path = "./tmp.mp4"

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(tmp_output_path, fourcc, fps, (frame_width, frame_height))

    while cap.isOpened():
        ret, frame = cap.read()
        if ret:
            results = model.track(frame, persist=True) 
            annotated_frame = results[0].plot()
            out.write(annotated_frame)
            if display_window_while_processing:
                cv2.imshow("Frame", frame)
            # cv2.imshow("Frame", annotated_frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
        else:
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()

    # Combine the annotated frames with the original sound.
    subprocess.run(
        [
            "ffmpeg",
            "-i",
            tmp_output_path,
            "-i",
            input_video_path,
            "-c:v",
            "libx264", 
            "-c:a",
            "copy",    
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
            "-y",
            output_path,
        ]
    )

    os.remove(tmp_output_path)


if __name__ == "__main__":
    annotate_video(input_video_path, output_path)