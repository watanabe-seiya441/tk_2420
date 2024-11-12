'use client';
import { useState } from 'react';
import axios from 'axios';
import Header from '@/app/ui/Header';

const RecommendationPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [celebrityName, setCelebrityName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCelebrityName(response.data.celebrityName);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <Header />
      <div>Recommendation Page</div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {celebrityName && <div>Similar Celebrity: {celebrityName}</div>}
    </div>
  );
};

export default RecommendationPage;
