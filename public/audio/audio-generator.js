// Simple Audio Generator for VR Therapy
// Run this in browser console to generate basic ambient sounds

// Garden Ambience Generator
function generateGardenAmbience() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 10; // 10 seconds (will loop)
  
  // Create white noise for wind
  const windNoise = audioContext.createBufferSource();
  const windBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
  const windData = windBuffer.getChannelData(0);
  
  for (let i = 0; i < windData.length; i++) {
    windData[i] = (Math.random() * 2 - 1) * 0.1; // Low volume wind
  }
  
  windNoise.buffer = windBuffer;
  windNoise.loop = true;
  
  // Add low-pass filter for wind effect
  const windFilter = audioContext.createBiquadFilter();
  windFilter.type = 'lowpass';
  windFilter.frequency.value = 1000;
  
  windNoise.connect(windFilter);
  windFilter.connect(audioContext.destination);
  
  windNoise.start();
  console.log('Garden ambience generated!');
}

// Exam Hall Ambience Generator  
function generateExamAmbience() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create clock ticking sound
  const tickInterval = setInterval(() => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, 1000); // Tick every second
  
  console.log('Exam hall ambience generated!');
  
  // Stop after 10 seconds
  setTimeout(() => {
    clearInterval(tickInterval);
  }, 10000);
}

// Usage:
// generateGardenAmbience();
// generateExamAmbience();
