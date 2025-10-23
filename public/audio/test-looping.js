// Audio Loop Test Script
// Run this in browser console to test audio looping

function testAudioLooping() {
  console.log('🎵 Testing audio looping functionality...');
  
  const audio = new Audio('/audio/garden-ambience.mp3');
  audio.loop = true;
  audio.volume = 0.1;
  
  let loopCount = 0;
  
  audio.addEventListener('loadstart', () => {
    console.log('🎵 Audio loading started');
  });
  
  audio.addEventListener('canplaythrough', () => {
    console.log('🎵 Audio ready to play');
  });
  
  audio.addEventListener('play', () => {
    console.log('🎵 Audio started playing');
  });
  
  audio.addEventListener('ended', () => {
    loopCount++;
    console.log(`🎵 Audio ended, loop count: ${loopCount}`);
    if (loopCount < 3) {
      audio.currentTime = 0;
      audio.play().catch(console.warn);
    }
  });
  
  audio.addEventListener('timeupdate', () => {
    if (audio.duration > 0) {
      const timeLeft = audio.duration - audio.currentTime;
      if (timeLeft < 0.5) {
        console.log('🎵 Audio near end, preparing to loop');
      }
    }
  });
  
  audio.addEventListener('error', (e) => {
    console.error('🎵 Audio error:', e);
  });
  
  // Start playing
  audio.play().then(() => {
    console.log('🎵 Audio playback test started - will loop 3 times');
    
    // Stop after 3 loops
    setTimeout(() => {
      audio.pause();
      console.log('🎵 Audio loop test completed');
    }, 30000); // 30 seconds max
    
  }).catch((error) => {
    console.warn('🎵 Audio play failed (user interaction required):', error);
  });
}

// Run the test
console.log('Run testAudioLooping() to test audio looping');
