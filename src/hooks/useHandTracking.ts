import { useEffect, useRef, useState, useCallback } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export type GestureType = 'open_palm' | 'closed_fist' | 'pointing' | 'none';

interface UseHandTrackingProps {
  videoElement: React.RefObject<HTMLVideoElement>;
  enabled?: boolean;
}

export const useHandTracking = ({ videoElement, enabled = true }: UseHandTrackingProps) => {
  const [gesture, setGesture] = useState<GestureType>('none');
  const [isReady, setIsReady] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  const handsRef = useRef<Hands | null>(null);

  const detectGesture = useCallback((results: Results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      setGesture('none');
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    // Simple heuristic for finger extension: compare distance of fingertip to wrist vs knuckle to wrist
    const wrist = landmarks[0];
    
    // Disable any checking for specific complex landmarks to just calculate basic extensions
    const getDist = (p1: any, p2: any) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    
    // Check if fingers are extended from palm center/wrist
    const isIndexExtended = getDist(landmarks[8], wrist) > getDist(landmarks[5], wrist);
    const isMiddleExtended = getDist(landmarks[12], wrist) > getDist(landmarks[9], wrist);
    const isRingExtended = getDist(landmarks[16], wrist) > getDist(landmarks[13], wrist);
    const isPinkyExtended = getDist(landmarks[20], wrist) > getDist(landmarks[17], wrist);

    // Simplistic analysis
    if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
      setGesture('open_palm');
    } else if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      setGesture('closed_fist');
    } else if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      setGesture('pointing');
    } else {
      setGesture('none');
    }
  }, []);

  useEffect(() => {
    if (!enabled || !videoElement.current) {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      return;
    }

    // Initialize Hands
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      detectGesture(results);
    });

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

    camera.start().then(() => {
      setIsReady(true);
    });
    cameraRef.current = camera;

    return () => {
      camera.stop();
      hands.close();
      setIsReady(false);
    };
  }, [enabled, videoElement, detectGesture]);

  return { gesture, isReady };
};
