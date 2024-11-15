'use client';

import { useEffect, useState } from 'react';
import { backendUrl, memberProfileUrlPrefix } from '@/app/lib/config';
import axios from 'axios';

interface ListOshiImageProps {
  videoTitle: string;
  groupName: string;
}

const ListOshiImages: React.FC<ListOshiImageProps> = ({
  videoTitle,
  groupName,
}) => {
  const [members, setMembers] = useState<string[]>([]);
  const [imagesByMember, setImagesByMember] = useState<{
    [member: string]: string[];
  }>({});
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 動画タイトルやグループ名が変わるたびにメンバー情報と画像をリセット
  useEffect(() => {
    console.log(
      'Video title or group name changed, resetting members and images',
    );
    setMembers([]);
    setImagesByMember({});
    setSelectedMembers([]);
    setError(null); // エラーもリセット

    // メンバー情報を取得
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/${memberProfileUrlPrefix}`,
          {
            params: { groupName }, // groupNameをリクエストパラメータとして使用
          },
        );
        const data = response.data;
        // console.log('Fetched data:', data);

        // `name` をメンバーとして抽出
        const extractedMembers = data.map(
          (profile: { name: string }) => profile.name,
        );

        // console.log('Fetched members:', extractedMembers);
        setMembers(extractedMembers);

        // デフォルトで1番目のメンバーを選択
        if (extractedMembers.length > 0) {
          setSelectedMembers([extractedMembers[0]]);
        }
      } catch (err) {
        console.error('Failed to fetch members:', err);
        setError('メンバー情報を取得できませんでした。');
      }
    };

    fetchMembers();
  }, [groupName, videoTitle]);

  // 画像を各メンバーごとに取得
  useEffect(() => {
    if (members.length === 0) return; // メンバーが存在する場合のみ実行
    const fetchImagesForMember = async (member: string) => {
      try {
        const response = await axios.post<string[]>(
          `${backendUrl}/api/list_oshi_photos`,
          {
            videoTitle,
            member,
          },
        );
        // console.log(`Fetched images for ${member}:`, response.data);
        setImagesByMember((prev) => ({ ...prev, [member]: response.data }));
      } catch (err) {
        // 画像が存在しない場合には空の配列を設定する
        // console.log(`No images found for ${member}, setting empty list.`);
        setImagesByMember((prev) => ({ ...prev, [member]: [] }));
      }
    };

    members.forEach((member) => fetchImagesForMember(member));
  }, [members, videoTitle]);

  // メンバー選択・解除の切り替え
  const toggleMemberSelection = (member: string) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(member)
        ? prevSelected.filter((m) => m !== member)
        : [...prevSelected, member],
    );
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center mb-4">
        推しメンバーを選択
      </h2>
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {members.map((member) => (
          <button
            key={member}
            onClick={() => toggleMemberSelection(member)}
            className={`px-4 py-2 rounded-lg shadow transition-colors duration-200 ${
              selectedMembers.includes(member)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-blue-400 hover:text-white'
            }`}
          >
            {member}
          </button>
        ))}
      </div>

      {selectedMembers.map((member) => (
        <div key={member} className="bg-gray-100 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-center text-blue-600 mb-4">
            {member} の画像
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-4">
              {(imagesByMember[member] || []).map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${member} Image ${index + 1}`}
                  className="h-48 w-auto rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105"
                />
              ))}
            </div>
          </div>
          {(imagesByMember[member] || []).length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              画像が見つかりませんでした
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListOshiImages;
