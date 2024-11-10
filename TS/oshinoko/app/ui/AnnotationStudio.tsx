'use client';

import { useRef, useState } from 'react';
import { backendUrl } from '@/app/lib/config';
import VideoPlayer from '@/app/ui/VideoPlayer';
import VideoController from '@/app/ui/VideoController';
import BoundingBoxDrawer from '@/app/ui/BoundingBoxDrawer';
import { AnnotatedSnapshot, LabelInfo } from '@/app/lib/types';
import useBoundingBoxManager from "@/app/hooks/useBoundingBoxManager";
import { generateYOLOAnnotations } from "@/app/lib/yoloUtils";

interface AnnotationStudioProps {
    addAnnotatedSnapshot: (snapshot: AnnotatedSnapshot) => void;
    isAnnotationMode: boolean;
    setIsAnnotationMode: React.Dispatch<React.SetStateAction<boolean>>;
    labels: LabelInfo[];
}

const AnnotationStudio: React.FC<AnnotationStudioProps> = ({ addAnnotatedSnapshot,isAnnotationMode, setIsAnnotationMode, labels }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const {
        currentBox,
        setCurrentBox,
        clearCurrentBox,
        boundingBoxes,
        confirmBox,
        clearAllBoxes,
    } = useBoundingBoxManager();

    const handleEnterAnnotationMode = () => {
        const video = videoRef.current;
        if (video) {
            video.pause();
            setIsAnnotationMode(true);
        }
    }
    const handleExitAnnotationMode = () => {
        const video = videoRef.current;
        if (video) {
            video.play();
            setIsAnnotationMode(false);
        }
    }

    const handleFinishAnnotation = async () => {
        if (boundingBoxes.length === 0) {
            alert('Please annotate at least one object.');
            return;
        }
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
        clearAllBoxes();
    };


    return (
        <div className="w-full h-full flex flex-col">
            {/* Annotationモード開始ボタン */}
            {!isAnnotationMode ? (
                <div className="mb-4">
                    <button
                        onClick={handleEnterAnnotationMode}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Enter Annotation Mode
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <button
                            onClick={() => { clearAllBoxes(); handleExitAnnotationMode(); }}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Exit Annotation Mode
                        </button>

                    </div>

                    {/* アノテーション終了ボタン */}
                    <button
                        onClick={handleFinishAnnotation}
                        className="absolute top-4 right-20 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Finish Annotation
                    </button>
                </>
            )}
            {/* Video Player */}
            <div className="relative">
                <VideoPlayer
                    ref={videoRef}
                    src={`${backendUrl}/videos/Supernova.mp4`}
                />
                {/* Annotationモード時にBoundingBoxDrawerを表示 */}
                {isAnnotationMode && (
                    <BoundingBoxDrawer labels={labels}
                        currentBox={currentBox} setCurrentBox={setCurrentBox} clearCurrentBox={clearCurrentBox} boundingBoxes={boundingBoxes}
                        confirmBox={confirmBox} 
                    />
                )}
            </div>

            {/* Video Controller */}
            <div className="mt-4">
                <VideoController videoRef={videoRef} />
            </div>
        </div>
    );
};

export default AnnotationStudio;
