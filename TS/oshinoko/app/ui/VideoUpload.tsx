// TODO: this is not integrated with backend.
'use client';
import { useState } from 'react';

const VideoUpload = () => {
  const [message, setMessage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    const file = (event.target as HTMLFormElement).video.files[0];

    formData.append('video', file);

    setMessage('Processing video, please wait...');

    // Send file to the backend for processing
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      setVideoUrl(`http://localhost:5000/${result.filePath}`); // URL for the processed video
      setMessage('Video processed successfully!');
    } else {
      setMessage('Failed to upload the video. Please try again.');
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
      {videoUrl && (
        <video
          controls
          src={videoUrl}
          className="mt-4 mx-auto"
          style={{ maxWidth: '100%' }}
        />
      )}
    </div>
  );
};

export default VideoUpload;
