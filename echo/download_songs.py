#!/usr/bin/env python3
"""
Script to download songs from YouTube based on CSV metadata.
Requires: yt-dlp (pip install yt-dlp)
"""

import csv
import os
import subprocess
import sys
import time
import random
from pathlib import Path

# Configuration
CSV_FILE = "songs_metadata.csv"
OUTPUT_DIR = "downloaded_songs"
AUDIO_FORMAT = "mp3"
AUDIO_QUALITY = "192"  # kbps
DELAY_BETWEEN_DOWNLOADS = 10  # seconds
MAX_RETRIES = 3
COOKIES_FILE = "cookies.txt"  # Optional: YouTube cookies for authentication

def install_yt_dlp():
    """Install yt-dlp if not already installed"""
    try:
        import yt_dlp
        print("yt-dlp is already installed")
        return True
    except ImportError:
        print("Installing yt-dlp...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "yt-dlp"])
        print("yt-dlp installed successfully")
        return True

def sanitize_filename(name):
    """Sanitize filename to be safe for filesystem"""
    # Remove or replace invalid characters
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        name = name.replace(char, '_')
    # Remove leading/trailing spaces and dots
    name = name.strip('. ')
    # Limit length
    if len(name) > 200:
        name = name[:200]
    return name

def download_song(url, artist, song_name, language, output_dir, retry_count=0):
    """Download a single song from YouTube with retry logic"""
    # Create sanitized filename
    safe_artist = sanitize_filename(artist)
    safe_song = sanitize_filename(song_name)
    filename = f"{safe_artist} - {safe_song}.{AUDIO_FORMAT}"
    output_path = os.path.join(output_dir, filename)
    
    # Check if file already exists
    if os.path.exists(output_path):
        print(f"Skipping (already exists): {filename}")
        return True
    
    # Download using yt-dlp
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': AUDIO_FORMAT,
            'preferredquality': AUDIO_QUALITY,
        }],
        'outtmpl': os.path.join(output_dir, f"{safe_artist} - {safe_song}.%(ext)s"),
        'quiet': False,
        'no_warnings': False,
        'extractor_args': {
            'youtube': {
                'player_client': ['android', 'web'],
            }
        }
    }
    
    # Use cookies from browser (more reliable than cookies file)
    ydl_opts['cookiesfrombrowser'] = ('chrome',)
    print("Using cookies from Chrome browser")
    
    try:
        import yt_dlp
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"Downloading: {filename} ({language})")
            ydl.download([url])
        
        # Verify file was actually downloaded
        if os.path.exists(output_path):
            print(f"Successfully downloaded: {filename}")
            return True
        else:
            print(f"Download completed but file not found: {filename}")
            return False
    except Exception as e:
        error_str = str(e)
        print(f"Error downloading {filename}: {error_str}")
        
        # Retry on rate limiting or bot detection
        if retry_count < MAX_RETRIES and ('429' in error_str or 'bot' in error_str.lower() or 'sign in' in error_str.lower() or '403' in error_str):
            wait_time = (retry_count + 1) * 30  # Exponential backoff: 30s, 60s, 90s
            print(f"Rate limited or bot detected. Waiting {wait_time}s before retry {retry_count + 1}/{MAX_RETRIES}...")
            time.sleep(wait_time)
            return download_song(url, artist, song_name, language, output_dir, retry_count + 1)
        
        return False

def read_csv_metadata(csv_file):
    """Read song metadata from CSV file"""
    songs = []
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                songs.append({
                    'language': row.get('Language', ''),
                    'artist': row.get('Artist', ''),
                    'song_name': row.get('Song_Name', ''),
                    'source': row.get('Source', ''),
                })
    except FileNotFoundError:
        print(f"Error: CSV file '{csv_file}' not found")
        return []
    except Exception as e:
        print(f"Error reading CSV file: {str(e)}")
        return []
    return songs

def main():
    """Main function"""
    # Install yt-dlp
    if not install_yt_dlp():
        print("Failed to install yt-dlp")
        return
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Read metadata from CSV
    songs = read_csv_metadata(CSV_FILE)
    if not songs:
        print("No songs found in CSV file")
        return
    
    print(f"Found {len(songs)} songs to download")
    print(f"Output directory: {OUTPUT_DIR}")
    print("-" * 50)
    
    # Download songs
    success_count = 0
    fail_count = 0
    
    for i, song in enumerate(songs, 1):
        print(f"\n[{i}/{len(songs)}]", end=" ")
        success = download_song(
            url=song['source'],
            artist=song['artist'],
            song_name=song['song_name'],
            language=song['language'],
            output_dir=OUTPUT_DIR
        )
        if success:
            success_count += 1
        else:
            fail_count += 1
        
        # Add delay between downloads to avoid rate limiting
        if i < len(songs):
            delay = DELAY_BETWEEN_DOWNLOADS + random.randint(0, 5)  # Add some randomness
            print(f"Waiting {delay}s before next download...")
            time.sleep(delay)
    
    # Summary
    print("\n" + "=" * 50)
    print(f"Download complete!")
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")
    print(f"Total: {len(songs)}")
    print(f"Files saved to: {os.path.abspath(OUTPUT_DIR)}")

if __name__ == "__main__":
    main()
