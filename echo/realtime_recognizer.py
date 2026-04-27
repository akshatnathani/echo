"""
Real-time audio recognition module.
Captures audio from microphone and matches against fingerprint database.
"""

import numpy as np
import sounddevice as sd
import threading
import queue
import json
from typing import Optional, Dict, List
from audio_fingerprinter import AudioFingerprinter, generate_fingerprint_from_audio_data
from app import app, db
from models import AudioFingerprint, Song


class AudioCapture:
    """Capture audio from microphone in real-time."""
    
    def __init__(self, sample_rate: int = 44100, chunk_size: int = 1024, channels: int = 1):
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size
        self.channels = channels
        self.audio_queue = queue.Queue()
        self.is_recording = False
        self.stream = None
    
    def start_recording(self):
        """Start recording audio from microphone."""
        self.is_recording = True
        self.stream = sd.InputStream(
            channels=self.channels,
            samplerate=self.sample_rate,
            callback=self._audio_callback,
            blocksize=self.chunk_size,
            dtype='float32'
        )
        self.stream.start()
        print("Recording started...")
    
    def _audio_callback(self, indata, frames, time, status):
        """Callback for audio stream."""
        if status:
            print(f"Audio callback status: {status}")
        
        # Convert to numpy array and add to queue
        audio_data = indata.flatten()
        self.audio_queue.put(audio_data)
    
    def stop_recording(self):
        """Stop recording audio."""
        if self.stream:
            self.stream.stop()
            self.stream.close()
        self.is_recording = False
        print("Recording stopped.")
    
    def get_audio_chunk(self, duration: float = 2.0) -> Optional[np.ndarray]:
        """
        Get audio chunk of specified duration.
        Returns None if not enough audio data available.
        """
        samples_needed = int(self.sample_rate * duration)
        audio_data = []
        
        while len(audio_data) < samples_needed and not self.audio_queue.empty():
            try:
                chunk = self.audio_queue.get_nowait()
                audio_data.extend(chunk)
            except queue.Empty:
                break
        
        if len(audio_data) >= samples_needed:
            return np.array(audio_data[:samples_needed], dtype=np.float32)
        return None


class RealTimeRecognizer:
    """Real-time audio recognition using fingerprint matching."""
    
    def __init__(self, sample_rate: int = 44100, min_confidence: float = 0.3):
        self.sample_rate = sample_rate
        self.min_confidence = min_confidence
        self.fingerprinter = AudioFingerprinter(sample_rate=sample_rate)
        self.db_fingerprints = []
        self._load_fingerprints_from_db()
    
    def _load_fingerprints_from_db(self):
        """Load all fingerprints from database."""
        with app.app_context():
            fingerprints = AudioFingerprint.query.all()
            self.db_fingerprints = []
            
            for fp in fingerprints:
                self.db_fingerprints.append({
                    'id': fp.id,
                    'song_id': fp.song_id,
                    'fingerprint_hash': fp.fingerprint_hash,
                    'peaks': json.loads(fp.peaks),
                    'duration': fp.duration,
                    'sample_rate': fp.sample_rate
                })
            
            print(f"Loaded {len(self.db_fingerprints)} fingerprints from database")
    
    def recognize_audio(self, audio_data: np.ndarray) -> Optional[Dict]:
        """
        Recognize audio from raw audio data.
        Returns dict with song info and confidence, or None if no match.
        """
        # Generate fingerprint from audio data
        fingerprint_data = generate_fingerprint_from_audio_data(audio_data, self.sample_rate)
        query_peaks = fingerprint_data['peaks']
        
        # Match against database
        matches = self.fingerprinter.match_with_database(
            query_peaks, 
            self.db_fingerprints, 
            self.min_confidence
        )
        
        if not matches:
            return None
        
        # Get best match
        best_match = matches[0]
        
        # Get song details
        with app.app_context():
            song = Song.query.get(best_match['song_id'])
            if song:
                return {
                    'song_id': song.id,
                    'song_name': song.name,
                    'artist': song.singer_name,
                    'confidence': best_match['confidence'],
                    'file_path': song.file_path
                }
        
        return None
    
    def reload_fingerprints(self):
        """Reload fingerprints from database (call after adding new songs)."""
        self._load_fingerprints_from_db()


class RecognitionService:
    """Service for continuous real-time recognition."""
    
    def __init__(self, sample_rate: int = 44100, chunk_duration: float = 2.0):
        self.sample_rate = sample_rate
        self.chunk_duration = chunk_duration
        self.audio_capture = AudioCapture(sample_rate=sample_rate)
        self.recognizer = RealTimeRecognizer(sample_rate=sample_rate)
        self.is_running = False
        self.recognition_callback = None
    
    def set_recognition_callback(self, callback):
        """Set callback function to be called when a song is recognized."""
        self.recognition_callback = callback
    
    def start(self):
        """Start continuous recognition."""
        self.audio_capture.start_recording()
        self.is_running = True
        
        print("Starting real-time recognition...")
        print("Listening for music... (Press Ctrl+C to stop)")
        
        try:
            while self.is_running:
                # Get audio chunk
                audio_chunk = self.audio_capture.get_audio_chunk(self.chunk_duration)
                
                if audio_chunk is not None:
                    # Recognize audio
                    result = self.recognizer.recognize_audio(audio_chunk)
                    
                    if result:
                        print(f"\n✓ Recognized: {result['artist']} - {result['song_name']}")
                        print(f"  Confidence: {result['confidence']:.2%}")
                        
                        if self.recognition_callback:
                            self.recognition_callback(result)
                
        except KeyboardInterrupt:
            print("\nStopping recognition...")
        finally:
            self.stop()
    
    def stop(self):
        """Stop recognition."""
        self.is_running = False
        self.audio_capture.stop_recording()
    
    def recognize_single_chunk(self, duration: float = 2.0) -> Optional[Dict]:
        """
        Record a single audio chunk and recognize it.
        Useful for one-shot recognition.
        """
        print(f"Recording for {duration} seconds...")
        self.audio_capture.start_recording()
        
        import time
        time.sleep(duration)
        
        audio_chunk = self.audio_capture.get_audio_chunk(duration)
        self.audio_capture.stop_recording()
        
        if audio_chunk is not None:
            result = self.recognizer.recognize_audio(audio_chunk)
            return result
        
        return None


def main():
    """Demo function for real-time recognition."""
    print("Real-time Audio Recognition")
    print("=" * 50)
    
    service = RecognitionService()
    
    def on_recognition(result):
        """Callback when song is recognized."""
        print(f"  → Match found in database!")
    
    service.set_recognition_callback(on_recognition)
    
    # Start continuous recognition
    service.start()


if __name__ == "__main__":
    main()
