// Audio Test Script
// Run this in browser console to test if audio files are accessible

async function testAudioFiles() {
  const audioFiles = [
    '/audio/garden-ambience.mp3',
    '/audio/campus-ambience.mp3', 
    '/audio/exam-ambience.mp3',
    '/audio/home-ambience.mp3'
  ];

  console.log('🎵 Testing audio file accessibility...');

  for (const audioFile of audioFiles) {
    try {
      const response = await fetch(audioFile, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ ${audioFile} - Accessible`);
      } else {
        console.log(`❌ ${audioFile} - Not accessible (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${audioFile} - Error:`, error);
    }
  }
}

// Test audio playback
function testAudioPlayback() {
  const audio = new Audio('/audio/garden-ambience.mp3');
  audio.volume = 0.1;
  
  audio.addEventListener('loadstart', () => {
    console.log('🎵 Audio loading started');
  });
  
  audio.addEventListener('canplaythrough', () => {
    console.log('🎵 Audio ready to play');
  });
  
  audio.addEventListener('error', (e) => {
    console.error('🎵 Audio error:', e);
  });
  
  audio.addEventListener('play', () => {
    console.log('🎵 Audio started playing');
  });
  
  // Try to play
  audio.play().then(() => {
    console.log('🎵 Audio playback test successful!');
    setTimeout(() => {
      audio.pause();
      console.log('🎵 Audio playback test completed');
    }, 3000);
  }).catch((error) => {
    console.warn('🎵 Audio playback failed (user interaction required):', error);
  });
}

// Run tests
console.log('Run testAudioFiles() to check file accessibility');
console.log('Run testAudioPlayback() to test audio playback');
