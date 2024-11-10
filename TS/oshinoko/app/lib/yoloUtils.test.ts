import { generateYOLOAnnotations, generateBoundingBoxesFromYOLO } from './yoloUtils';
import { BoundingBox, YOLOAnnotation, LabelInfo } from './types';

describe('generateYOLOAnnotations', () => {
  it('should correctly convert bounding boxes to YOLO annotations', () => {
    const boundingBoxes: BoundingBox[] = [
      { x: 50, y: 30, width: 100, height: 150, label: '1', color: 'red' },
    ];
    const imageWidth = 500;
    const imageHeight = 500;

    const expected: YOLOAnnotation[] = [
      {
        class_id: 1,
        x_center: 0.3,
        y_center: 0.45,
        width: 0.2,
        height: 0.3,
      },
    ];

    expect(generateYOLOAnnotations(boundingBoxes, imageWidth, imageHeight)).toEqual(expected);
  });
});

describe('generateBoundingBoxesFromYOLO', () => {
  it('should correctly convert YOLO annotations to bounding boxes', () => {
    const annotations: YOLOAnnotation[] = [
      { class_id: 1, x_center: 0.3, y_center: 0.45, width: 0.2, height: 0.3 },
    ];
    const labels: LabelInfo[] = [
      { label_id: 1, label_name: 'person', label_color: 'red' },
    ];

    const expected: BoundingBox[] = [
      { x: 10, y: 15, width: 20, height: 30, label: 'person', color: 'red' },
    ];

    expect(generateBoundingBoxesFromYOLO(annotations, labels)).toEqual(expected);
  });

  it('should throw an error if label is not found', () => {
    const annotations: YOLOAnnotation[] = [
      { class_id: 99, x_center: 0.3, y_center: 0.45, width: 0.2, height: 0.3 },
    ];
    const labels: LabelInfo[] = [
      { label_id: 1, label_name: 'person', label_color: 'red' },
    ];

    expect(() => generateBoundingBoxesFromYOLO(annotations, labels)).toThrowError(
      'Label with ID 99 not found'
    );
  });
});
