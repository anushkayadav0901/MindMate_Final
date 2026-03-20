import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

interface UseBreathTrackingProps {
  videoElement: React.RefObject<HTMLVideoElement>;
  enabled?: boolean;
}

export const useBreathTracking = ({ videoElement, enabled = true }: UseBreathTrackingProps) => {
  const [handDistance, setHandDistance] = useState<number>(0);
  const [handsVisible, setHandsVisible] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  const handsRef = useRef<Hands | null>(null);

  const detectDistance = useCallback((results: Results) => {
    // We need exactly two hands to measure the spread
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length < 2) {
      setHandsVisible(false);
      return;
    }

    setHandsVisible(true);
    const hand1 = results.multiHandLandmarks[0];
    const hand2 = results.multiHandLandmarks[1];

    // Index finger tips (landmark 8)
    const tip1 = hand1[8];
    const tip2 = hand2[8];

    // Compute raw 2D normalized Euclidean distance
    const dist = Math.sqrt(Math.pow(tip1.x - tip2.x, 2) + Math.pow(tip1.y - tip2.y, 2));
    
    // Smooth update to avoid jitter
    setHandDistance(prev => prev + (dist - prev) * 0.2);
  }, []);

  useEffect(() => {
    if (!enabled || !videoElement.current) {
      if (cameraRef.current) cameraRef.current.stop();
      return;
    }

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(detectDistance);
    handsRef.current = hands;

    const camera = new Camera(videoElement.current, {
      onFrame: async () => {
        if (videoElement.current) {
          await hands.send({ image: videoElement.current });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();
    cameraRef.current = camera;

    return () => {
      camera.stop();
      hands.close();
      setHandsVisible(false);
    };
  }, [enabled, videoElement, detectDistance]);

  return { handDistance, handsVisible };
};
