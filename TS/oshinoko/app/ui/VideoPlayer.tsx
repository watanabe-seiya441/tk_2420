'use client';

import { forwardRef } from 'react';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src }, ref) => {
    return (
      <video
        ref={ref}
        src={src}
        className="w-full h-full object-contain"
        controls
        controlsList="nofullscreen nodownload"
        disablePictureInPicture
        autoPlay
        crossOrigin="anonymous" // CORS許可
      >
        Your browser does not support the video tag.
      </video>
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
