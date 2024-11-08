import { YOLOAnnotation, LabelInfo, BoundingBox } from '@/app/lib/types';

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


// Implementation of generateBoundingBoxesFromYOLO
export const generateBoundingBoxesFromYOLO = (annotations: YOLOAnnotation[], labels: LabelInfo[]): BoundingBox[] => {
    return annotations.map((annotation) => {
        const label = labels.find((l) => l.label_id === annotation.class_id);
        if (!label) {
            throw new Error(`Label with ID ${annotation.class_id} not found`);
        }

        const x = (annotation.x_center - annotation.width / 2) * 100;
        const y = (annotation.y_center - annotation.height / 2) * 100;
        const width = annotation.width * 100;
        const height = annotation.height * 100;

        return {
            x,
            y,
            width,
            height,
            label: label.label_name,
            color: label.label_color,
        };
    });
};