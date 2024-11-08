import { BoundingBox } from '@/app/ui/AnnotationTools';
import { YOLOAnnotation } from '@/app/lib/types';

export const generateYOLOAnnotations = (boundingBoxes: BoundingBox[], imageWidth: number, imageHeight: number): YOLOAnnotation[] => {
  return boundingBoxes.map((box) => {
    const xCenter = (box.x + box.width / 2) / imageWidth;
    const yCenter = (box.y + box.height / 2) / imageHeight;
    const width = box.width / imageWidth;
    const height = box.height / imageHeight;
    return {
      class_id: parseInt(box.label) || 0, // ラベルを数値IDに変換（デフォルトは0）
      x_center: xCenter,
      y_center: yCenter,
      width: width,
      height: height,
    };
  });
};

