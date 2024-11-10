'use client';

import { AnnotatedSnapshot, LabelInfo } from '@/app/lib/types';
import Image from 'next/image';
import React, { useRef, useEffect, useState } from 'react';

interface PreviewSnapshotsProps {
    snapshots: AnnotatedSnapshot[];
    labels: LabelInfo[];
}

const PreviewSnapshots: React.FC<PreviewSnapshotsProps> = ({ snapshots }) => {
    const imageRef = useRef<HTMLImageElement | null >(null);
    const [boxStyle, setBoxStyle] = useState<{ width: string; height: string }>({ width: '0px', height: '0px' });
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        const updateBoxStyle = () => {
        if (imageRef.current) {
            const { width, height } = imageRef.current.getBoundingClientRect();
            console.log(`Image size: Width = ${width}, Height = ${height}`);
            setBoxStyle({
            width: `${width}px`,
            height: `${height}px`,
            });
        }
        };

        updateBoxStyle();

        // ResizeObserverでリサイズを監視
        const resizeObserver = new ResizeObserver(() => {
        updateBoxStyle();
        });

        if (imageRef.current) {
        resizeObserver.observe(imageRef.current);
        }

        return () => {
        if (imageRef.current) {
            resizeObserver.unobserve(imageRef.current);
        }
        };
    }, []);


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {snapshots.map((snapshot) => (
                <div key={snapshot.id} className="relative border rounded">
                    {imageSize && (
                        <>

                        <Image
                            src={URL.createObjectURL(snapshot.imageBlob)}
                            alt={`Snapshot ${snapshot.id}`}
                            // className='w-full h-auto'
                            layout="responsive"
                            objectFit="contain"
                            width={imageSize.width} // 固定の幅
                            height={imageSize.height} // 固定の高さ
                        />

                        <div
                            className="absolute border-2"
                            style={{
                                left: 0,
                                top: 0,
                                width: 103,
                                height: 58,
                                borderColor: "red",
                            }}
                        ></div>
                        </>
                    )}
                </div>
            ))
            };
        </div>
    );
};

export default PreviewSnapshots;
