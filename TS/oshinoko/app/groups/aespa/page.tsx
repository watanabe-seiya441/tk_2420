'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import EnhancedVideoPlayer from '@/app/ui/EnhancedVideoPlayer';
import Header from '@/app/ui/Header';
import VideoList from '@/app/ui/VideoList';
import VideoUpload from '@/app/ui/VideoUpload';
import ListOshiImages from '@/app/ui/ListOshiImages';
import { Video } from '@/app/lib/types';
import { backendUrl } from '@/app/lib/config';

const AespaPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [trainingMessage, setTrainingMessage] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  
  // モデル学習のハンドラー
  const handleModelTraining = async () => {
    try {
      setTrainingMessage("Model training is starting...");
      setIsTraining(true);
      const response = await axios.post(`${backendUrl}/api/train_model`, {
        // groupName: selectedVideo.group_name,
        groupName: "aespa",
      });
      setTrainingMessage(response.data.message || "Model training has started.");
    } catch (error) {
      setTrainingMessage("Failed to start model training.");
      console.error("Error:", error);
      setIsTraining(false);
    }
  };

  // 学習ステータスのポーリング
  useEffect(() => {
    if (!isTraining) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/train_status`);
        if (response.data.status === "completed") {
          setTrainingMessage("Model training is completed.");
          setIsTraining(false);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error fetching training status:", error);
      }
    }, 5000); // 5秒ごとに確認

    return () => clearInterval(intervalId); // クリーンアップ
  }, [isTraining]);

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-10 text-center flex">
        <div className="flex-1 text-left">
          <h1 className="text-4xl font-bold">Aespa</h1>
          <p className="mt-4 text-lg text-gray-700">
            A K-pop girl group from SM Entertainment.
          </p>
          <VideoUpload />

          {/* Annotate Button */}
          {selectedVideo ? (
            <Link
              href={`/annotation?videoUrl=${encodeURIComponent(selectedVideo.video_url)}&currentTime=10`}
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Annotate
            </Link>
          ) : (
            <p className="mt-4 text-red-500">動画を選択してください</p>
          )}

          {/* Model Training ボタン */}
          <button
            onClick={handleModelTraining}
            className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Start Model Training
          </button>
          {/* トレーニングのメッセージを表示 */}
          {trainingMessage && <p className="mt-2 text-blue-500">{trainingMessage}</p>}

          {/* Enhanced Video Player */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">
              Watch Aespa’s Latest Video
            </h2>
            {selectedVideo ? (
              <EnhancedVideoPlayer
                src={`${backendUrl}${selectedVideo.video_url}`}
                overlayConfigUrl={`${backendUrl}${selectedVideo.overlay_url}`}
                originalVideoWidth={selectedVideo.original_video_width}
                originalVideoHeight={selectedVideo.original_video_height}
              />
            ) : (
              <p className="mt-4">Select a video from the list to play.</p>
            )}
          </div>
          {/* List Oshi Image*/}
          {selectedVideo && (
            <ListOshiImages
              videoTitle={selectedVideo.title}
              groupName={selectedVideo.group_name}
            />
          )}
        </div>

        {/* Video List on the right */}
        <VideoList onSelectVideo={setSelectedVideo} groupName="aespa" />
      </div>
    </main>
  );
};

export default AespaPage;
