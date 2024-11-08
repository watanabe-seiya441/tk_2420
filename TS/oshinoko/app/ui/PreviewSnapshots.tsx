'use client';

import { AnnotatedSnapshot, LabelInfo } from '@/app/lib/types';
import { BoundingBox } from '@/app/ui/AnnotationTools';
import { generateBoundingBoxesFromYOLO } from '@/app/lib/yoloUtils';
import Image from 'next/image';
import React from 'react';

interface PreviewSnapshotsProps {
    snapshots: AnnotatedSnapshot[];
    labels: LabelInfo[];
}

const PreviewSnapshots: React.FC<PreviewSnapshotsProps> = ({ snapshots, labels }) => {
    return (
        <div className="flex space-x-2 overflow-x-auto">
            {snapshots.map((snapshot) => (
                <div key={snapshot.id} className="relative w-40 h-40 border rounded">
                    <Image
                        src={URL.createObjectURL(snapshot.imageBlob)}
                        alt={`Snapshot ${snapshot.id}`}
                        layout="fill"
                        objectFit='cover'
                    />
                    {generateBoundingBoxesFromYOLO(snapshot.annotations, labels).map((box, index) => (
                        <div
                            key={index}
                            className="absolute border-2"
                            style={{
                                left: `${box.left}%`,
                                top: `${box.top}%`,
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
