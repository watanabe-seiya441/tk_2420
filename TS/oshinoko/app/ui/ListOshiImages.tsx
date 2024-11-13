'use client';

import { useEffect, useState } from 'react';
import { backendUrl } from '@/app/lib/config';
import axios from 'axios';

interface ListOshiImageProps {

  title: string;
}

const ListOshiImages: React.FC<ListOshiImageProps> = ({title }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post<string[]>(`${backendUrl}/api/list_oshi_images`, { title });
        setImageUrls(response.data); // URLリストを状態に設定
        setError(null);
      } catch (err) {
        console.error('Failed to fetch image URLs:', err);
        setError('画像を取得できませんでした。');
      }
    };

    fetchImages(); // 画像のフェッチ関数を呼び出し
  }, [title]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (imageUrls.length === 0) {
    return <p>画像が見つかりません。</p>;
  }

  return (
    <div className="overflow-x-auto mt-4" style={{ width: '100%' }}>
      <div className="flex gap-4">
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Image ${index + 1}`}
            className="h-48 w-auto rounded-lg shadow-md"
          />
        ))}
      </div>
    </div>
  );
};

export default ListOshiImages;
