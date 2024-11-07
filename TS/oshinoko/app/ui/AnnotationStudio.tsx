'use client';

import { useRef } from 'react';
import { backendUrl } from '@/app/lib/config';
import VideoPlayer from '@/app/ui/VideoPlayer';
import VideoController from '@/app/ui/VideoController';
// import AnnotationTools from './AnnotationTools'; // 既に作成済みと仮定

interface AnnotationStudioProps {
    // 必要なプロパティがあれば追加
}

const AnnotationStudio: React.FC<AnnotationStudioProps> = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div className="w-full h-full flex flex-col">
            {/* Video Player */}
            <div className="relative flex-1 h-80 sm:h-96 md:h-[24rem]"> {/* 高さを固定 */}
                <VideoPlayer
                    ref={videoRef}
                    src={`${backendUrl}/videos/Supernova.mp4`}
                />
                <VideoController videoRef={videoRef} />
            </div>
        </div>
    );
};

export default AnnotationStudio;
