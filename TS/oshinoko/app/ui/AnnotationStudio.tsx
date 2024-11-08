'use client';

import { useRef, useState } from 'react';
import { backendUrl } from '@/app/lib/config';
import VideoPlayer from '@/app/ui/VideoPlayer';
import VideoController from '@/app/ui/VideoController';
import AnnotationTools from '@/app/ui/AnnotationTools'; // 既に作成済みと仮定
import { AnnotatedSnapshot, LabelInfo } from '@/app/lib/types';

interface AnnotationStudioProps {
    addAnnotatedSnapshot: (snapshot: AnnotatedSnapshot) => void;
    labels: LabelInfo[];
}

const AnnotationStudio: React.FC<AnnotationStudioProps> = ({addAnnotatedSnapshot, labels }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isAnnotationMode, setIsAnnotationMode] = useState(false);

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

    return (
        <div className="w-full h-full flex flex-col">
            {/* Annotationモード開始ボタン */}
            {!isAnnotationMode && (
                <div className="mb-4">
                    <button
                        onClick={handleEnterAnnotationMode}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Enter Annotation Mode
                    </button>
                </div>
            )}
            {/* Video Player */}
            <div className="relative flex-1 h-80 sm:h-96 md:h-[24rem]">
                <VideoPlayer
                    ref={videoRef}
                    src={`${backendUrl}/videos/Supernova.mp4`}
                />
                {/* Annotationモード時にAnnotationToolsを表示 */}
                {isAnnotationMode && (
                    <AnnotationTools videoRef={videoRef} onExit={handleExitAnnotationMode}  addAnnotatedSnapshot={addAnnotatedSnapshot} labels={labels}/>
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
