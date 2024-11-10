import { useEffect, useRef, useState } from 'react';
import { YOLOAnnotation, AnnotatedSnapshot, LabelInfo } from '@/app/lib/types';

interface PreviewSnapshotsProps {
    snapshots: AnnotatedSnapshot[];
    labels: LabelInfo[];
}

const PreviewSnapshots: React.FC<PreviewSnapshotsProps> = ({ snapshots }) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [boxStyle, setBoxStyle] = useState<{ width: string; height: string }>({ width: '0px', height: '0px' });
  const [imageUrls, setImageUrls] = useState<{ id: string; url: string }[]>([]);

  useEffect(() => {
    // BlobからURLを生成
    const urls = snapshots.map((snapshot) => ({
      id: snapshot.id,
      url: URL.createObjectURL(snapshot.imageBlob),
    }));
    setImageUrls(urls);

    return () => {
      // コンポーネントがアンマウントされたらBlob URLを開放
      urls.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [snapshots]);

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
  }, [imageUrls]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 p-1">
      {imageUrls.map(({ id, url }, index) => (
        <div key={id} className="relative w-full h-full">
          <img
            ref={index === 0 ? imageRef : null} // 最初の画像だけrefを設定する
            src={url}
            alt={`snapshot-${id}`}
            className="w-full h-auto"
          />
          <div
            className="absolute top-0 left-0 bg-black bg-opacity-30 pointer-events-none border-2"
            style={{
              width: boxStyle.width,
              height: boxStyle.height,
              borderColor: 'red',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PreviewSnapshots;
