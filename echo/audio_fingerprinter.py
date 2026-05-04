"""
Audio Fingerprinting Module
===========================

This module provides audio fingerprinting functionality for music recognition.
It uses spectral analysis to generate unique fingerprints from audio files and
match them against a database of known songs.

Key Features:
- Spectral peak detection using STFT
- Hash generation from peak pairs
- Database matching with confidence scoring
- Support for real-time audio data processing

Classes:
- AudioFingerprinter: Main class for generating and matching fingerprints

Functions:
- generate_fingerprint_from_audio_data: Generate fingerprint from raw audio data

Dependencies:
- librosa: Audio loading and processing
- numpy: Numerical computations
- scipy: Signal processing

Author: Echo Team
Version: 1.0.0
"""

import numpy as np
import librosa
import json
import hashlib
from typing import Tuple, List, Dict
import scipy.signal


class AudioFingerprinter:
    """Generate and match audio fingerprints using spectral analysis."""
    
    def __init__(self, sample_rate: int = 44100, n_fft: int = 2048, hop_length: int = 512):
        self.sample_rate = sample_rate
        self.n_fft = n_fft
        self.hop_length = hop_length
        self.target_freqs = [40, 80, 120, 180, 300, 500, 800, 1200, 2000, 3000, 5000, 8000]
    
    def load_audio(self, file_path: str) -> Tuple[np.ndarray, int]:
        """Load audio file and return audio data and sample rate."""
        try:
            y, sr = librosa.load(file_path, sr=self.sample_rate, mono=True)
            return y, sr
        except Exception as e:
            raise ValueError(f"Error loading audio file: {e}")
    
    def compute_spectrogram(self, y: np.ndarray) -> np.ndarray:
        """Compute spectrogram from audio data."""
        stft = librosa.stft(y, n_fft=self.n_fft, hop_length=self.hop_length)
        magnitude = np.abs(stft)
        return magnitude
    
    def find_peaks(self, spectrogram: np.ndarray, threshold: float = 0.1) -> List[Tuple[int, int, float]]:
        """
        Find peaks in spectrogram.
        Returns list of (time_frame, frequency_bin, magnitude) tuples.
        """
        peaks = []
        n_frames = spectrogram.shape[1]
        n_freqs = spectrogram.shape[0]
        
        # Normalize spectrogram
        spec_norm = spectrogram / (np.max(spectrogram) + 1e-10)
        
        for frame in range(n_frames):
            for freq in range(n_freqs):
                magnitude = spec_norm[freq, frame]
                if magnitude < threshold:
                    continue
                
                # Check if it's a local maximum
                is_peak = True
                for df in [-1, 0, 1]:
                    for dt in [-1, 0, 1]:
                        if df == 0 and dt == 0:
                            continue
                        nf, nt = freq + df, frame + dt
                        if 0 <= nf < n_freqs and 0 <= nt < n_frames:
                            if spec_norm[nf, nt] > magnitude:
                                is_peak = False
                                break
                    if not is_peak:
                        break
                
                if is_peak:
                    peaks.append((frame, freq, magnitude))
        
        return peaks
    
    def create_fingerprint_hash(self, peaks: List[Tuple[int, int, float]]) -> str:
        """Create a hash from peaks for quick comparison."""
        if not peaks:
            return ""
        
        # Sort peaks by time and frequency
        sorted_peaks = sorted(peaks, key=lambda x: (x[0], x[1]))
        
        # Create pairs of peaks within a time window
        pairs = []
        for i, (t1, f1, m1) in enumerate(sorted_peaks):
            for j in range(i + 1, min(i + 10, len(sorted_peaks))):
                t2, f2, m2 = sorted_peaks[j]
                if t2 - t1 > 50:  # Time window limit
                    break
                pairs.append((t1, f1, t2, f2))
        
        # Create hash from pairs
        hash_string = ""
        for t1, f1, t2, f2 in pairs:
            hash_string += f"{t1}:{f1}:{t2}:{f2};"
        
        return hashlib.md5(hash_string.encode()).hexdigest()
    
    def generate_fingerprint(self, file_path: str) -> Dict:
        """
        Generate complete fingerprint from audio file.
        Returns dict with hash, peaks, duration, and sample_rate.
        """
        y, sr = self.load_audio(file_path)
        duration = len(y) / sr
        
        spectrogram = self.compute_spectrogram(y)
        peaks = self.find_peaks(spectrogram)
        
        # Convert peaks to serializable format
        peaks_serializable = [(int(p[0]), int(p[1]), float(p[2])) for p in peaks]
        
        fingerprint_hash = self.create_fingerprint_hash(peaks)
        
        return {
            'fingerprint_hash': fingerprint_hash,
            'peaks': peaks_serializable,
            'duration': duration,
            'sample_rate': sr,
            'num_peaks': len(peaks)
        }
    
    def match_fingerprints(self, peaks1: List[Tuple[int, int, float]], 
                          peaks2: List[Tuple[int, int, float]], 
                          tolerance: int = 2) -> float:
        """
        Match two fingerprints and return confidence score (0-1).
        """
        if not peaks1 or not peaks2:
            return 0.0
        
        # Convert to sets for faster lookup
        set1 = {(p[0], p[1]) for p in peaks1}
        set2 = {(p[0], p[1]) for p in peaks2}
        
        matches = 0
        for t1, f1 in set1:
            for t2, f2 in set2:
                if (abs(t1 - t2) <= tolerance and 
                    abs(f1 - f2) <= tolerance):
                    matches += 1
                    break
        
        # Calculate confidence based on overlap
        min_peaks = min(len(set1), len(set2))
        if min_peaks == 0:
            return 0.0
        
        confidence = matches / min_peaks
        return min(confidence, 1.0)
    
    def match_with_database(self, query_peaks: List[Tuple[int, int, float]], 
                           db_fingerprints: List[Dict], 
                           min_confidence: float = 0.3) -> List[Dict]:
        """
        Match query fingerprint against database fingerprints.
        Returns list of matches with confidence scores.
        """
        matches = []
        
        for fp in db_fingerprints:
            db_peaks = fp.get('peaks', [])
            confidence = self.match_fingerprints(query_peaks, db_peaks)
            
            if confidence >= min_confidence:
                matches.append({
                    'song_id': fp.get('song_id'),
                    'confidence': confidence,
                    'fingerprint_id': fp.get('id')
                })
        
        # Sort by confidence (highest first)
        matches.sort(key=lambda x: x['confidence'], reverse=True)
        return matches


def generate_fingerprint_from_audio_data(audio_data: np.ndarray, 
                                          sample_rate: int = 44100) -> Dict:
    """
    Generate fingerprint from raw audio data (for real-time recognition).
    """
    fingerprinter = AudioFingerprinter(sample_rate=sample_rate)
    
    # Compute spectrogram directly
    spectrogram = fingerprinter.compute_spectrogram(audio_data)
    peaks = fingerprinter.find_peaks(spectrogram)
    
    peaks_serializable = [(int(p[0]), int(p[1]), float(p[2])) for p in peaks]
    fingerprint_hash = fingerprinter.create_fingerprint_hash(peaks)
    
    return {
        'fingerprint_hash': fingerprint_hash,
        'peaks': peaks_serializable,
        'duration': len(audio_data) / sample_rate,
        'sample_rate': sample_rate,
        'num_peaks': len(peaks)
    }
