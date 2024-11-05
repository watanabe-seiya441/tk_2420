# How to Run server
1. Move to project root.
2. Install python dependencies with `uv sync`.
3. Activate a virtual environment with `source .venv/bin/activate`.
4. Run `app.py` with `cd py` and then `python3 app.py`

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
