import { useState, useRef } from "react";
import { LabelInfo, BoundingBox } from "@/app/lib/types";
import LabelSelectionPopup from "@/app/ui/LabelSelectionPopup";



interface AnnotationToolsProps {
  labels: LabelInfo[];
  currentBox: BoundingBox | null;
  setCurrentBox: React.Dispatch<React.SetStateAction<BoundingBox | null>>;
  clearCurrentBox: () => void;
  boundingBoxes: BoundingBox[];
  confirmBox: (box: BoundingBox) => void;
}

const AnnotationTools: React.FC<AnnotationToolsProps> = ({ labels,  
  currentBox, setCurrentBox, clearCurrentBox, boundingBoxes, confirmBox
}) => {

  const [showLabelPopup, setShowLabelPopup] = useState<boolean>(false);
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
      confirmBox({
        ...currentBox,
        label: labelInfo.label_name,
        color: labelInfo.label_color,
      });
    }
    console.log(boundingBoxes);
    setShowLabelPopup(false);
  };

  const handleLabelCancel = () => {
    clearCurrentBox();
    setShowLabelPopup(false);
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
