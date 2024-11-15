'use client';
import { useEffect, useState } from 'react';
import { Video } from '@/app/lib/types';
import { backendUrl, videoUrlPrefix } from '@/app/lib/config';

interface VideoListProps {
  onSelectVideo: (video: Video) => void;
  groupName: string;
}

const VideoList: React.FC<VideoListProps> = ({ onSelectVideo, groupName }) => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    // Fetch the list of videos for the selected group
    fetch(`${backendUrl}/${videoUrlPrefix}/list?group_name=${groupName}`)
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((error) => console.error('Error fetching videos:', error));
  }, [groupName]);

  return (
    <div className="p-4 border-l border-gray-300">
      <h3 className="text-lg font-semibold mb-4">Available Songs</h3>
      <ul>
        {videos.map((video) => (
          <li
            key={video.id}
            className="cursor-pointer hover:underline mb-2"
            onClick={() => onSelectVideo(video)}
          >
            {video.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoList;
