'use client';

import Header from '@/app/ui/Header';
import PreviewSnapshots from '@/app/ui/PreviewSnapshots';

import AnnotationStudio from '@/app/ui/AnnotationStudio';
import VideoList from '@/app/ui/VideoList';

const AnnotationPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="flex flex-1">
                {/* Left Side: Video Player and Annotation Tools */}
                <div className="w-3/4 p-4 flex flex-col space-y-4 relative">

                    <AnnotationStudio />

                    {/* Preview Area */}
                    <div className="h-40">
                        <PreviewSnapshots />
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
