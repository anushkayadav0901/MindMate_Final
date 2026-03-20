import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

export type EmotionState = 'happy' | 'sad' | 'neutral' | 'analyzing';

interface UseEmotionTrackingProps {
  videoElement: React.RefObject<HTMLVideoElement>;
  enabled?: boolean;
}

export const useEmotionTracking = ({ videoElement, enabled = true }: UseEmotionTrackingProps) => {
  const [emotion, setEmotion] = useState<EmotionState>('analyzing');
  const [isReady, setIsReady] = useState(false);
  
  const cameraRef = useRef<Camera | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);

  // Throttle detection to save precise UI performance (max once per 1.5 seconds)
  const lastDetectionTime = useRef<number>(0);

  const detectEmotion = useCallback((results: Results) => {
    const now = Date.now();
    if (now - lastDetectionTime.current < 1500) {
      return;
    }
    lastDetectionTime.current = now;

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      setEmotion('analyzing');
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];

    // Face bounds references for normalization
    // 234: Left cheek edge, 454: Right cheek edge
    const faceWidth = Math.sqrt(
      Math.pow(landmarks[454].x - landmarks[234].x, 2) + Math.pow(landmarks[454].y - landmarks[234].y, 2)
    );

    // Mouth landmarks
    // 61: Left mouth corner, 291: Right mouth corner
    // 13: Upper lip center, 14: Lower lip center
    const mouthWidth = Math.sqrt(
      Math.pow(landmarks[291].x - landmarks[61].x, 2) + Math.pow(landmarks[291].y - landmarks[61].y, 2)
    );
    
    const leftCornerY = landmarks[61].y;
    const rightCornerY = landmarks[291].y;
    const centerLipY = landmarks[13].y;
    
    const avgCornerY = (leftCornerY + rightCornerY) / 2;
    
    // Relative difference. MediaPipe Y=0 is top. 
    // Positive diffY means corners are HIGHER than center (numerically smaller Y).
    const diffY = centerLipY - avgCornerY;
    
    const mouthWidthRatio = mouthWidth / faceWidth;

    // Smile heuristic: corners actively pulled up. Made highly sensitive.
    if (diffY > 0.003 && mouthWidthRatio > 0.20) {
      setEmotion('happy');
    } 
    // Frown heuristic: corners pull downwards. Made highly sensitive.
    else if (diffY < -0.005) {
      setEmotion('sad');
    } 
    else {
      setEmotion('neutral');
    }
  }, []);

  useEffect(() => {
    if (!enabled || !videoElement.current) {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      return;
    }

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: false,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    faceMesh.onResults((results) => {
      // Intentionally skipping drawing utility calls for pure headless performance optimization
      detectEmotion(results);
    });

    faceMeshRef.current = faceMesh;

    const camera = new Camera(videoElement.current, {
      onFrame: async () => {
        if (videoElement.current) {
          await faceMesh.send({ image: videoElement.current });
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
      faceMesh.close();
      setIsReady(false);
    };
  }, [enabled, videoElement, detectEmotion]);

  return { emotion, isReady };
};
