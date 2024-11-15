from env import MEMBER_PROFILE_URL_PREFIX
from flask import Blueprint, jsonify, request
from models import MemberProfile, db

member_profile_bp = Blueprint("member_profile", __name__, url_prefix=MEMBER_PROFILE_URL_PREFIX)


@member_profile_bp.route("/", methods=["GET"])
def get_member_profiles():
    """Fetch member profiles, optionally filter by group name."""
    group_name = request.args.get("groupName")
    query = db.select(MemberProfile).order_by(MemberProfile.group_member_id)
    if group_name:
        query = query.filter_by(group_name=group_name)

    profiles = db.session.execute(query).scalars().all()
    profiles_dict = [
        {
            "group_member_id": profile.group_member_id,
            "name": profile.name,
            "associated_color": profile.associated_color,
            "group_name": profile.group_name,
        }
        for profile in profiles
    ]
    return jsonify(profiles_dict)