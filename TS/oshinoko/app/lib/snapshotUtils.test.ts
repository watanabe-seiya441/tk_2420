// Test for the conversion function
import { convertSnapshotToFiles } from './snapshotUtils';
import { AnnotatedSnapshot } from '@/app/lib/types';
import * as fs from 'fs';
import * as path from 'path';

describe('convertSnapshotToFiles', () => {
    it('should correctly convert snapshot to JPEG and YOLO txt format and write to files', async () => {
        // Arrange
        const testImagePath = path.join(__dirname, 'testdata', 'testimage.jpg');
        const imageBuffer = fs.readFileSync(testImagePath);
        const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });

        const dummySnapshot: AnnotatedSnapshot = {
            id: 'test_snapshot',
            imageBlob: imageBlob,
            annotations: [
                { class_id: 0, x_center: 0.5, y_center: 0.5, width: 0.3, height: 0.3 },
                { class_id: 1, x_center: 0.1, y_center: 0.2, width: 0.2, height: 0.1 }
            ]
        };

        // Act
        const { imageFile, annotationFile } = convertSnapshotToFiles(dummySnapshot);

        // Write files to disk
        const outputDir = path.join(__dirname, 'test_output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        const imageFilePath = path.join(outputDir, imageFile.name);
        const annotationFilePath = path.join(outputDir, annotationFile.name);

        // Assert filenames
        expect(imageFile.name).toBe('test_snapshot.jpeg');
        expect(annotationFile.name).toBe('test_snapshot.txt');

        // fs.writeFileSync(imageFilePath, await imageFile.arrayBuffer());
        fs.writeFileSync(imageFilePath, Buffer.from(await imageFile.arrayBuffer()));

        fs.writeFileSync(annotationFilePath, await annotationFile.text());

        // Assert
        expect(fs.existsSync(imageFilePath)).toBe(true);
        expect(fs.existsSync(annotationFilePath)).toBe(true);

        const savedAnnotationText = fs.readFileSync(annotationFilePath, 'utf-8');
        const expectedAnnotationText = '0 0.5 0.5 0.3 0.3\n1 0.1 0.2 0.2 0.1';
        expect(savedAnnotationText).toBe(expectedAnnotationText);

        const savedImageBuffer = fs.readFileSync(imageFilePath);
        expect(savedImageBuffer.equals(imageBuffer)).toBe(true);

        // Clean up
        fs.unlinkSync(imageFilePath);
        fs.unlinkSync(annotationFilePath);
        fs.rmdirSync(outputDir);
    });
});
