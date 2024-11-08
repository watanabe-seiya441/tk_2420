'use client';

import { AnnotatedSnapshot, LabelInfo } from '@/app/lib/types';
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
                    {snapshot.annotations.map((annotation, index) => {
                        const label = labels.find((l) => l.label_id === annotation.class_id);
                        if (!label) return null;

                        const { x_center, y_center, width, height } = annotation;
                        const left = (x_center - width / 2) * 100;
                        const top = (y_center - height / 2) * 100;
                        const boxWidth = width * 100;
                        const boxHeight = height * 100;

                        return (
                            <div
                                key={index}
                                className="absolute border-2"
                                style={{
                                    left: `${left}%`,
                                    top: `${top}%`,
                                    width: `${boxWidth}%`,
                                    height: `${boxHeight}%`,
                                    borderColor: label.label_color,
                                }}
                            ></div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default PreviewSnapshots;
