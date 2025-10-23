# VR Therapy Audio Setup Guide

## Required Audio Files

Place the following audio files in the `public/audio/` directory:

### 1. Garden Ambience (`garden-ambience.mp3`)
- **Purpose**: Peaceful Garden environment background
- **Content**: Birds chirping, gentle water sounds, wind through leaves
- **Duration**: 5-10 minutes (will loop)
- **Volume**: Soft, calming

### 2. Campus Ambience (`campus-ambience.mp3`)
- **Purpose**: College Campus environment background
- **Content**: Distant chatter, footsteps, gentle campus sounds
- **Duration**: 5-10 minutes (will loop)
- **Volume**: Moderate, non-intrusive

### 3. Exam Hall Ambience (`exam-ambience.mp3`)
- **Purpose**: Exam Hall environment background
- **Content**: Clock ticking, pencil writing, paper rustling
- **Duration**: 5-10 minutes (will loop)
- **Volume**: Subtle, creates mild tension

### 4. Home Ambience (`home-ambience.mp3`)
- **Purpose**: Home Room environment background
- **Content**: Calm music, fireplace crackling, gentle home sounds
- **Duration**: 5-10 minutes (will loop)
- **Volume**: Warm, comforting

## Audio Sources

You can find suitable audio files from:
- **Freesound.org** (Creative Commons)
- **YouTube Audio Library** (Royalty-free)
- **Zapsplat** (Free with account)
- **BBC Sound Effects** (Some free)

## Audio Specifications

- **Format**: MP3
- **Bitrate**: 128-192 kbps
- **Sample Rate**: 44.1 kHz
- **Channels**: Stereo or Mono
- **File Size**: Keep under 5MB each for web performance

## Fallback Behavior

If audio files are missing, the VR therapy will still function normally. The ambient audio is an enhancement, not a requirement.

## Testing Audio

To test if audio is working:
1. Start a VR therapy session
2. Check browser console for any audio errors
3. Verify audio plays when session starts
4. Confirm audio stops when session ends

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: May require user interaction first
- **Mobile**: Audio may be limited by browser policies
