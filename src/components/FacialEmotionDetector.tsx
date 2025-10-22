import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, CameraOff, X, Shield } from 'lucide-react';
import { DetectedEmotion, mapFaceApiEmotion } from '../utils/emotionResponses';

interface FacialEmotionDetectorProps {
  readonly onEmotionDetected: (emotion: DetectedEmotion, confidence: number) => void;
  readonly onCameraStatusChange?: (isActive: boolean) => void;
}

export default function FacialEmotionDetector({
  onEmotionDetected,
  onCameraStatusChange,
}: FacialEmotionDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [showPermissionRequest, setShowPermissionRequest] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<DetectedEmotion>('neutral');
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const detectionIntervalRef = useRef<NodeJS.Timeout>();
  const streamRef = useRef<MediaStream | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        console.log('🔄 Loading face detection models from:', MODEL_URL);
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        setIsModelLoaded(true);
        console.log('✅ Face detection models loaded successfully!');
      } catch (error) {
        console.error('❌ Error loading face detection models:', error);
        setIsModelLoaded(false);
      }
    };

    loadModels();
  }, []);

  // Start camera
  const startCamera = async () => {
    if (!isModelLoaded) {
      console.error('Cannot start camera: Models not loaded');
      return;
    }

    // First check if we already have an active stream
    if (streamRef.current) {
      console.log('Stopping existing camera stream...');
      stopCamera();
    }

    // Wait for video element to be available in the DOM
    let retries = 0;
    while (!videoRef.current && retries < 5) {
      console.log('Waiting for video element to be ready...');
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }

    if (!videoRef.current) {
      console.error('Video element not found after waiting');
      setPermissionDenied(true);
      return;
    }

    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      console.log('Camera access granted, setting up video stream...');
      const videoElement = videoRef.current;
      if (!videoElement) {
        throw new Error('Video element lost during setup');
      }

      // Set video properties and stream
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.muted = true;
      videoElement.srcObject = stream;
      streamRef.current = stream;
      
      await new Promise<void>((resolve, reject) => {
        const video = videoElement;
        let cleanupDone = false;
        
        const cleanup = () => {
          if (!cleanupDone) {
            cleanupDone = true;
            video.onloadedmetadata = null;
            video.onerror = null;
          }
        };

        // Set up error handler
        video.onerror = (e) => {
          console.error('Video element error:', e);
          cleanup();
          reject(new Error('Video element encountered an error'));
        };
        
        // Set up all event handlers before attaching stream
        video.onloadedmetadata = async () => {
          try {
            console.log('Video metadata loaded, starting playback...');
            try {
              await video.play();
              setIsCameraActive(true);
              setShowPermissionRequest(false);
              setPermissionDenied(false);
              onCameraStatusChange?.(true);
              startDetection();
              cleanup();
              resolve();
            } catch (playError) {
              console.error('Error starting video playback:', playError);
              cleanup();
              // Check if it's an interaction error
              if (playError.name === 'NotAllowedError') {
                reject(new Error('Video playback requires user interaction first'));
              } else {
                reject(playError);
              }
            }
          } catch (error) {
            console.error('Error during video setup:', error);
            cleanup();
            reject(error);
          }
        };
      });
    } catch (error: any) {
      console.error('Camera access error:', error);
      setPermissionDenied(true);
      setShowPermissionRequest(false);
      onCameraStatusChange?.(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    setIsCameraActive(false);
    onCameraStatusChange?.(false);
  };

  // Detect emotions
  const detectEmotion = async () => {
    if (!videoRef.current || !isModelLoaded || isProcessing) return;

    setIsProcessing(true);

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detection) {
        const expressions = detection.expressions;
        const emotion = mapFaceApiEmotion(expressions);
        const emotionConfidence = expressions[emotion];

        if (emotionConfidence > 0.7) {
          setCurrentEmotion(emotion);
          setConfidence(emotionConfidence);
          onEmotionDetected(emotion, emotionConfidence);
        }

        if (canvasRef.current && videoRef.current) {
          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          };
          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetection = faceapi.resizeResults(detection, displaySize);
          
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetection);
          }
        }
      }
    } catch (error) {
      console.error('Error detecting emotion:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Start continuous detection
  const startDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    detectionIntervalRef.current = setInterval(detectEmotion, 2500);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Permission request dialog
  if (showPermissionRequest) {
    return (
      <div className="fixed top-6 left-6 z-40 p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 max-w-xs">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-white/70 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-white text-sm mb-2">
              I'd love to understand your emotions better! Allow camera access to enable real-time detection.
            </p>
            <button
              onClick={startCamera}
              className="text-teal-300 text-sm hover:underline flex items-center gap-2"
              disabled={!isModelLoaded}
            >
              {isModelLoaded ? '✨ Enable Camera' : '⌛ Loading Models...'}
            </button>
          </div>
          <button
            onClick={() => setShowPermissionRequest(false)}
            className="p-1 rounded-lg hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>
    );
  }

  // Permission denied message
  if (permissionDenied) {
    return (
      <div className="fixed top-6 left-6 z-40 p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 max-w-xs">
        <div className="flex items-start gap-3">
          <CameraOff className="w-5 h-5 text-white/70 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-white text-sm mb-2">
              Camera disabled. I'll use your manual input instead! 😊
            </p>
            <button
              onClick={() => setShowPermissionRequest(true)}
              className="text-teal-300 text-sm hover:underline flex items-center gap-2"
            >
              Enable camera
            </button>
          </div>
          <button
            onClick={() => setPermissionDenied(false)}
            className="p-1 rounded-lg hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>
    );
  }

  // Main camera feed view
  return (
    <div className="fixed top-6 right-6 z-40 group">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-48 h-36 object-cover"
        />
        
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 192 144">
            <circle
              cx="96"
              cy="72"
              r="68"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="96"
              cy="72"
              r="68"
              fill="none"
              stroke="rgba(74, 222, 128, 0.8)"
              strokeWidth="2"
              strokeDasharray={`${confidence * 427} 427`}
              strokeLinecap="round"
              transform="rotate(-90 96 72)"
              className="transition-all duration-500"
            />
          </svg>
        </div>

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
            <p className="text-white text-xs font-medium">
              {currentEmotion} {Math.round(confidence * 100)}%
            </p>
          </div>
          
          {isProcessing && (
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
        </div>

        <button
          onClick={stopCamera}
          className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4 text-white/70" />
        </button>
      </div>
    </div>
  );
}