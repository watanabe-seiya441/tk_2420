from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
import uuid

# DBインスタンスの作成
db = SQLAlchemy()

# VideoInfo モデルの定義
class VideoInfo(db.Model):
    __tablename__ = "video_info"
    
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(nullable=False)
    group_name: Mapped[str] = mapped_column(nullable=False)
    video_url: Mapped[str] = mapped_column(nullable=False)
    overlay_url: Mapped[str] = mapped_column(nullable=False)
    original_video_width: Mapped[int] = mapped_column(default=640)
    original_video_height: Mapped[int] = mapped_column(default=360)
