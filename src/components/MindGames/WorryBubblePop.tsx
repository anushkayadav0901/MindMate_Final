import React, { useState, useEffect, useRef } from 'react';
import { GameSession, GameType } from '../../pages/MindGamesPage';
import { ArrowLeft } from 'lucide-react';

interface WorryBubblePopProps {
  onComplete: (session: GameSession) => void;
  onBack: () => void;
}

interface WorryBubble {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  hesitationTime?: number;
}

interface Affirmation {
  text: string;
  color: string;
}

export const WorryBubblePop: React.FC<WorryBubblePopProps> = ({ onComplete, onBack }) => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'complete'>('waiting');
  const [bubbles, setBubbles] = useState<WorryBubble[]>([]);
  const [score, setScore] = useState(0);
  const [anxietyBefore, setAnxietyBefore] = useState(5);
  const [anxietyAfter, setAnxietyAfter] = useState(5);
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [stressIndicators, setStressIndicators] = useState<string[]>([]);
  const [hesitationCount, setHesitationCount] = useState(0);
  const [showAffirmation, setShowAffirmation] = useState<Affirmation | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const bubbleSpawnTimer = useRef<number>();
  const gameTimer = useRef<number>();

  const worries = [
    "I'll fail the exam",
    "Everyone will judge me",
    "I'm not good enough",
    "I can't handle this",
    "I'm a failure",
    "No one likes me",
    "I'm worthless",
    "I'll never succeed",
    "I'm too stupid",
    "I'm a burden",
    "I'm not smart enough",
    "I'll embarrass myself",
    "I'm not worthy",
    "I can't do anything right",
    "I'm a disappointment"
  ];

  const affirmations: Affirmation[] = [
    { text: "You've prepared well and are capable", color: "#10B981" },
    { text: "Your worth isn't defined by others", color: "#3B82F6" },
    { text: "You are enough just as you are", color: "#8B5CF6" },
    { text: "You can handle challenges with strength", color: "#F59E0B" },
    { text: "You are not a failure - you're learning", color: "#EF4444" },
    { text: "You are loved and valued", color: "#EC4899" },
    { text: "You have inherent worth and dignity", color: "#06B6D4" },
    { text: "Success comes in many forms", color: "#84CC16" },
    { text: "You are intelligent and capable", color: "#F97316" },
    { text: "You bring joy to others' lives", color: "#6366F1" },
    { text: "You are worthy of love and respect", color: "#14B8A6" },
    { text: "You have the courage to face challenges", color: "#A855F7" },
    { text: "You are valuable and important", color: "#EAB308" },
    { text: "You learn from every experience", color: "#DC2626" },
    { text: "You are proud of your efforts", color: "#059669" }
  ];

  useEffect(() => {
    if (showInstructions) return;
    
    setStartTime(Date.now());
    startGame();
  }, [showInstructions]);

  const startGame = () => {
    setGameState('playing');
    
    // Spawn bubbles every 4-6 seconds (much slower)
    bubbleSpawnTimer.current = window.setInterval(() => {
      spawnBubble();
    }, Math.random() * 2000 + 4000);

    // Game duration: 3 minutes
    gameTimer.current = window.setTimeout(() => {
      endGame();
    }, 180000);

    animate();
  };

  const spawnBubble = () => {
    const worry = worries[Math.floor(Math.random() * worries.length)];
    
    const newBubble: WorryBubble = {
      id: Math.random().toString(36).substr(2, 9),
      text: worry,
      x: Math.random() * 500 + 50, // Keep bubbles within reasonable bounds
      y: 400,
      speed: Math.random() * 0.5 + 0.3, // MUCH slower - 0.3 to 0.8 pixels per frame
      size: Math.random() * 20 + 80, // Larger bubbles for easier clicking
      hesitationTime: Date.now()
    };

    setBubbles(prev => [...prev, newBubble]);
  };

  const handleBubbleClick = (bubbleId: string) => {
    const bubble = bubbles.find(b => b.id === bubbleId);
    if (!bubble) return;

    const clickTime = Date.now();
    const hesitation = bubble.hesitationTime ? clickTime - bubble.hesitationTime : 0;
    
    // Calculate score based on hesitation
    let points = 100;
    if (hesitation > 3000) {
      points = 50; // Hesitated too long
      setStressIndicators(prev => [...prev, `Hesitated on "${bubble.text}" - possible avoidance`]);
      setHesitationCount(prev => prev + 1);
    } else if (hesitation > 1500) {
      points = 75; // Some hesitation
    }

    setScore(prev => prev + points);
    setReactionTimes(prev => [...prev, hesitation]);

    // Show affirmation
    const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    setShowAffirmation(affirmation);

    // Remove bubble
    setBubbles(prev => prev.filter(b => b.id !== bubbleId));

    // Hide affirmation after 2 seconds
    setTimeout(() => setShowAffirmation(null), 2000);
  };

  const endGame = () => {
    setGameState('complete');
    
    if (bubbleSpawnTimer.current) {
      clearInterval(bubbleSpawnTimer.current);
    }
    if (gameTimer.current) {
      clearTimeout(gameTimer.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    calculateFinalResults();
  };

  const calculateFinalResults = () => {
    const avgReactionTime = reactionTimes.length > 0 
      ? reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length 
      : 0;
    const accuracy = Math.round((score / (bubbles.length * 100)) * 100);
    
    // Calculate anxiety reduction based on performance
    let anxietyReduction = 0;
    if (hesitationCount === 0) anxietyReduction = 3;
    else if (hesitationCount <= 2) anxietyReduction = 2;
    else if (hesitationCount <= 5) anxietyReduction = 1;
    
    setAnxietyAfter(Math.max(1, anxietyBefore - anxietyReduction));

    const session: GameSession = {
      gameType: 'worry-bubble' as GameType,
      duration: Math.round((Date.now() - startTime) / 1000 / 60), // minutes
      score: Math.round((score / (bubbles.length * 100)) * 100),
      anxietyBefore,
      anxietyAfter: anxietyBefore - anxietyReduction,
      timestamp: new Date().toISOString(),
      metrics: {
        reactionTime: reactionTimes,
        accuracy: Math.round((score / (bubbles.length * 100)) * 100),
        hesitationCount,
        stressIndicators
      }
    };

    setTimeout(() => onComplete(session), 3000);
  };

  const animate = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw underwater background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0EA5E9');
    gradient.addColorStop(1, '#0284C7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bubbles
    bubbles.forEach(bubble => {
      // Update bubble position
      bubble.y -= bubble.speed;
      
      // Draw bubble
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw worry text
      ctx.fillStyle = '#1F2937';
      ctx.font = `${bubble.size / 3}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(bubble.text, bubble.x, bubble.y + 5);
    });

    // Remove bubbles that are off screen
    setBubbles(prev => prev.filter(bubble => bubble.y > -50));

    // Draw score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 40);

    // Draw affirmation if showing
    if (showAffirmation) {
      ctx.fillStyle = showAffirmation.color;
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(showAffirmation.text, canvas.width / 2, canvas.height - 50);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, bubbles, showAffirmation]);

  if (showInstructions) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ArrowLeft className="w-4 h-4 inline mr-2" />
          Back to Games
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">
            🫧 Worry Bubble Pop
          </h2>
          
          <div className="space-y-6">
            <div className="bg-purple-500/20 p-6 rounded-lg border border-purple-400/30">
              <h3 className="text-xl font-semibold mb-3 text-purple-200">How to Play:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Worry bubbles will float up slowly from the bottom</li>
                <li>Click each bubble to "pop" the worry</li>
                <li>Positive affirmations will appear when you pop worries</li>
                <li>Take your time - no rush, this is about letting go</li>
                <li>Game lasts 3 minutes</li>
              </ol>
            </div>

            <div className="bg-green-500/20 p-6 rounded-lg border border-green-400/30">
              <h3 className="text-xl font-semibold mb-3 text-green-200">Therapeutic Benefit:</h3>
              <p className="text-gray-300">
                This game uses Cognitive Behavioral Therapy techniques to help you recognize and release negative thoughts. 
                By actively "popping" worries and seeing positive affirmations, you're retraining your brain to focus on positive self-talk.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <label className="text-gray-300 font-semibold">Rate your anxiety level (1-10):</label>
              <input
                type="range"
                min="1"
                max="10"
                value={anxietyBefore}
                onChange={(e) => setAnxietyBefore(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-lg font-bold text-purple-300">{anxietyBefore}</span>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Worry Popping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'complete') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl shadow-xl text-center border border-white/20">
          <h2 className="text-3xl font-bold mb-6 text-green-400">🎉 Worry Popping Complete!</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-400/30">
              <div className="text-2xl font-bold text-purple-300">{score}</div>
              <div className="text-gray-300">Total Score</div>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg border border-green-400/30">
              <div className="text-2xl font-bold text-green-300">{anxietyBefore - anxietyAfter}</div>
              <div className="text-gray-300">Anxiety Reduction</div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg mb-6 border border-gray-600/30">
            <h3 className="font-semibold mb-2 text-white">AI Analysis:</h3>
            {hesitationCount === 0 ? (
              <p className="text-green-400">✅ Excellent! You confidently addressed all worries without hesitation.</p>
            ) : (
              <div className="text-left">
                <p className="text-orange-400 mb-2">⚠️ Analysis:</p>
                <ul className="list-disc list-inside text-sm text-gray-300">
                  <li>You hesitated on {hesitationCount} worries - this reveals specific fears</li>
                  <li>Consider practicing positive self-talk for these areas</li>
                  {stressIndicators.map((indicator, index) => (
                    <li key={index}>{indicator}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <p className="text-gray-300 mb-4">
            Great job! You've practiced recognizing and releasing negative thoughts, which is a key CBT technique.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
      >
        <ArrowLeft className="w-4 h-4 inline mr-2" />
        Back to Games
      </button>

      <div className="text-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border-2 border-white/20 rounded-xl shadow-lg"
          onClick={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find clicked bubble
            const clickedBubble = bubbles.find(bubble => {
              const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
              return distance <= bubble.size;
            });
            
            if (clickedBubble) {
              handleBubbleClick(clickedBubble.id);
            }
          }}
        />
        
        <div className="mt-6 text-gray-300">
          <p>Click the worry bubbles to pop them and see positive affirmations</p>
          <p className="text-sm mt-2">Game duration: 3 minutes</p>
        </div>
      </div>
    </div>
  );
};
