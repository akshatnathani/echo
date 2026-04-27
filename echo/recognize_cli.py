"""
CLI for real-time audio recognition.
Run this script to recognize music from microphone.
"""

import argparse
import sys
from realtime_recognizer import RecognitionService


def main():
    parser = argparse.ArgumentParser(description='Real-time audio recognition CLI')
    parser.add_argument('--mode', choices=['continuous', 'single'], default='continuous',
                       help='Recognition mode: continuous (default) or single chunk')
    parser.add_argument('--duration', type=float, default=2.0,
                       help='Duration in seconds for single chunk mode (default: 2.0)')
    parser.add_argument('--confidence', type=float, default=0.3,
                       help='Minimum confidence threshold (default: 0.3)')
    
    args = parser.parse_args()
    
    print("=" * 50)
    print("Real-time Audio Recognition CLI")
    print("=" * 50)
    print(f"Mode: {args.mode}")
    print(f"Minimum confidence: {args.confidence:.0%}")
    print()
    
    service = RecognitionService(min_confidence=args.confidence)
    
    def on_recognition(result):
        """Callback when song is recognized."""
        print(f"\n{'=' * 50}")
        print(f"✓ MATCH FOUND!")
        print(f"  Song: {result['song_name']}")
        print(f"  Artist: {result['artist']}")
        print(f"  Confidence: {result['confidence']:.2%}")
        print(f"  File: {result['file_path']}")
        print(f"{'=' * 50}\n")
    
    service.set_recognition_callback(on_recognition)
    
    if args.mode == 'single':
        print(f"Recording for {args.duration} seconds...")
        print("Speak or play music now...")
        
        result = service.recognize_single_chunk(duration=args.duration)
        
        if result:
            print(f"\n✓ Recognized: {result['artist']} - {result['song_name']}")
            print(f"  Confidence: {result['confidence']:.2%}")
        else:
            print("\n✗ No match found")
    else:
        print("Starting continuous recognition...")
        print("Listening for music... (Press Ctrl+C to stop)")
        print()
        service.start()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nStopped by user.")
        sys.exit(0)
