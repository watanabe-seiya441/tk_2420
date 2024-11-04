from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow requests from localhost:3000
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['PROCESSED_FOLDER'] = 'processed'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file uploaded'}), 400
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    filename = secure_filename(file.filename)
    upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(upload_path)

    # Simulate processing (in reality, replace with actual processing code)
    processed_filename = f"processed_{filename}"
    processed_path = os.path.join(app.config['PROCESSED_FOLDER'], processed_filename)
    os.rename(upload_path, processed_path)  # For simplicity, renaming instead of actual processing

    return jsonify({'filePath': f"processed/{processed_filename}"}), 200

@app.route('/processed/<filename>')
def serve_processed_file(filename):
    return send_from_directory(app.config['PROCESSED_FOLDER'], filename)

if __name__ == '__main__':
    app.run(port=5000)
