'use client';
import { backendUrl } from '@/app/lib/config';
import { useState } from 'react';
import axios from 'axios';
import Header from '@/app/ui/Header';

const RecommendationPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [celebrityName, setCelebrityName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
    } else {
      alert('Only JPEG and PNG files are allowed.');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCelebrityName(response.data.celebrityName);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload the file. Please try again.');
    }
  };

  return (
    <div>
      <Header />
      <div>Recommendation Page</div>
      <input
        type="file"
        accept="image/jpeg, image/png"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600 transition duration-200"
      >
        Upload
      </button>
      {celebrityName && <div>Similar Celebrity: {celebrityName}</div>}
    </div>
  );
};

export default RecommendationPage;
