from flask import Flask
from flask_cors import CORS
from models import db  # models からインポート
from routes import register_routes

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///video_info.db"
CORS(app)  # Allow requests tentatively. TODO: tighten this up

# dbの初期化
db.init_app(app)

# Register routes
register_routes(app)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
