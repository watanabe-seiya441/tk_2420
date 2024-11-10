import { useState } from 'react';
import { BoundingBox } from '@/app/lib/types';

const useBoundingBoxManager = () => {
  const [currentBox, setCurrentBox] = useState<BoundingBox | null>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);

  // ボックスを確定する関数
  const confirmBox = (box: BoundingBox) => {
    setBoundingBoxes((prev) => [...prev, box]);
    setCurrentBox(null);
  };

  const clearCurrentBox = () => setCurrentBox(null);

  const clearAllBoxes = () => setBoundingBoxes([]);

  return {
    currentBox,
    setCurrentBox,
    clearCurrentBox,
    boundingBoxes,
    setBoundingBoxes,
    confirmBox,
    clearAllBoxes,
  };
};

export default useBoundingBoxManager;
