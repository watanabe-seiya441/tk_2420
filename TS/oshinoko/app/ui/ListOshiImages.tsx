'use client';

import { useEffect, useState } from 'react';
import { backendUrl } from '@/app/lib/config';
import axios from 'axios';

interface ListOshiImageProps {
  selectedVideo: { video_url: string };
}

const ListOshiImages: React.FC<ListOshiImageProps> = ({ selectedVideo }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const videoName = selectedVideo.video_url.split('/').pop()?.replace('.mp4', ''); // 拡張子なしのビデオ名
        const response = await axios.post<string[]>(
          `${backendUrl}/api/list_oshi_images`,
          { videoName, member: 'giselle' }
        );
        setImageUrls(response.data); // URLリストを状態に設定
        setError(null);
      } catch (err) {
        console.error('Failed to fetch image URLs:', err);
        setError('画像を取得できませんでした。');
      }
    };

    if (selectedVideo) {
      fetchImages();
    }
  }, [selectedVideo]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (imageUrls.length === 0) {
    return <p>画像が見つかりません。</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={url} // 画像URLをsrcに直接設定
          alt={`Image ${index + 1}`}
          className="w-full h-auto rounded-lg shadow-md"
        />
      ))}
    </div>
  );
};

export default ListOshiImages;
