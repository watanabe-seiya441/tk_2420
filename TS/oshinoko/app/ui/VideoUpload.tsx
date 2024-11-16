'use client';
import { useState } from 'react';
import { Video } from '@/app/lib/types';
import axios from 'axios';
import { backendUrl, videoUrlPrefix } from '@/app/lib/config';
import EnhancedVideoPlayer from '@/app/ui/EnhancedVideoPlayer';

interface VideoUploadProps {
  group: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ group }) => {
  const [message, setMessage] = useState<string>('');
  const [videoData, setVideoData] = useState<Video | null>(null);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    const fileInput = (event.target as HTMLFormElement).elements.namedItem(
      'video',
    ) as HTMLInputElement;

    if (fileInput?.files) {
      const selectedFile = fileInput.files[0];

      const fullFileName = selectedFile.name;
      const fileName = fullFileName.slice(0, fullFileName.lastIndexOf('.'));
      formData.append('video', selectedFile);
      formData.append('title', fileName);
      formData.append('group_name', group);
    } else {
      setMessage('No video file selected.');
      return;
    }

    setMessage('Processing video, please wait...');

    try {
      // Send file to the backend for processing
      const response = await axios.post<Video>(
        `${backendUrl}/${videoUrlPrefix}/upload/mp4`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setMessage('Video processed successfully!');
      setVideoData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(
          `Failed to upload the video. Error: ${error.response.status}`,
        );
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="text-center">
      <form onSubmit={handleUpload} className="mb-4">
        <input
          type="file"
          name="video"
          accept="video/*"
          required
          className="block mx-auto my-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload Video
        </button>
      </form>
      <p
        className={`mt-4 ${
          message.includes('successfully') ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {message}
      </p>
      {videoData ? (
        <EnhancedVideoPlayer
          src={`${backendUrl}${videoData.video_url}`}
          overlayConfigUrl={`${backendUrl}${videoData.overlay_url}`}
          originalVideoWidth={videoData.original_video_width}
          originalVideoHeight={videoData.original_video_height}
        />
      ) : (
        <p className="mt-4">Select a video from the list to play.</p>
        // <EnhancedVideoPlayer
        //   src={`${backendUrl}/videos/Supernova.mp4`}
        //   overlayConfigUrl={`${backendUrl}/overlays/Supernova_overlay.json`}
        //   originalVideoWidth={640}
        //   originalVideoHeight={360}
        // />
      )}
    </div>
  );
};

export default VideoUpload;
