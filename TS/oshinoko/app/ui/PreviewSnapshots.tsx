'use client';

import { AnnotatedSnapshot } from '@/app/lib/types';

interface PreviewSnapshotsProps {
    snapshots: AnnotatedSnapshot[];
}

const PreviewSnapshots: React.FC<PreviewSnapshotsProps> = ({ snapshots }) => {
    return (
        <div className="flex space-x-2 overflow-x-auto">
            {snapshots.map((snapshot) => (
                <div key={snapshot.id} className="relative w-40 h-40 border rounded">
                    <img
                        src={URL.createObjectURL(snapshot.imageBlob)}
                        alt={`Snapshot ${snapshot.id}`}
                        className="object-cover w-full h-full"
                    />
                    {/* アノテーションに関する追加情報を表示する場合はここに */}
                </div>
            ))}
        </div>
    );
};

export default PreviewSnapshots;
