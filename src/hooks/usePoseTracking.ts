import { useEffect, useRef, useState, useCallback } from 'react';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export type ExerciseType = 'arms_raise' | 'side_stretch' | 'hold_pose' | 'none';

interface UsePoseTrackingProps {
  videoElement: React.RefObject<HTMLVideoElement>;
  canvasElement: React.RefObject<HTMLCanvasElement>;
  enabled?: boolean;
  activeExercise?: ExerciseType;
}

export const usePoseTracking = ({ 
  videoElement, 
  canvasElement,
  enabled = true, 
  activeExercise = 'none' 
}: UsePoseTrackingProps) => {
  const [feedback, setFeedback] = useState<string>('Initializing camera...');
  const [isReady, setIsReady] = useState(false);
  const [exerciseProgress, setExerciseProgress] = useState(0); 
  
  const cameraRef = useRef<Camera | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const stabilityCounterRef = useRef(0);

  const drawTracking = useCallback((results: Results) => {
    if (!canvasElement.current) return;
    const canvasCtx = canvasElement.current.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height);
    
    // Draw tracking lines explicitly avoiding the bloated drawing_utils dependency
    if (results.poseLandmarks) {
      const landmarks = results.poseLandmarks;
      canvasCtx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      canvasCtx.lineWidth = 4;
      
      const drawLine = (p1: any, p2: any) => {
        if (!p1 || !p2 || p1.visibility < 0.6 || p2.visibility < 0.6) return;
        canvasCtx.beginPath();
        canvasCtx.moveTo(p1.x * canvasElement.current!.width, p1.y * canvasElement.current!.height);
        canvasCtx.lineTo(p2.x * canvasElement.current!.width, p2.y * canvasElement.current!.height);
        canvasCtx.stroke();
      };

      // Connect upper body segments
      drawLine(landmarks[11], landmarks[13]); 
      drawLine(landmarks[13], landmarks[15]); 
      drawLine(landmarks[12], landmarks[14]); 
      drawLine(landmarks[14], landmarks[16]); 
      drawLine(landmarks[11], landmarks[12]); 
      
      canvasCtx.fillStyle = '#ffffff';
      [11, 12, 13, 14, 15, 16].forEach(idx => {
        const p = landmarks[idx];
        if (p && p.visibility && p.visibility > 0.6) {
          canvasCtx.beginPath();
          canvasCtx.arc(p.x * canvasElement.current!.width, p.y * canvasElement.current!.height, 6, 0, 2 * Math.PI);
          canvasCtx.fill();
        }
      });
    }
    canvasCtx.restore();
  }, [canvasElement]);

  const detectExercise = useCallback((results: Results) => {
    if (!results.poseLandmarks) {
      setFeedback('Step into view of the camera');
      return;
    }

    const landmarks = results.poseLandmarks;
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    
    if (leftShoulder.visibility! < 0.5 || rightShoulder.visibility! < 0.5 || 
        leftWrist.visibility! < 0.5 || rightWrist.visibility! < 0.5) {
      setFeedback('Ensure both arms and shoulders are visible');
      return;
    }

    if (activeExercise === 'arms_raise') {
      const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const avgWristY = (leftWrist.y + rightWrist.y) / 2;
      
      if (avgWristY < avgShoulderY - 0.2) {
        setFeedback('Great! Hold your arms up.');
        setExerciseProgress(current => Math.min(100, current + 1.5));
      } else if (avgWristY < avgShoulderY) {
        setFeedback('Raise your hands higher');
      } else {
        setFeedback('Slowly raise both arms above your head');
      }
    } 
    else if (activeExercise === 'side_stretch') {
      const shoulderDiffY = Math.abs(leftShoulder.y - rightShoulder.y);
      if (shoulderDiffY > 0.15) {
        setFeedback('Good stretch! Hold there.');
        setExerciseProgress(current => Math.min(100, current + 1.5));
      } else {
        setFeedback('Gently tilt your torso to one side');
      }
    }
    else if (activeExercise === 'hold_pose') {
      stabilityCounterRef.current++;
      if (stabilityCounterRef.current > 20) {
        setFeedback('Holding steady, great job...');
        setExerciseProgress(current => Math.min(100, current + 1));
      } else {
        setFeedback('Hold your perfectly balanced posture');
      }
    } else {
      setFeedback('Select an exercise to begin');
    }
  }, [activeExercise]);

  useEffect(() => {
    if (!enabled || !videoElement.current) {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      return;
    }

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    pose.onResults((results) => {
      drawTracking(results);
      detectExercise(results);
    });

    poseRef.current = pose;

    const camera = new Camera(videoElement.current, {
      onFrame: async () => {
        if (videoElement.current) {
          await pose.send({ image: videoElement.current });
        }
      },
      width: 640,
      height: 480,
    });

    setFeedback('Starting camera track...');
    camera.start().then(() => {
      setIsReady(true);
      setFeedback('Ready! Follow the guidance on screen.');
    });
    cameraRef.current = camera;

    return () => {
      camera.stop();
      pose.close();
      setIsReady(false);
      setFeedback('');
    };
  }, [enabled, videoElement, canvasElement, detectExercise, drawTracking]);

  useEffect(() => {
    setExerciseProgress(0);
    stabilityCounterRef.current = 0;
  }, [activeExercise]);

  return { feedback, isReady, exerciseProgress };
};
