import React, { useState, useEffect, useRef } from 'react';
import { GameSession, GameType } from '../../pages/MindGamesPage';
import { ArrowLeft } from 'lucide-react';

interface MindfulMazeProps {
  onComplete: (session: GameSession) => void;
  onBack: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface MeditationSymbol {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

export const MindfulMaze: React.FC<MindfulMazeProps> = ({ onComplete, onBack }) => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'complete'>('waiting');
  const [playerPos, setPlayerPos] = useState<Position>({ x: 50, y: 350 });
  const [mindfulnessMeter, setMindfulnessMeter] = useState(100);
  const [anxietyBefore, setAnxietyBefore] = useState(5);
  const [anxietyAfter, setAnxietyAfter] = useState(5);
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [stressIndicators, setStressIndicators] = useState<string[]>([]);
  const [backtrackCount, setBacktrackCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [collectedSymbols, setCollectedSymbols] = useState(0);
  const [movementSpeed, setMovementSpeed] = useState<number[]>([]);
  const [lastPosition, setLastPosition] = useState<Position>({ x: 50, y: 350 });
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastMoveTime = useRef<number>(0);
  const speedTimer = useRef<number>();

  const meditationSymbols: MeditationSymbol[] = [
    { id: '1', x: 200, y: 300, collected: false },
    { id: '2', x: 400, y: 250, collected: false },
    { id: '3', x: 300, y: 150, collected: false },
    { id: '4', x: 500, y: 100, collected: false },
    { id: '5', x: 150, y: 50, collected: false }
  ];

  const mazeWalls = [
    // Outer walls
    { x: 0, y: 0, width: 600, height: 20 },
    { x: 0, y: 0, width: 20, height: 400 },
    { x: 580, y: 0, width: 20, height: 400 },
    { x: 0, y: 380, width: 600, height: 20 },
    
    // Inner walls
    { x: 100, y: 50, width: 200, height: 20 },
    { x: 350, y: 100, width: 20, height: 150 },
    { x: 200, y: 200, width: 150, height: 20 },
    { x: 450, y: 200, width: 20, height: 100 },
    { x: 300, y: 300, width: 200, height: 20 },
    { x: 150, y: 250, width: 20, height: 100 }
  ];

  useEffect(() => {
    if (showInstructions) return;
    
    setStartTime(Date.now());
    startGame();
  }, [showInstructions]);

  const startGame = () => {
    setGameState('playing');
    animate();
    
    // Start mindfulness meter regeneration
    speedTimer.current = window.setInterval(() => {
      setMindfulnessMeter(prev => Math.min(100, prev + 1));
    }, 100);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    const key = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
      e.preventDefault();
      
      const now = Date.now();
      const timeSinceLastMove = now - lastMoveTime.current;
      lastMoveTime.current = now;
      
      setKeysPressed(prev => new Set(prev).add(key));
      
      // Calculate movement speed based on how long key is held
      const moveDistance = keysPressed.has(key) ? 2 : 1; // Slower if key already pressed
      
      let newX = playerPos.x;
      let newY = playerPos.y;

      switch (key) {
        case 'arrowup':
        case 'w':
          newY -= moveDistance;
          break;
        case 'arrowdown':
        case 's':
          newY += moveDistance;
          break;
        case 'arrowleft':
        case 'a':
          newX -= moveDistance;
          break;
        case 'arrowright':
        case 'd':
          newX += moveDistance;
          break;
      }

      // Check for backtracking
      const distanceFromLast = Math.sqrt((newX - lastPosition.x) ** 2 + (newY - lastPosition.y) ** 2);
      if (distanceFromLast < 10) {
        setBacktrackCount(prev => prev + 1);
      }

      // Check wall collisions
      const canMove = !mazeWalls.some(wall => 
        newX < wall.x + wall.width &&
        newX + 20 > wall.x &&
        newY < wall.y + wall.height &&
        newY + 20 > wall.y
      );

      if (canMove && newX >= 20 && newX <= 560 && newY >= 20 && newY <= 360) {
        setPlayerPos({ x: newX, y: newY });
        setLastPosition(playerPos);
        
        // Decrease mindfulness meter when moving
        setMindfulnessMeter(prev => Math.max(0, prev - 0.5));
        
        // Check for meditation symbol collection
        meditationSymbols.forEach(symbol => {
          if (!symbol.collected) {
            const distance = Math.sqrt((newX - symbol.x) ** 2 + (newY - symbol.y) ** 2);
            if (distance < 30) {
              symbol.collected = true;
              setCollectedSymbols(prev => prev + 1);
              setMindfulnessMeter(prev => Math.min(100, prev + 20));
            }
          }
        });

        // Check if reached the end
        if (newX > 550 && newY < 50) {
          endGame();
        }
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const endGame = () => {
    setGameState('complete');
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (speedTimer.current) {
      clearInterval(speedTimer.current);
    }

    calculateFinalResults();
  };

  const calculateFinalResults = () => {
    const avgMovementSpeed = movementSpeed.length > 0 
      ? movementSpeed.reduce((sum, speed) => sum + speed, 0) / movementSpeed.length 
      : 0;
    
    // Calculate anxiety reduction based on performance
    let anxietyReduction = 0;
    if (backtrackCount <= 2 && mindfulnessMeter > 50) anxietyReduction = 3;
    else if (backtrackCount <= 5 && mindfulnessMeter > 30) anxietyReduction = 2;
    else if (backtrackCount <= 10) anxietyReduction = 1;
    
    setAnxietyAfter(Math.max(1, anxietyBefore - anxietyReduction));

    const session: GameSession = {
      gameType: 'mindful-maze' as GameType,
      duration: Math.round((Date.now() - startTime) / 1000 / 60), // minutes
      score: Math.round((collectedSymbols / meditationSymbols.length) * 100),
      anxietyBefore,
      anxietyAfter: anxietyBefore - anxietyReduction,
      timestamp: new Date().toISOString(),
      metrics: {
        reactionTime: movementSpeed,
        accuracy: Math.round((collectedSymbols / meditationSymbols.length) * 100),
        hesitationCount: backtrackCount,
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
    
    // Draw zen garden background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1F2937');
    gradient.addColorStop(1, '#111827');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze walls
    ctx.fillStyle = '#8B5CF6';
    mazeWalls.forEach(wall => {
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });

    // Draw meditation symbols
    meditationSymbols.forEach(symbol => {
      if (!symbol.collected) {
        ctx.beginPath();
        ctx.arc(symbol.x, symbol.y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#F59E0B';
        ctx.fill();
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw lotus symbol
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🪷', symbol.x, symbol.y + 5);
      }
    });

    // Draw player orb with mindfulness-based brightness
    const brightness = mindfulnessMeter / 100;
    ctx.beginPath();
    ctx.arc(playerPos.x + 10, playerPos.y + 10, 10, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(139, 92, 246, ${brightness})`;
    ctx.fill();
    ctx.strokeStyle = '#7C3AED';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw goal
    ctx.fillStyle = '#10B981';
    ctx.fillRect(570, 10, 20, 20);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏁', 580, 25);

    // Draw mindfulness meter
    ctx.fillStyle = '#374151';
    ctx.fillRect(20, 20, 200, 20);
    ctx.fillStyle = mindfulnessMeter > 50 ? '#10B981' : mindfulnessMeter > 20 ? '#F59E0B' : '#EF4444';
    ctx.fillRect(20, 20, (mindfulnessMeter / 100) * 200, 20);
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 200, 20);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Mindfulness: ${Math.round(mindfulnessMeter)}%`, 20, 50);

    // Draw collected symbols count
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Symbols: ${collectedSymbols}/${meditationSymbols.length}`, 20, 80);

    // Warning text if mindfulness is low
    if (mindfulnessMeter < 20) {
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Slow down - breathe', canvas.width / 2, canvas.height - 50);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      animate();
      
      // Add keyboard event listeners
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, playerPos, mindfulnessMeter]);

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
            🧘 Mindful Maze
          </h2>
          
          <div className="space-y-6">
            <div className="bg-orange-500/20 p-6 rounded-lg border border-orange-400/30">
              <h3 className="text-xl font-semibold mb-3 text-orange-200">How to Play:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Use arrow keys or WASD to navigate the glowing orb</li>
                <li>Move slowly and deliberately - rushing dims the orb</li>
                <li>Collect meditation symbols (🪷) along the way</li>
                <li>Reach the green finish line (🏁)</li>
                <li>Watch your mindfulness meter - keep it high!</li>
              </ol>
            </div>

            <div className="bg-green-500/20 p-6 rounded-lg border border-green-400/30">
              <h3 className="text-xl font-semibold mb-3 text-green-200">Therapeutic Benefit:</h3>
              <p className="text-gray-300">
                This game trains sustained attention and mindfulness. Moving slowly teaches patience and deliberate action, 
                while collecting symbols provides gentle goals. Perfect for practicing mindfulness meditation in an engaging way.
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
              <span className="text-lg font-bold text-orange-300">{anxietyBefore}</span>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-green-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Mindful Journey
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
          <h2 className="text-3xl font-bold mb-6 text-green-400">🎉 Mindful Journey Complete!</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-400/30">
              <div className="text-2xl font-bold text-orange-300">{collectedSymbols}/{meditationSymbols.length}</div>
              <div className="text-gray-300">Symbols Collected</div>
            </div>
            <div className="bg-green-500/20 p-4 rounded-lg border border-green-400/30">
              <div className="text-2xl font-bold text-green-300">{anxietyBefore - anxietyAfter}</div>
              <div className="text-gray-300">Anxiety Reduction</div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg mb-6 border border-gray-600/30">
            <h3 className="font-semibold mb-2 text-white">AI Analysis:</h3>
            {backtrackCount <= 2 ? (
              <p className="text-green-400">✅ Excellent mindfulness! You moved with patience and purpose throughout the journey.</p>
            ) : (
              <div className="text-left">
                <p className="text-orange-400 mb-2">📊 Mindfulness Insights:</p>
                <ul className="list-disc list-inside text-sm text-gray-300">
                  <li>You backtracked {backtrackCount} times - practice trusting your path</li>
                  <li>Try moving even slower to build patience</li>
                  <li>Focus on the journey, not just the destination</li>
                </ul>
              </div>
            )}
          </div>

          <p className="text-gray-300 mb-4">
            Wonderful! You've practiced mindfulness and patience. These skills help reduce anxiety and improve focus in daily life.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-lg text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
      >
        <ArrowLeft className="w-4 h-4 inline mr-2" />
        Back to Games
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Mindful Maze</h2>
          <p className="text-gray-300">Move slowly and deliberately. Collect symbols and reach the finish.</p>
        </div>
        
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border-2 border-white/20 rounded-xl shadow-lg mx-auto block"
          tabIndex={0}
          style={{ outline: 'none' }}
        />
        
        <div className="text-center mt-4 text-gray-300">
          <p>Use arrow keys or WASD to move. The orb dims if you move too quickly.</p>
          <p className="text-sm mt-2">Focus on mindfulness and patience</p>
        </div>
      </div>
    </div>
  );
};
