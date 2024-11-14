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
  overlayConfigUrl,
}) => {
  const [members, setMembers] = useState<string[]>([]);
  const [imagesByMember, setImagesByMember] = useState<{
    [member: string]: string[];
  }>({});
  const [error, setError] = useState<string | null>(null);

  // タイトルが変わるたびにメンバー情報と画像リストをリセット
  useEffect(() => {
    console.log(
      'Title or overlayConfigUrl changed, resetting members and images',
    );
    setMembers([]);
    setImagesByMember({});
    setError(null); // エラーもリセット

    // メンバー情報をoverlayConfigUrlから取得
    const fetchMembers = async () => {
      try {
        const response = await axios.get(overlayConfigUrl);
        const data = response.data;
        console.log('Fetched data:', data);
        const extractedMembers = data.overlays.map(
          (overlay: { content: string }) => overlay.content,
        );
        console.log('Fetched members:', extractedMembers);
        setMembers(extractedMembers);
      } catch (err) {
        console.error('Failed to fetch members:', err);
        setError('メンバー情報を取得できませんでした。');
      }
    };

    fetchMembers();
  }, [title, overlayConfigUrl]);

  // 画像を各メンバーごとに取得
  useEffect(() => {
    if (members.length === 0) return; // メンバーが存在する場合のみ実行
    const fetchImagesForMember = async (member: string) => {
      try {
        const response = await axios.post<string[]>(
          `${backendUrl}/api/list_oshi_images`,
          {
            title,
            member,
          },
        );
        console.log(`Fetched images for ${member}:`, response.data);
        setImagesByMember((prev) => ({ ...prev, [member]: response.data }));
      } catch (err) {
        console.error(`Failed to fetch images for ${member}:`, err);
        setError('画像を取得できませんでした。');
      }
    };

    members.forEach((member) => fetchImagesForMember(member));
  }, [members]); // titleの依存関係を削除し、membersのみ依存関係にする

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
