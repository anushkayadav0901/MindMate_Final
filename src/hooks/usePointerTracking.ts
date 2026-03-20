import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

interface UsePointerTrackingProps {
  videoElement: React.RefObject<HTMLVideoElement>;
  enabled?: boolean;
}

export const usePointerTracking = ({ videoElement, enabled = true }: UsePointerTrackingProps) => {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const cameraRef = useRef<Camera | null>(null);

  const detect = useCallback((results: Results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const hand = results.multiHandLandmarks[0];
      // Index 9 is the middle finger knuckle, providing a stable center-of-mass anchor
      // Invert X because camera is mirrored
      setPointer({ x: 1.0 - hand[9].x, y: hand[9].y });
    }
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
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    hands.onResults(detect);

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
    };
  }, [enabled, videoElement, detect]);

  return pointer;
};
