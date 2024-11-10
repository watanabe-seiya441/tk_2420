'use client';

import { AnnotatedSnapshot, LabelInfo } from '@/app/lib/types';
import { generateBoundingBoxesFromYOLO } from '@/app/lib/yoloUtils';
import Image from 'next/image';
import React from 'react';

interface PreviewSnapshotsProps {
    snapshots: AnnotatedSnapshot[];
    labels: LabelInfo[];
}

const PreviewSnapshots: React.FC<PreviewSnapshotsProps> = ({ snapshots, labels }) => {
    const imageWidth = 160;
    const imageHeihgt = 160;
    return (
        <div className="flex space-x-2 overflow-x-auto">
            <h1 className="text-lg font-bold">Annotation Preview</h1>
            {snapshots.map((snapshot) => (
                <div key={snapshot.id} className="relative border rounded">
                    <Image
                        src={URL.createObjectURL(snapshot.imageBlob)}
                        alt={`Snapshot ${snapshot.id}`}
                        layout="intrinsic"
                        objectFit="contain"
                        width={imageWidth} // 固定の幅
                        height={imageHeihgt} // 固定の高さ
                    />
                    {generateBoundingBoxesFromYOLO(snapshot.annotations, labels, imageWidth, imageHeihgt).map((box, index) => (
                        <div
                            key={index}
                            className="absolute border-2"
                            style={{
                                left: `${box.x}%`,
                                top: `${box.y}%`,
                                width: `${box.width}%`,
                                height: `${box.height}%`,
                                borderColor: box.color,
                            }}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PreviewSnapshots;
