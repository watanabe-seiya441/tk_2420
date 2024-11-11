'use client';

import { useState, useEffect } from 'react';

interface VideoControllerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoController: React.FC<VideoControllerProps> = ({ videoRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // isPlayingが自動的にビデオの再生状態を反映するようにする。
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // 初期状態を設定
    setIsPlaying(!video.paused);

    // クリーンアップ
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleSkip = (seconds: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime += seconds;
    }
  };

  return (
    <div className="flex space-x-4 mt-2">
      <button
        onClick={() => handleSkip(-10)}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        -10s
      </button>
      <button
        onClick={() => handleSkip(-0.25)}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        -0.25s
      </button>
      <button
        onClick={handlePlayPause}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={() => handleSkip(0.25)}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        +0.25s
      </button>
      <button
        onClick={() => handleSkip(10)}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        +10s
      </button>
    </div>
  );
};

export default VideoController;
