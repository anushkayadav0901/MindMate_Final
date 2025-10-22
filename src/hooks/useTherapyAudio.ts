import { useState, useEffect } from 'react';
import { AudioGuidance } from '../types/vrTherapy.types';
import { speakText } from '../utils/vrTherapyUtils';

export const useTherapyAudio = (guidance: AudioGuidance[], sessionActive: boolean) => {
  const [currentGuidanceIndex, setCurrentGuidanceIndex] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (sessionActive && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
  }, [sessionActive, sessionStartTime]);

  useEffect(() => {
    if (!sessionActive || !sessionStartTime || currentGuidanceIndex >= guidance.length) return;

    const currentGuidance = guidance[currentGuidanceIndex];
    const elapsedSeconds = (Date.now() - sessionStartTime.getTime()) / 1000;
    
    if (elapsedSeconds >= currentGuidance.timing) {
      speakText(currentGuidance.text);
      setCurrentGuidanceIndex(prev => prev + 1);
    }

    const checkInterval = setInterval(() => {
      const elapsed = (Date.now() - sessionStartTime.getTime()) / 1000;
      if (elapsed >= currentGuidance.timing) {
        speakText(currentGuidance.text);
        setCurrentGuidanceIndex(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [sessionActive, sessionStartTime, currentGuidanceIndex, guidance]);

  const resetAudio = () => {
    setCurrentGuidanceIndex(0);
    setSessionStartTime(null);
  };

  return { resetAudio };
};
