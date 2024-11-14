# How to Run server
1. Move to project root.
2. Install python dependencies with `uv sync`.
3. Activate a virtual environment with `source .venv/bin/activate`.
4. Place `Whiplash.mp4` and `Supernova.mp4` in `/py/videos/` directory if you want to work with frontend. #TODO: FIX ME
5. Set PYTHONPATH. `cd py`, and then `source setup_pythonpath.sh`
6. Set data in SQLite database by `python3 seed_db.py`
7. Run `python3 app.py` or `flask run --host=0.0.0.0 --port 5000` 

# Development
## Linter, Formatter and Type checker
```sh
ruff check # check code with linter
ruff format # run formatter
# organize import order. 
ruff check --select I --fix # ruff formatだけでは不十分
# Type check
mypy py
```


# Backend structure
```
backend/
├── app.py                  # Main Flask application
├── videos/                 # Directory to store video files
├── overlays/               # Directory to store overlay JSON files
├── static/
│   └── thumbnails/         # Directory to store thumbnail images (optional)
└── requirements.txt        # Required packages
```

---

# API Documentation

This backend API manages videos, overlays, and video uploads for different groups (e.g., `aespa`, `nokizaka`). The API is built with Flask and serves video data and overlays, as well as supporting uploads of new videos.

## Base URL

- **Development**: `http://localhost:5000`

---

## Endpoints

### 1. Get List of Videos by Group

Retrieve a list of videos, optionally filtered by group name.

- **URL**: `/api/videos`
- **Method**: `GET`
- **Query Parameters**:
  - `group` (optional): Filter videos by group (e.g., `aespa`, `nokizaka`).
- **Response**: Returns a JSON array of video objects.

#### Example Request

```http
GET /api/videos?group=aespa
```

#### Example Response

```json
[
  {
    "id": "video1",
    "title": "Song Title 1",
    "group": "aespa",
    "video_url": "/videos/video1.mp4",
    "overlay_url": "/overlays/video1_overlay.json"
  },
  {
    "id": "video2",
    "title": "Song Title 2",
    "group": "aespa",
    "video_url": "/videos/video2.mp4",
    "overlay_url": "/overlays/video2_overlay.json"
  }
]
```

### 2. Get Specific Video Data by ID

Retrieve details of a specific video, including its overlay data.

- **URL**: `/api/videos/<video_id>`
- **Method**: `GET`
- **Path Parameter**:
  - `<video_id>`: The unique identifier of the video.
- **Response**: Returns a JSON object with video and overlay details.

#### Example Request

```http
GET /api/videos/video1
```

#### Example Response

```json
{
  "id": "video1",
  "title": "Song Title 1",
  "group": "aespa",
  "video_url": "/videos/video1.mp4",
  "overlay_url": "/overlays/video1_overlay.json",
}
```

### 3. Upload a New Video

Upload a new video along with its overlay data.

- **URL**: `/api/upload`
- **Method**: `POST`
- **Request Body**:
  - **FormData**:
    - `title`: The title of the video.
    - `group`: The group name associated with the video (e.g., `aespa`, `nokizaka`).
    - `video`: The video file.
- **Response**: Returns a JSON object with the details of the uploaded video.

#### Example Request (FormData)

```http
POST /api/upload
```

#### FormData Fields

- `title`: "New Song Title"
- `group`: "aespa"
- `video`: (File) `new_video.mp4`
- `overlay`: (File) `new_video_overlay.json`

#### Example Response

```json
{
  "id": "video3",
  "title": "New Song Title",
  "group": "aespa",
  "video_url": "/videos/new_video.mp4",
  "overlay_url": "/overlays/new_video_overlay.json"
}
```
