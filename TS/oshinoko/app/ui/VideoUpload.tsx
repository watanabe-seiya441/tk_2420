'use client';
import { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '@/app/lib/config';
import EnhancedVideoPlayer from '@/app/ui/EnhancedVideoPlayer';

const VideoUpload = () => {
  const [message, setMessage] = useState<string>('');
  const [videoData, setVideoData] = useState<{
    title: string;
    group_name: string;
    video_url: string;
    overlay_url: string;
    original_video_width: number;
    original_video_height: number;
  } | null>(null);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', 'Sample Video'); // 動画タイトルをここに追加
    formData.append('group_name', 'Sample Group'); // グループ名をここに追加

    const fileInput = (event.target as HTMLFormElement).elements.namedItem(
      'video',
    ) as HTMLInputElement;

    if (fileInput?.files) {
      formData.append('video', fileInput.files[0]);
    } else {
      setMessage('No video file selected.');
      return;
    }

    setMessage('Processing video, please wait...');

    try {
      // Send file to the backend for processing
      const response = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
      <p>{message}</p>
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
