from app import app
from env import OVERLAY_URL_PREFIX, VIDEO_URL_PREFIX
from models import AnnotationLabel, VideoInfo, db


def seed_data():
    """Initialize the database with default video data."""
    videos = [
        VideoInfo(
            id="1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
            title="Supernova",
            group_name="aespa",
            video_url=f"{VIDEO_URL_PREFIX}/file/Supernova.mp4",
            overlay_url=f"{OVERLAY_URL_PREFIX}/file/Supernova_overlay.json",
            original_video_width=640,
            original_video_height=360,
        ),
        VideoInfo(
            id="1q2w3e4r-5t6y-7u8i-9o0p-1a2s3d4f5g6h",
            title="Whiplash",
            group_name="aespa",
            video_url=f"{VIDEO_URL_PREFIX}/file/Whiplash.mp4",
            overlay_url=f"{OVERLAY_URL_PREFIX}/file/Whiplash_overlay.json",
            original_video_width=640,
            original_video_height=360,
        ),
        VideoInfo(
            id="7g8h9i0j-1k2l-3m4n-5o6p-1q2w3e4r5t6y",
            title="裸足でSummer",
            group_name="nokizaka",
            video_url=f"{VIDEO_URL_PREFIX}/file/hadashidesummer_nise.mp4",
            overlay_url=f"{OVERLAY_URL_PREFIX}/file/hadashidesummer_nise_overlay.json",
            original_video_width=640,
            original_video_height=360,
        ),
    ]

    annotaion_labels = [
        AnnotationLabel(label_id=0, label_name="giselle", label_color="pink", group_name="aespa"),
        AnnotationLabel(label_id=1, label_name="karina", label_color="blue", group_name="aespa"),
        AnnotationLabel(label_id=2, label_name="ningning", label_color="purple", group_name="aespa"),
        AnnotationLabel(label_id=3, label_name="winter", label_color="lightgreen", group_name="aespa"),
    ]

    # データベースをクリアしてからデータを挿入
    with app.app_context():
        db.drop_all()
        db.create_all()
        db.session.bulk_save_objects(videos)
        db.session.bulk_save_objects(annotaion_labels)
        db.session.commit()
        print("Database seeded successfully.")


if __name__ == "__main__":
    seed_data()
