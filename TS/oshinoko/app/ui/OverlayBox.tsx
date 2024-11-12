interface OverlayBoxProps {
  content: string;
  color: string;
  fontSize: string;
  lineColor: string;
  lineWidth: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  visible: boolean;
}

const OverlayBox: React.FC<OverlayBoxProps> = ({
  content,
  color,
  fontSize,
  lineColor,
  lineWidth,
  startX,
  startY,
  endX,
  endY,
  visible,
}) => {
  if (!visible) return null;

  // Calculate midpoint for text positioning
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  return (
    <>
      {/* Line */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${startY}px`,
          left: `${startX}px`,
          width: `${Math.hypot(endX - startX, endY - startY)}px`, // Line length
          // transform: `rotate(${Math.atan2(endY - startY, endX - startX)}rad)`,
          backgroundColor: lineColor,
          height: `${lineWidth}px`,
        }}
      />

      {/* Text above the line */}
      <div
        className="absolute pointer-events-none"
        style={{
          color,
          fontSize,
          top: `${midY - 24}px`, // Position above the line
          left: `${midX}px`,
          transform: 'translate(-50%, 0%)', // Center horizontally, position above
          whiteSpace: 'nowrap',
        }}
      >
        {content}
      </div>
    </>
  );
};

export default OverlayBox;
