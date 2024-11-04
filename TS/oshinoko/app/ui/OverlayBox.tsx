interface OverlayBoxProps {
    content: string;
    color: string;
    fontSize: string;
    top: number;
    left: number;
    width: number;
    height: number;
    visible: boolean;
}

const OverlayBox: React.FC<OverlayBoxProps> = ({ content, color, fontSize, top, left, width, height, visible }) => {
    if (!visible) return null;

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                color,
                fontSize,
                top: `${top}px`,
                left: `${left}px`,
                width: `${width}px`,
                height: `${height}px`,
                transform: 'translate(-50%, -50%)',
                display: visible ? 'block' : 'none',
            }}
        >
            {content}
        </div>
    );
};

export default OverlayBox;
