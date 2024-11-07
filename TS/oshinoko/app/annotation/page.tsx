'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { backendUrl } from '@/app/lib/config';

const AnnotationPage = () => {
    const searchParams = useSearchParams();
    const videoUrl = searchParams.get('videoUrl');
    const currentTime = parseFloat(searchParams.get('currentTime') || '0');
    console.log(currentTime);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-3xl p-4 bg-white shadow-lg rounded">
                <h2 className="text-2xl font-bold mb-4">Annotate Video</h2>
                {videoUrl ? (
                    // TODO: currentTimeを使って再生位置を指定する。
                    <video
                        src={`${backendUrl}${videoUrl}`}
                        controls
                    >
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <p>動画を読み込んでいます...</p>
                )}

                {/* 戻るボタン */}
                {/* TODO: aespa以外から来ても戻れるようにする. */}
                {/* TODO: 戻ったときにさっきまで再生していたところに戻りたい。 */}
                <Link
                    href="/groups/aespa"
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Back
                </Link>
            </div>
        </div>
    );
};

export default AnnotationPage;
