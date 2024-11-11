'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/ui/Header';
import PreviewSnapshots from '@/app/ui/PreviewSnapshots';
import AnnotationStudio from '@/app/ui/AnnotationStudio';
import VideoList from '@/app/ui/VideoList';
import { AnnotatedSnapshot, LabelInfo, Video } from '@/app/lib/types';
import { convertSnapshotToFiles } from '@/app/lib/snapshotUtils';
import { backendUrl } from '@/app/lib/config';
import axios from 'axios';

// TODO: set group name dynamically.
const GROUP_NAME = 'aespa';
const DEFAULT_VIDEO_URL = '/videos/Supernova.mp4';

const AnnotationPage: React.FC = () => {
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [annotatedSnapshots, setAnnotatedSnapshots] = useState<
    AnnotatedSnapshot[]
  >([]);
  const [labels, setLabels] = useState<LabelInfo[]>([]);
  const [groupName, setGroupName] = useState<string>(GROUP_NAME);
  const [videoUrl, setVideoUrl] = useState<string>(DEFAULT_VIDEO_URL);

  const addAnnotatedSnapshot = (snapshot: AnnotatedSnapshot) => {
    setAnnotatedSnapshots((prev) => [...prev, snapshot]);
  };

  const fetchLabelInfo = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/annotation_labels`, {
        params: { groupName },
      });
      setLabels(response.data);
      console.log('Labels fetched:', response.data);
    } catch (error) {
      console.error('Failed to fetch labels:', error);
    }
  };

  useEffect(() => {
    if (groupName) {
      fetchLabelInfo();
    }
  }, [groupName]);

  const uploadAnnotatedSnapshots = async () => {
    if (annotatedSnapshots.length === 0) {
      alert('No snapshots to upload.');
      return;
    }
    try {
      for (const snapshot of annotatedSnapshots) {
        const { imageFile, annotationFile } = convertSnapshotToFiles(snapshot);

        // Prepare FormData
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('annotation', annotationFile);
        formData.append('groupName', groupName);

        // Send to backend
        await axios.post(`${backendUrl}/api/upload_annotation`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      console.log('All snapshots uploaded successfully.');
      setAnnotatedSnapshots([]);
    } catch (error) {
      console.error('Error uploading snapshots:', error);
      alert('Failed to upload snapshots. Please try again.');
    }
  };

  const clearSnapshots = () => {
    if (annotatedSnapshots.length === 0) {
      alert('No snapshots to clear.');
      return;
    }
    window.confirm('Are you sure you want to clear all snapshots?');
    setAnnotatedSnapshots([]);
  };

  const handleVideoSelect = (video: Video) => {
    setVideoUrl(video.video_url);
    console.log('Selected video:', videoUrl);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Side: Video Player and Annotation Tools */}
        <div className="w-3/4 p-4 flex flex-col space-y-4 relative">
          <AnnotationStudio
            addAnnotatedSnapshot={addAnnotatedSnapshot}
            isAnnotationMode={isAnnotationMode}
            setIsAnnotationMode={setIsAnnotationMode}
            labels={labels}
            videoUrl={videoUrl}
          />
        </div>

        {/* Right Side: Video List or Snapshot Preview */}
        <div className="w-1/4 p-4 bg-gray-50">
          {isAnnotationMode || annotatedSnapshots.length !== 0 ? (
            <>
              <button
                onClick={uploadAnnotatedSnapshots}
                className="mt-4 p-2 bg-blue-600 text-white rounded"
              >
                Upload Snapshots
              </button>
              <button
                onClick={clearSnapshots}
                className="mt-4 p-2 bg-red-600 text-white rounded"
              >
                Clear Snapshots
              </button>

              <PreviewSnapshots
                snapshots={annotatedSnapshots}
                labels={labels}
              />
            </>
          ) : (
            <VideoList onSelectVideo={handleVideoSelect} groupName="aespa" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnotationPage;
