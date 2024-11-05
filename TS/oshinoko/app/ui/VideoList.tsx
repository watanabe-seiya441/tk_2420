'use client'
import { useEffect, useState } from 'react';
import { Video } from '@/app/lib/types';
import { backendUrl } from '@/app/lib/config';


interface VideoListProps {
    onSelectVideo: (video: Video) => void; // Function to set the selected video in AespaPage
}

const VideoList: React.FC<VideoListProps> = ({ onSelectVideo }) => {
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        // TDOO: not limited to aespa group
        // Fetch the list of videos for the aespa group
        fetch(`${backendUrl}/api/videos?group=aespa`)
            .then((res) => res.json())
            .then((data) => setVideos(data))
            .catch((error) => console.error("Error fetching videos:", error));
    }, []);

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
