'use client'

import { useEffect, useRef, useState } from 'react';

interface Position {
    time: number;
    x: number;
    y: number;
}

interface Overlay {
    id: string;
    content: string;
    color: string;
    fontSize: string;
    positions: Position[];
}

interface EnhancedVideoPlayerProps {
    src: string;
    overlayConfigUrl: string; // URL for JSON configuration file
}

const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({ src, overlayConfigUrl }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [overlays, setOverlays] = useState<Overlay[]>([]);
    const [currentPositions, setCurrentPositions] = useState<{ [key: string]: Position }>({});
    const [isOverlayVisible, setOverlayVisible] = useState<boolean>(true);

    const toggleOverlay = () => {
        setOverlayVisible((prev) => !prev);
    };

    useEffect(() => {
        // Fetch overlay configuration from JSON file
        fetch(overlayConfigUrl)
            .then((response) => response.json())
            .then((data) => setOverlays(data.overlays));
    }, [overlayConfigUrl]);

    useEffect(() => {
        const updateOverlayPositions = () => {
            if (!videoRef.current) return;
            const currentTime = videoRef.current.currentTime;

            const newPositions = overlays.reduce((acc, overlay) => {
                // Find the closest position in time for the overlay
                const closestPosition = overlay.positions.reduce((prev, curr) =>
                    Math.abs(curr.time - currentTime) < Math.abs(prev.time - currentTime) ? curr : prev
                );
                acc[overlay.id] = closestPosition;
                return acc;
            }, {} as { [key: string]: Position });

            setCurrentPositions(newPositions);
        };

        const videoElement = videoRef.current;
        videoElement?.addEventListener('timeupdate', updateOverlayPositions);

        return () => {
            videoElement?.removeEventListener('timeupdate', updateOverlayPositions);
        };
    }, [overlays]);

    return (
        <div className="relative w-full max-w-3xl mx-auto">
            {/* Video Player */}
            <video ref={videoRef} controls src={src} className="w-full rounded-lg">
                Your browser does not support the video tag.
            </video>

            {/* Overlay Texts with Dynamic Positions */}
            {isOverlayVisible && overlays.map((overlay) => {
                const position = currentPositions[overlay.id];
                if (!position) return null;

                return (
                    <div
                        key={overlay.id}
                        className="absolute pointer-events-none"
                        style={{
                            color: overlay.color,
                            fontSize: overlay.fontSize,
                            top: `${position.y}%`,
                            left: `${position.x}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {overlay.content}
                    </div>
                );
            })}
            <button
                onClick={toggleOverlay}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                {isOverlayVisible ? 'Hide' : 'Show'} Overlay
            </button>
        </div>
    );
};

export default EnhancedVideoPlayer;
