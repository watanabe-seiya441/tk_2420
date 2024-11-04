'use client'
import { useState } from 'react';

interface EnhancedVideoPlayerProps {
  src: string;
  overlayText?: string;
}

const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({ src, overlayText = "Sample Overlay Text" }) => {
  const [isOverlayVisible, setOverlayVisible] = useState(true);

  const toggleOverlay = () => {
    setOverlayVisible((prev) => !prev);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Video Player */}
      <video
        controls
        src={src}
        className="w-full rounded-lg"
      >
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      {isOverlayVisible && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          <p className="text-white bg-black bg-opacity-70 p-2 rounded">
            {overlayText}
          </p>
        </div>
      )}

      {/* Toggle Overlay Button */}
      <button
        onClick={toggleOverlay}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {isOverlayVisible ? "Hide Overlay" : "Show Overlay"}
      </button>
    </div>
  );
};

export default EnhancedVideoPlayer;
