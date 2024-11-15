'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl, overlayUrlPrefix } from '@/app/lib/config';

interface UpdateOverlayProps {
  videoId: string;
  overlayUrl: string;
  videoUrl: string;
  groupName: string;
}

const UpdateOverlay: React.FC<UpdateOverlayProps> = ({
  videoId,
  overlayUrl,
  videoUrl,
  groupName,
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdateOverlay = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const response = await axios.post(
        `${backendUrl}/${overlayUrlPrefix}/update`,
        {
          video_id: videoId,
          overlay_url: overlayUrl,
          video_url: videoUrl,
          group_name: groupName,
        },
      );

      if (response.status === 200) {
        setMessage('Overlay updated successfully!');
      } else {
        setMessage('Failed to update overlay.');
      }
    } catch (error) {
      console.error('Error updating overlay:', error);
      setMessage('An error occurred while updating overlay.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update Overlay</h1>
      <button
        onClick={handleUpdateOverlay}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {loading ? 'Updating...' : 'Update Overlay'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateOverlay;
