'use client';

import { useState } from 'react';
import Header from '@/app/ui/Header';
import PreviewSnapshots from '@/app/ui/PreviewSnapshots';

import AnnotationStudio from '@/app/ui/AnnotationStudio';
import VideoList from '@/app/ui/VideoList';
import { AnnotatedSnapshot } from '@/app/lib/types';

const AnnotationPage: React.FC = () => {
    const [annotatedSnapshots, setAnnotatedSnapshots] = useState<AnnotatedSnapshot[]>([]);
    const addAnnotatedSnapshot = (snapshot: AnnotatedSnapshot) => {
        setAnnotatedSnapshots((prev) => [...prev, snapshot]);
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="flex flex-1">
                {/* Left Side: Video Player and Annotation Tools */}
                <div className="w-3/4 p-4 flex flex-col space-y-4 relative">

                    <AnnotationStudio addAnnotatedSnapshot={addAnnotatedSnapshot} />

                    {/* Preview Area */}
                    <div className="h-40">
                        <PreviewSnapshots snapshots={annotatedSnapshots} />
                    </div>
                </div>

                {/* Right Side: Video List */}
                <div className="w-1/4 p-4 bg-gray-50">
                    <VideoList
                        onSelectVideo={() => { return; }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnnotationPage;
