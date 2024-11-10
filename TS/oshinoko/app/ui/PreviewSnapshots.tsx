'use client';

import { AnnotatedSnapshot, LabelInfo } from '@/app/lib/types';
import { generateBoundingBoxesFromYOLO } from '@/app/lib/yoloUtils';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface PreviewSnapshotsProps {
    snapshots: AnnotatedSnapshot[];
    labels: LabelInfo[];
}

const PreviewSnapshots: React.FC<PreviewSnapshotsProps> = ({ snapshots, labels }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [imageSize, setImageSize] = useState({ width: 30, height: 30 });

    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setImageSize({ width, height });
        }
    }, [snapshots]);
    console.log(containerRef.current?.getBoundingClientRect());
    return (
        <div className="grid grid-cols-auto-fit gap-4">
            <h1 className="text-lg font-bold">Annotation Preview</h1>
            {snapshots.map((snapshot) => (
                <div ref={containerRef} key={snapshot.id} className="relative border rounded">
                    <Image
                        src={URL.createObjectURL(snapshot.imageBlob)}
                        alt={`Snapshot ${snapshot.id}`}
                        layout="responsive"
                        objectFit="contain"
                        width={imageSize.width} // 固定の幅
                        height={imageSize.height} // 固定の高さ
                    />
                    {generateBoundingBoxesFromYOLO(snapshot.annotations, labels, imageSize.width, imageSize.height).map((box, index) => (
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
