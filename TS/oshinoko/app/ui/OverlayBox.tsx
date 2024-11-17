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

  return (
    <>
      {/* Line */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${startY}px`,
          left: `${startX}px`,
          width: `${endX - startX}px`, // Line length
          backgroundColor: lineColor,
          height: `${lineWidth + 3}px`,
        }}
      />

      {/* Text above the line */}
      <div
        className="absolute pointer-events-none"
        style={{
          color,
          fontSize: '34px',
          top: `${startY - 40}px`, // Position above the line
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
