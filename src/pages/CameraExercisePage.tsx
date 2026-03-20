import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePoseTracking, ExerciseType } from '../hooks/usePoseTracking';
import { CheckCircle, Square, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CameraExercisePage() {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exercise, setExercise] = useState<ExerciseType>('none');
  const [isRunning, setIsRunning] = useState(false);

  const { feedback, isReady, exerciseProgress } = usePoseTracking({
    videoElement: videoRef,
    canvasElement: canvasRef,
    enabled: isRunning,
    activeExercise: exercise
  });

  const handleStart = (ex: ExerciseType) => {
    setExercise(ex);
    setIsRunning(true);
  };

  const stopExercise = () => {
    setExercise('none');
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-140px)] w-full px-4 py-8 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 w-full max-w-4xl"
      >
        <h1 className={`text-4xl md:text-5xl font-light mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
          AI Movement <span className="font-semibold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">Therapy</span>
        </h1>
        <p className={`text-lg font-light ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>
          Follow the guided camera exercises to relieve physical tension and clear your mind.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar Controls */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className={`col-span-1 rounded-[2rem] p-6 backdrop-blur-xl border flex flex-col gap-6 shadow-xl ${
            theme === 'dark' ? 'bg-slate-800/40 border-white/10' : 'bg-white/60 border-white/50'
          }`}
        >
          <h3 className={`text-2xl font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Select Exercise</h3>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleStart('arms_raise')}
              className={`p-5 rounded-2xl text-left transition-all hover:scale-105 ${
                exercise === 'arms_raise' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/80 hover:bg-white text-slate-800'
              }`}
            >
              <h4 className="font-semibold text-lg">Overhead Arm Raise</h4>
              <p className="text-sm opacity-80">Relieves chest tension and opens breathing space</p>
            </button>
            <button
              onClick={() => handleStart('side_stretch')}
              className={`p-5 rounded-2xl text-left transition-all hover:scale-105 ${
                exercise === 'side_stretch' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/80 hover:bg-white text-slate-800'
              }`}
            >
              <h4 className="font-semibold text-lg">Lateral Side Stretch</h4>
              <p className="text-sm opacity-80">Releases back stiffness and improves posture</p>
            </button>
            <button
              onClick={() => handleStart('hold_pose')}
              className={`p-5 rounded-2xl text-left transition-all hover:scale-105 ${
                exercise === 'hold_pose' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                : theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/80 hover:bg-white text-slate-800'
              }`}
            >
              <h4 className="font-semibold text-lg">Balance Hold</h4>
              <p className="text-sm opacity-80">Build core stability and mindfulness tracking</p>
            </button>
          </div>

          {isRunning && (
            <button onClick={stopExercise} className="mt-auto flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all font-semibold">
              <Square className="w-5 h-5" /> Stop Session
            </button>
          )}
        </motion.div>

        {/* Camera View */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className={`col-span-1 lg:col-span-2 rounded-[2rem] overflow-hidden relative backdrop-blur-xl border shadow-2xl ${
            theme === 'dark' ? 'bg-slate-900/50 border-white/10' : 'bg-slate-300/30 border-white/50'
          } min-h-[480px] flex items-center justify-center`}
        >
          {/* Base Video container */}
          <div className="absolute inset-0 z-0">
             <video
                ref={videoRef}
                className="w-full h-full object-cover transform -scale-x-100 opacity-80"
                playsInline
                muted
                autoPlay
              />
          </div>
          
          {/* Custom tracking canvas overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-10 w-full h-full object-cover transform -scale-x-100"
            width={640}
            height={480}
          />

          {!isRunning && (
            <div className="z-20 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md shadow-lg border border-white/30">
                <Settings className={`w-12 h-12 ${theme === 'dark' ? 'text-white/80' : 'text-slate-600'}`} />
              </div>
              <p className={`text-2xl font-light ${theme === 'dark' ? 'text-white/80' : 'text-slate-700'}`}>Select an exercise to activate tracking</p>
            </div>
          )}

          {/* Live Feedback Overlay */}
          {isRunning && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-md">
              <div className="bg-slate-900/80 backdrop-blur-lg border border-white/20 p-6 rounded-3xl shadow-2xl text-center">
                <p className="text-white text-2xl font-light mb-5 tracking-wide">{feedback}</p>
                <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${exerciseProgress}%` }}
                  />
                </div>
                {exerciseProgress >= 100 && (
                   <p className="mt-5 text-emerald-400 font-bold flex flex-row items-center justify-center gap-2">
                     <CheckCircle className="w-6 h-6"/> Excellent! Exercise Rest Complete.
                   </p>
                )}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isRunning && !isReady && (
            <div className="absolute inset-0 z-40 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white text-xl font-light tracking-wide animate-pulse">Initializing MediaPipe Pose Engine...</p>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
