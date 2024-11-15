'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '@/app/lib/config';

interface ModelTrainingProps {
  groupName: string;
}

const ModelTraining: React.FC<ModelTrainingProps> = ({ groupName }) => {
  const [trainingMessage, setTrainingMessage] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState<boolean>(false);

  // モデル学習の開始ハンドラー
  const handleModelTraining = async () => {
    try {
      setTrainingMessage('Model training is starting...');
      setIsTraining(true);
      const response = await axios.post(`${backendUrl}/api/train_model`, {
        groupName,
      });
      setTrainingMessage(
        response.data.message || 'Model training is in progress...',
      );
    } catch (error) {
      setTrainingMessage('Failed to start model training.');
      console.error('Error:', error);
      setIsTraining(false);
    }
  };

  // 学習ステータスのポーリング
  useEffect(() => {
    if (!isTraining) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/train_status`);
        if (response.data.status === 'completed') {
          setTrainingMessage('Model training is completed.');
          setIsTraining(false); // トレーニング終了後にボタンを再度有効化
          clearInterval(intervalId);
        } else {
          setTrainingMessage('Model training is in progress... Please wait.');
        }
      } catch (error) {
        console.error('Error fetching training status:', error);
        setTrainingMessage('Error checking training status.');
        setIsTraining(false);
        clearInterval(intervalId);
      }
    }, 5000); // 5秒ごとに確認

    return () => clearInterval(intervalId); // クリーンアップ
  }, [isTraining]);

  return (
    <div className="mt-4">
      <button
        onClick={handleModelTraining}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        disabled={isTraining} // トレーニング中はボタンを無効化
      >
        {isTraining ? 'Training in Progress...' : 'Start Model Training'}
      </button>
      {trainingMessage && (
        <p className="mt-2 text-blue-500">{trainingMessage}</p>
      )}
    </div>
  );
};

export default ModelTraining;
