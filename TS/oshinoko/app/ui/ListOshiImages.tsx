'use client';

import { useEffect, useState } from 'react';
import { backendUrl } from '@/app/lib/config';
import axios from 'axios';

interface ListOshiImageProps {
  selectedVideo: { video_url: string };
}

const ListOshiImages: React.FC<ListOshiImageProps> = ({ selectedVideo }) => {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const videoName = selectedVideo.video_url.split('/').pop(); // Get video name
        const response = await axios.post<string[]>(
          `${backendUrl}/api/list_oshi_images`,
          { videoName, member: 'giselle' }
        );
        setImages(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch images:', err);
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

  if (images.length === 0) {
    return <p>画像が見つかりません。</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {images.map((imageName, index) => (
        <img
          key={index}
          src={`${backendUrl}/photo/${selectedVideo.video_url.split('/').pop()}/giselle/${imageName}`}
          alt={`Image ${index + 1}`}
          className="w-full h-auto rounded-lg shadow-md"
        />
      ))}
    </div>
  );
};

export default ListOshiImages;
