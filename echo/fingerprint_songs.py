"""
Script to fingerprint all downloaded songs and store them in the database.
Run this after downloading songs to build the fingerprint database.
"""

import os
import sys
import json
from pathlib import Path
from audio_fingerprinter import AudioFingerprinter
from app import app, db
from models import Song, AudioFingerprint

# Configuration
SONGS_DIR = "downloaded_songs"
SUPPORTED_FORMATS = ['.mp3', '.wav', '.m4a', '.flac']


def fingerprint_audio_file(file_path: str, song_id: int) -> bool:
    """Generate fingerprint for a single audio file and store in database."""
    try:
        print(f"Fingerprinting: {os.path.basename(file_path)}")
        
        fingerprinter = AudioFingerprinter()
        fingerprint_data = fingerprinter.generate_fingerprint(file_path)
        
        # Store in database
        audio_fp = AudioFingerprint(
            song_id=song_id,
            fingerprint_hash=fingerprint_data['fingerprint_hash'],
            peaks=json.dumps(fingerprint_data['peaks']),
            duration=fingerprint_data['duration'],
            sample_rate=fingerprint_data['sample_rate']
        )
        
        db.session.add(audio_fp)
        db.session.commit()
        
        print(f"  ✓ Fingerprint stored (hash: {fingerprint_data['fingerprint_hash'][:16]}...)")
        print(f"  ✓ Peaks: {fingerprint_data['num_peaks']}, Duration: {fingerprint_data['duration']:.2f}s")
        return True
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        db.session.rollback()
        return False


def get_or_create_song(file_path: str) -> Song:
    """Get existing song or create new one from file path."""
    filename = os.path.basename(file_path)
    
    # Parse filename (format: "Artist - Song.mp3")
    if " - " in filename:
        parts = filename.rsplit(" - ", 1)
        singer_name = parts[0].strip()
        song_name = parts[1].rsplit(".", 1)[0].strip()
    else:
        singer_name = "Unknown"
        song_name = filename.rsplit(".", 1)[0].strip()
    
    # Check if song already exists
    song = Song.query.filter_by(name=song_name, singer_name=singer_name).first()
    
    if not song:
        song = Song(
            name=song_name,
            singer_name=singer_name,
            file_path=file_path,
            fingerprinted=False
        )
        db.session.add(song)
        db.session.commit()
        print(f"  Created new song entry: {singer_name} - {song_name}")
    
    return song


def main():
    """Main function to fingerprint all songs."""
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        songs_dir = Path(SONGS_DIR)
        
        if not songs_dir.exists():
            print(f"Error: Songs directory '{SONGS_DIR}' not found.")
            print("Please download songs first using download_songs.py")
            return
        
        # Find all audio files
        audio_files = []
        for ext in SUPPORTED_FORMATS:
            audio_files.extend(songs_dir.glob(f"*{ext}"))
        
        if not audio_files:
            print(f"No audio files found in '{SONGS_DIR}'")
            return
        
        print(f"Found {len(audio_files)} audio files")
        print("=" * 50)
        
        success_count = 0
        skip_count = 0
        error_count = 0
        
        for file_path in audio_files:
            file_path_str = str(file_path)
            
            # Get or create song entry
            song = get_or_create_song(file_path_str)
            
            # Check if already fingerprinted
            existing_fp = AudioFingerprint.query.filter_by(song_id=song.id).first()
            if existing_fp:
                print(f"Skipping {os.path.basename(file_path_str)} (already fingerprinted)")
                skip_count += 1
                continue
            
            # Generate and store fingerprint
            if fingerprint_audio_file(file_path_str, song.id):
                song.fingerprinted = True
                db.session.commit()
                success_count += 1
            else:
                error_count += 1
            
            print()
        
        print("=" * 50)
        print(f"Fingerprinting complete!")
        print(f"Success: {success_count}")
        print(f"Skipped: {skip_count}")
        print(f"Errors: {error_count}")
        print(f"Total: {len(audio_files)}")
        
        # Show database stats
        total_songs = Song.query.count()
        total_fingerprints = AudioFingerprint.query.count()
        print(f"\nDatabase stats:")
        print(f"  Songs in database: {total_songs}")
        print(f"  Fingerprints stored: {total_fingerprints}")


if __name__ == "__main__":
    main()
