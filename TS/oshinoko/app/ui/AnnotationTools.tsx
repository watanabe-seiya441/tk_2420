import { useState, useRef } from "react";
import { generateYOLOAnnotations } from "@/app/lib/yoloUtils";
import { AnnotatedSnapshot } from "@/app/lib/types";
import LabelSelectionPopup from "@/app/ui/LabelSelectionPopup";

export interface BoundingBox {
  x: number; // 左上のX座標
  y: number; // 左上のY座標
  width: number;
  height: number;
  label: string;
  color: string;
}

export interface labelInfo {
  label_id: number;
  label_name: string;
  label_color: string;
}

interface AnnotationToolsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  addAnnotatedSnapshot: (snapshot: AnnotatedSnapshot) => void;
  onExit: () => void;
}

const AnnotationTools: React.FC<AnnotationToolsProps> = ({ videoRef, onExit, addAnnotatedSnapshot }) => {
  const [currentBox, setCurrentBox] = useState<BoundingBox | null>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [showLabelPopup, setShowLabelPopup] = useState<boolean>(false);
  const [labels, setLabels] = useState<labelInfo[]>([
    { label_id: 0, label_name: "Person", label_color: "red" },
    { label_id: 1, label_name: "Car", label_color: "green" },
    { label_id: 2, label_name: "Bicycle", label_color: "blue" },
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      startPoint.current = { x: startX, y: startY };
      setCurrentBox({
        x: startX,
        y: startY,
        width: 0,
        height: 0,
        label: "",
        color: "white",
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (currentBox && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const newX = Math.min(startPoint.current.x, currentX);
      const newY = Math.min(startPoint.current.y, currentY);
      const newWidth = Math.abs(currentX - startPoint.current.x);
      const newHeight = Math.abs(currentY - startPoint.current.y);

      setCurrentBox({
        ...currentBox,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handleMouseUp = () => {
    if (currentBox) {
      setShowLabelPopup(true);
    }
  };

  const handleLabelConfirm = (labelName: string) => {
    const labelInfo = labels.find((label) => label.label_name === labelName);
    if (currentBox && labelInfo) {
      setBoundingBoxes((prevBoxes) => [
        ...prevBoxes,
        {
          ...currentBox,
          label: labelInfo.label_name,
          color: labelInfo.label_color,
        },
      ]);
    }
      console.log(boundingBoxes);
    setCurrentBox(null);
    setShowLabelPopup(false);
  };

  const handleLabelCancel = () => {
    setCurrentBox(null);
    setShowLabelPopup(false);
  };

  const handleFinishAnnotation = async () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob((blob) => resolve(blob)));
        if (imageBlob) {
          const yoloAnnotations = generateYOLOAnnotations(boundingBoxes, canvas.width, canvas.height);
          const newSnapshot: AnnotatedSnapshot = {
            id: `snapshot-${Date.now()}`,
            imageBlob,
            annotations: yoloAnnotations,
          };
          addAnnotatedSnapshot(newSnapshot);
          console.log('newSnapshot:', newSnapshot);
        }
      }
    }
    setBoundingBoxes([]);
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      style={{ cursor: 'crosshair' }}
      >
        {/* 現在描画中のボックス */}
        {currentBox && (
          <div
            style={{
            position: 'absolute',
              left: currentBox.x,
              top: currentBox.y,
              width: currentBox.width,
              height: currentBox.height,
              border: `2px dashed ${currentBox.color}`,
            }}
          />
        )}
        {/* 確定済みのボックス */}
        {boundingBoxes.map((box, index) => (
          <div
            key={index}
            style={{
            position: 'absolute',
              left: box.x,
              top: box.y,
              width: box.width,
              height: box.height,
              border: `2px solid ${box.color}`,
            }}
          />
        ))}
      </div>
        {/* アノテーションモード中止ボタン */}
        <button
        onClick={() => { setBoundingBoxes([]); onExit(); }}
          className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Abort
        </button>
        {/* アノテーション終了ボタン */}
        <button
          onClick={handleFinishAnnotation}
          className="absolute top-4 right-20 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Finish Annotation
        </button>

      {/* ラベル選択ポップアップ */}
      {showLabelPopup && (
        <LabelSelectionPopup
          label_info={labels}
          onConfirm={handleLabelConfirm}
          onCancel={handleLabelCancel}
        />
      )}
    </div>
  );
};

export default AnnotationTools;
