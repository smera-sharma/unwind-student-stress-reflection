from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.api import deps
from app.models.user import User
from app.core.database import get_db

router = APIRouter()

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    display_name: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    preferred_pronouns: Optional[str] = None

class SettingsUpdate(BaseModel):
    theme: Optional[str] = None
    daily_reminder: Optional[bool] = None
    reminder_time: Optional[str] = None
    timezone: Optional[str] = None
    notifications_enabled: Optional[bool] = None

@router.get("/profile")
def get_profile(current_user: User = Depends(deps.get_current_user)):
    profile_data = {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "display_name": current_user.display_name,
        "bio": current_user.bio,
        "profile_picture": current_user.profile_picture,
        "preferred_pronouns": current_user.preferred_pronouns,
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at
    }
    return {
        "success": True,
        "message": "Profile retrieved successfully.",
        "data": profile_data
    }

@router.put("/profile")
def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.display_name is not None:
        current_user.display_name = data.display_name
    if data.bio is not None:
        current_user.bio = data.bio
    if data.profile_picture is not None:
        current_user.profile_picture = data.profile_picture
    if data.preferred_pronouns is not None:
        current_user.preferred_pronouns = data.preferred_pronouns

    try:
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

    profile_data = {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "display_name": current_user.display_name,
        "bio": current_user.bio,
        "profile_picture": current_user.profile_picture,
        "preferred_pronouns": current_user.preferred_pronouns,
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at
    }
    return {
        "success": True,
        "message": "Profile updated successfully.",
        "data": profile_data
    }

@router.get("/settings")
def get_settings(current_user: User = Depends(deps.get_current_user)):
    settings_data = {
        "theme": current_user.theme or "system",
        "daily_reminder": current_user.daily_reminder or False,
        "reminder_time": current_user.reminder_time or "20:00",
        "timezone": current_user.timezone or "UTC",
        "notifications_enabled": current_user.notifications_enabled if current_user.notifications_enabled is not None else True
    }
    return {
        "success": True,
        "message": "Settings retrieved successfully.",
        "data": settings_data
    }

@router.put("/settings")
def update_settings(
    data: SettingsUpdate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    if data.theme is not None:
        current_user.theme = data.theme
    if data.daily_reminder is not None:
        current_user.daily_reminder = data.daily_reminder
    if data.reminder_time is not None:
        current_user.reminder_time = data.reminder_time
    if data.timezone is not None:
        current_user.timezone = data.timezone
    if data.notifications_enabled is not None:
        current_user.notifications_enabled = data.notifications_enabled

    try:
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update settings: {str(e)}")

    settings_data = {
        "theme": current_user.theme or "system",
        "daily_reminder": current_user.daily_reminder or False,
        "reminder_time": current_user.reminder_time or "20:00",
        "timezone": current_user.timezone or "UTC",
        "notifications_enabled": current_user.notifications_enabled if current_user.notifications_enabled is not None else True
    }
    return {
        "success": True,
        "message": "Settings updated successfully.",
        "data": settings_data
    }
