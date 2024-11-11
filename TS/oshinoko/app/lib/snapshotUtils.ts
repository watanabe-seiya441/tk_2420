import { AnnotatedSnapshot } from '@/app/lib/types';
/**
 * Define a helper function to convert snapshots to JPEG and YOLO txt format
 */
export const convertSnapshotToFiles = (
  snapshot: AnnotatedSnapshot,
): { imageFile: File; annotationFile: File } => {
  // Convert Blob to JPEG File
  const imageFile = new File([snapshot.imageBlob], `${snapshot.id}.jpeg`, {
    type: 'image/jpeg',
  });

  // Convert annotations to YOLO format
  const annotationText = snapshot.annotations
    .map((annotation) => {
      return `${annotation.class_id} ${annotation.x_center} ${annotation.y_center} ${annotation.width} ${annotation.height}`;
    })
    .join('\n');
  const annotationFile = new File([annotationText], `${snapshot.id}.txt`, {
    type: 'text/plain',
  });

  return { imageFile, annotationFile };
};
