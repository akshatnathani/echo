import os
import pickle
import numpy as np
from config import Config

# Try to import librosa for audio processing
try:
    import librosa
    import soundfile as sf
    LIBROSA_AVAILABLE = True
except ImportError:
    LIBROSA_AVAILABLE = False
    print("Warning: librosa not available. Recognition will use mock data.")

class AudioRecognizer:
    def __init__(self):
        self.fingerprints = {}
        self.fingerprint_file_path = os.path.join(Config.FINGERPRINT_DB_DIR, "fingerprints.pkl")
        self.fingerprint_version = 2  # Increment when feature extraction changes
        
        # Check if we need to clear old fingerprints due to version change
        version_file = os.path.join(Config.FINGERPRINT_DB_DIR, "version.txt")
        current_version = 0
        if os.path.exists(version_file):
            try:
                with open(version_file, 'r') as f:
                    current_version = int(f.read().strip())
            except:
                pass
        
        if current_version != self.fingerprint_version:
            print(f"Fingerprint version changed ({current_version} -> {self.fingerprint_version}), clearing old fingerprints")
            self.fingerprints = {}
            with open(version_file, 'w') as f:
                f.write(str(self.fingerprint_version))
        
        self._load_fingerprints()
    
    def _load_fingerprints(self):
        """Load fingerprints from disk"""
        if os.path.exists(self.fingerprint_file_path):
            try:
                with open(self.fingerprint_file_path, 'rb') as f:
                    self.fingerprints = pickle.load(f)
                print(f"Loaded {len(self.fingerprints)} fingerprints")
            except Exception as e:
                print(f"Error loading fingerprints: {e}")
                self.fingerprints = {}
    
    def _save_fingerprints(self):
        """Save fingerprints to disk"""
        try:
            os.makedirs(Config.FINGERPRINT_DB_DIR, exist_ok=True)
            with open(self.fingerprint_file_path, 'wb') as f:
                pickle.dump(self.fingerprints, f)
        except Exception as e:
            print(f"Error saving fingerprints: {e}")
    
    def _extract_features(self, filepath, n_mfcc=20, n_chroma=12):
        """Extract enhanced audio features (MFCC + Chroma + Spectral)"""
        if not LIBROSA_AVAILABLE:
            return None
        
        try:
            # Load audio file
            y, sr = librosa.load(filepath, sr=22050, duration=30)  # Limit to 30 seconds
            
            # Extract MFCC features
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
            mfcc_mean = np.mean(mfcc, axis=1)
            mfcc_std = np.std(mfcc, axis=1)
            
            # Extract Chroma features (harmonic content)
            chroma = librosa.feature.chroma_stft(y=y, sr=sr, n_chroma=n_chroma)
            chroma_mean = np.mean(chroma, axis=1)
            chroma_std = np.std(chroma, axis=1)
            
            # Extract spectral contrast
            spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
            spectral_mean = np.mean(spectral_contrast, axis=1)
            spectral_std = np.std(spectral_contrast, axis=1)
            
            # Extract zero crossing rate
            zcr = librosa.feature.zero_crossing_rate(y)
            zcr_mean = np.mean(zcr)
            zcr_std = np.std(zcr)
            
            # Combine all features
            features = np.concatenate([
                mfcc_mean, mfcc_std,
                chroma_mean, chroma_std,
                spectral_mean, spectral_std,
                [zcr_mean, zcr_std]
            ])
            
            return features
        except Exception as e:
            print(f"Error extracting features from {filepath}: {e}")
            return None
    
    def fingerprint_file(self, filepath, song_name):
        """Fingerprint a single audio file"""
        if not LIBROSA_AVAILABLE:
            print("librosa not available, skipping fingerprinting")
            return False
        
        features = self._extract_features(filepath)
        if features is not None:
            self.fingerprints[song_name] = features
            self._save_fingerprints()
            print(f"Fingerprinted: {song_name}")
            return True
        return False
    
    def fingerprint_directory(self, directory_path, extensions=["mp3", "wav"]):
        """Fingerprint all audio files in a directory"""
        if not LIBROSA_AVAILABLE:
            print("librosa not available, skipping fingerprinting")
            return False
        
        count = 0
        for filename in os.listdir(directory_path):
            if any(filename.endswith(ext) for ext in extensions):
                filepath = os.path.join(directory_path, filename)
                song_name = os.path.splitext(filename)[0]
                if self.fingerprint_file(filepath, song_name):
                    count += 1
        
        print(f"Fingerprinted {count} songs from directory")
        return count > 0
    
    def recognize_file(self, filepath):
        """Recognize an audio file with high confidence matching"""
        if not LIBROSA_AVAILABLE or not self.fingerprints:
            return {
                "song_name": None,
                "confidence": 0.0,
                "recognized": False
            }
        
        features = self._extract_features(filepath)
        if features is None:
            return {
                "song_name": None,
                "confidence": 0.0,
                "recognized": False
            }
        
        # Compare against all stored fingerprints using multiple metrics
        best_match = None
        best_score = 0.0
        
        for song_name, stored_features in self.fingerprints.items():
            # Ensure features have same length
            if len(features) != len(stored_features):
                continue
            
            # Calculate cosine similarity
            cosine_sim = np.dot(features, stored_features) / (
                np.linalg.norm(features) * np.linalg.norm(stored_features)
            )
            
            # Calculate Euclidean distance (normalized)
            euclidean_dist = np.linalg.norm(features - stored_features)
            euclidean_sim = 1 / (1 + euclidean_dist)
            
            # Calculate Manhattan distance (normalized)
            manhattan_dist = np.sum(np.abs(features - stored_features))
            manhattan_sim = 1 / (1 + manhattan_dist)
            
            # Combine metrics with weights (cosine is most important)
            combined_score = 0.6 * cosine_sim + 0.2 * euclidean_sim + 0.2 * manhattan_sim
            
            if combined_score > best_score:
                best_score = combined_score
                best_match = song_name
        
        # Very high threshold for recognition (only show if very confident)
        threshold = 0.98  # 98% confidence threshold
        
        if best_score >= threshold:
            return {
                "song_name": best_match,
                "confidence": min(best_score * 100, 100.0),
                "recognized": True
            }
        else:
            return {
                "song_name": None,
                "confidence": best_score * 100,
                "recognized": False
            }
    
    def get_fingerprinted_songs(self):
        """Get list of fingerprinted songs"""
        return list(self.fingerprints.keys())
    
    def clear_fingerprints(self):
        """Clear all stored fingerprints"""
        self.fingerprints = {}
        self._save_fingerprints()
        print("All fingerprints cleared")
