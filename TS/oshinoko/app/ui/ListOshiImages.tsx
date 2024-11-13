'use client';

import { useEffect, useState } from 'react';
import { backendUrl } from '@/app/lib/config';
import axios from 'axios';

interface ListOshiImageProps {
  title: string;
  overlayConfigUrl: string; // URL for JSON configuration file
}

const ListOshiImages: React.FC<ListOshiImageProps> = ({
  title,
  overlayConfigUrl
}) => {
  const members = ['giselle', 'karina', 'winter', 'ningning']; // 表示するメンバーのリスト
  const [imagesByMember, setImagesByMember] = useState<{ [member: string]: string[] }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImagesForMember = async (member: string) => {
      try {
        const response = await axios.post<string[]>(`${backendUrl}/api/list_oshi_images`, {
          title,
          member,
        });
        setImagesByMember((prev) => ({ ...prev, [member]: response.data }));
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch images for ${member}:`, err);
        setError('画像を取得できませんでした。');
      }
    };

    members.forEach((member) => fetchImagesForMember(member));
  }, [title]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8">
      {members.map((member) => (
        <div key={member}>
          <h3 className="text-xl font-semibold mb-2">{member}</h3>
          <div className="overflow-x-auto" style={{ width: '100%' }}>
            <div className="flex gap-4">
              {(imagesByMember[member] || []).map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${member} Image ${index + 1}`}
                  className="h-48 w-auto rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListOshiImages;
