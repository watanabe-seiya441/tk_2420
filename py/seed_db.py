from app import app
from models import db, VideoInfo

def seed_data():
    """Initialize the database with default video data."""
    videos = [
        VideoInfo(
            id='1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
            title='Supernova',
            group_name='aespa',
            video_url='/videos/Supernova.mp4',
            overlay_url='/overlays/Supernova_overlay.json',
            original_video_width=640,
            original_video_height=360
        ),
        VideoInfo(
            id='1q2w3e4r-5t6y-7u8i-9o0p-1a2s3d4f5g6h',
            title='Whiplash',
            group_name='aespa',
            video_url='/videos/Whiplash.mp4',
            overlay_url='/overlays/Whiplash_overlay.json',
            original_video_width=640,
            original_video_height=360
        ),
        VideoInfo(
            id='7g8h9i0j-1k2l-3m4n-5o6p-1q2w3e4r5t6y',
            title='裸足でSummer',
            group_name='nokizaka',
            video_url='/videos/hadashidesummer_nise.mp4',
            overlay_url='/overlays/hadashidesummer_nise_overlay.json',
            original_video_width=640,
            original_video_height=360
        )
    ]

    # データベースをクリアしてからデータを挿入
    with app.app_context():
        db.drop_all()
        db.create_all()
        db.session.bulk_save_objects(videos)
        db.session.commit()
        print("Database seeded successfully.")

if __name__ == "__main__":
    seed_data()
