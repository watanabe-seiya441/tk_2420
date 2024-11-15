import uuid

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column

# DBインスタンスの作成
db = SQLAlchemy()


# VideoInfo モデルの定義
class VideoInfo(db.Model):  # type: ignore
    __tablename__ = "video_info"

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(nullable=False)
    group_name: Mapped[str] = mapped_column(nullable=False)
    video_url: Mapped[str] = mapped_column(nullable=False)
    overlay_url: Mapped[str] = mapped_column(nullable=False)
    original_video_width: Mapped[int] = mapped_column(default=640)
    original_video_height: Mapped[int] = mapped_column(default=360)


# MemberProfile モデルの定義
class MemberProfile(db.Model):  # type: ignore
    __tablename__ = "member_profile"
    id = db.Column(db.Integer, primary_key=True)
    group_member_id = db.Column(db.Integer, nullable=False)  # ID of the member in the group
    name = db.Column(db.String(50), nullable=False)
    associated_color = db.Column(db.String(20), nullable=False)
    group_name = db.Column(db.String(50), nullable=False)
