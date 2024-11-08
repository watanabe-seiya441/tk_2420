'use client'

import { useEffect, useRef, useState } from 'react';
import OverlayBox from '@/app/ui/OverlayBox';

interface Position {
    time: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    visible: boolean;
}

interface Overlay {
    id: string;
    content: string;
    color: string;
    fontSize: string;
    lineColor: string;
    lineWidth: number;
    positions: Position[];
}

interface EnhancedVideoPlayerProps {
    src: string;
    overlayConfigUrl: string; // URL for JSON configuration file
    originalVideoWidth: number; // Original video width in pixels
    originalVideoHeight: number; // Original video height in pixels
}

const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({ src, overlayConfigUrl, originalVideoWidth, originalVideoHeight }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [overlays, setOverlays] = useState<Overlay[]>([]);
    const [currentPositions, setCurrentPositions] = useState<{ [key: string]: Position }>({});
    const [isOverlayVisible, setOverlayVisible] = useState<boolean>(true);

    // Create individual visibility states dynamically based on overlays
    const [individualVisibility, setIndividualVisibility] = useState<{ [key: string]: boolean }>({});

    const toggleOverlay = () => {
        setOverlayVisible((prev) => !prev);
    };

    const [scale, setScale] = useState({ x: 1, y: 1 });

    useEffect(() => {
        // Fetch overlay configuration from JSON file
        fetch(overlayConfigUrl)
            .then((response) => response.json())
            .then((data) => {
                setOverlays(data.overlays);
                const initialVisibility = data.overlays.reduce((acc: { [key: string]: boolean }, overlay: Overlay) => {
                    acc[overlay.content] = true;
                    return acc;
                }, {});
                setIndividualVisibility(initialVisibility);
            });
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

    // Calculate scaling factors whenever the video or container size changes
    useEffect(() => {
        const updateScale = () => {
            if (!videoRef.current) return;
            const { videoWidth, videoHeight, clientWidth, clientHeight } = videoRef.current;

            const scaleX = clientWidth / originalVideoWidth;
            const scaleY = clientHeight / originalVideoHeight;

            setScale({ x: scaleX, y: scaleY });
        };

        // Initial scale calculation
        updateScale();

        // Recalculate on resize or fullscreen change
        window.addEventListener('resize', updateScale);
        document.addEventListener('fullscreenchange', updateScale);

        return () => {
            window.removeEventListener('resize', updateScale);
            document.removeEventListener('fullscreenchange', updateScale);
        };
    }, [originalVideoWidth, originalVideoHeight]);

    const handleFullscreenToggle = () => {
        if (!containerRef.current) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            containerRef.current.requestFullscreen();
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-3xl mx-auto">
            {/* Video Player with Custom Fullscreen Button */}
            <video
                ref={videoRef}
                controls
                src={src}
                className="w-full rounded-lg"
                onDoubleClick={handleFullscreenToggle}
            >
                Your browser does not support the video tag.
            </video>
            <button
                onClick={handleFullscreenToggle}
                className="absolute top-2 right-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Fullscreen
            </button>

            {/* Overlay Texts with Dynamic Position, Size, and Visibility */}
            {isOverlayVisible && overlays.map((overlay) => {
                const position = currentPositions[overlay.id];
                if (!position || !position.visible) return null;

                // Determine visibility based on content dynamically
                const shouldRender = individualVisibility[overlay.content];

                if (!shouldRender) return null;

                const scaledStartX = position.startX * scale.x;
                const scaledStartY = position.startY * scale.y;
                const scaledEndX = position.endX * scale.x;
                const scaledEndY = position.endY * scale.y;

                return (
                    <OverlayBox
                        key={overlay.id}
                        content={overlay.content}
                        color={overlay.color}
                        fontSize={overlay.fontSize}
                        lineColor={overlay.lineColor}
                        lineWidth={overlay.lineWidth}
                        startX={scaledStartX}
                        startY={scaledStartY}
                        endX={scaledEndX}
                        endY={scaledEndY}
                        visible={position.visible}
                    />
                );
            })}
            <button
                onClick={toggleOverlay}
                // className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
                {isOverlayVisible ? 'Hide' : 'Show'} Overlay
            </button>
            
            {/* Individual Person Toggle Buttons */}
            {Object.keys(individualVisibility).map((content) => (
                <button
                    key={content}
                    onClick={() => setIndividualVisibility((prev) => ({
                        ...prev,
                        [content]: !prev[content]
                    }))}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    {individualVisibility[content] ? `Hide ${content}` : `Show ${content}`}
                </button>
            ))}
        </div>
    );
};

export default EnhancedVideoPlayer;
