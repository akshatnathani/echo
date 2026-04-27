"""
Database Models for SoundID
============================

This module defines the SQLAlchemy database models for the SoundID application.
It includes models for users, songs, recognition history, and audio fingerprints.

Models:
- User: User authentication and management
- RecognitionHistory: Track user's recognition attempts
- Song: Song metadata and file information
- AudioFingerprint: Store audio fingerprint data for matching

Author: SoundID Team
Version: 1.0.0
"""

from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class RecognitionHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    song_name = db.Column(db.String(200), nullable=True)
    confidence = db.Column(db.Float, nullable=True)
    recognized = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('history', lazy=True))

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    singer_name = db.Column(db.String(200), nullable=True)
    file_path = db.Column(db.String(500), nullable=False)
    fingerprinted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('name', 'singer_name', name='_name_singer_uc'),)

class AudioFingerprint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), nullable=False)
    fingerprint_hash = db.Column(db.Text, nullable=False)  # Stores the fingerprint as JSON string
    peaks = db.Column(db.Text, nullable=False)  # Stores spectral peaks as JSON
    duration = db.Column(db.Float, nullable=True)
    sample_rate = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    song = db.relationship('Song', backref=db.backref('fingerprints', lazy=True))
