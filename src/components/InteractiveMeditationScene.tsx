import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Dot {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  homeX: number;
  homeY: number;
  active: boolean;
}

export default function InteractiveMeditationScene() {
  const { theme } = useTheme();
  const [dots, setDots] = useState<Dot[]>([]);
  const [isForming, setIsForming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Meditation silhouette coordinates
  const getMeditationShape = (): { x: number; y: number }[] => {
    const centerX = 50;
    const centerY = 50;
    const points: { x: number; y: number }[] = [];
    
    // Head
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      points.push({
        x: centerX + 8 * Math.cos(angle),
        y: centerY - 35 + 8 * Math.sin(angle)
      });
    }
    
    // Body
    points.push({ x: centerX, y: centerY - 20 });
    points.push({ x: centerX, y: centerY - 10 });
    points.push({ x: centerX, y: centerY });
    points.push({ x: centerX, y: centerY + 8 });
    points.push({ x: centerX, y: centerY + 15 });
    
    // Left arm
    points.push({ x: centerX - 6, y: centerY - 15 });
    points.push({ x: centerX - 9, y: centerY - 8 });
    points.push({ x: centerX - 10, y: centerY });
    
    // Right arm
    points.push({ x: centerX + 6, y: centerY - 15 });
    points.push({ x: centerX + 9, y: centerY - 8 });
    points.push({ x: centerX + 10, y: centerY });
    
    // Legs
    points.push({ x: centerX - 5, y: centerY + 18 });
    points.push({ x: centerX - 8, y: centerY + 22 });
    points.push({ x: centerX + 5, y: centerY + 20 });
    
    return points;
  };

  // Initialize dots
  useEffect(() => {
    if (!containerRef.current) return;

    const newDots: Dot[] = [];
    const cols = 20;
    const rows = 15;
    const containerWidth = window.innerWidth;
    const containerHeight = containerRef.current.offsetHeight || window.innerHeight;
    const spacingX = containerWidth / cols;
    const spacingY = containerHeight / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacingX;
        const y = row * spacingY;
        newDots.push({
          x,
          y,
          targetX: x,
          targetY: y,
          homeX: x,
          homeY: y,
          active: false,
        });
      }
    }

    setDots(newDots);
  }, []);

  // Animate dots
  useEffect(() => {
    if (!animationFrameRef.current) {
      const animate = () => {
        setDots((prevDots) =>
          prevDots.map((dot) => {
            const dx = dot.targetX - dot.x;
            const dy = dot.targetY - dot.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 1) {
              return dot;
            }

            return {
              ...dot,
              x: dot.x + dx * 0.15,
              y: dot.y + dy * 0.15,
            };
          })
        );

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [isForming]);

  const handleMouseEnter = () => {
    console.log('Hover detected!');
    setIsForming(true);
    
    const shapePoints = getMeditationShape();
    setDots((prevDots) => {
      return prevDots.map((dot) => {
        let minDist = Infinity;
        let nearestPoint = shapePoints[0];

        for (const point of shapePoints) {
          // Convert dot's home position to percentage
          const dotXPercent = (dot.homeX / window.innerWidth) * 100;
          const dotYPercent = (dot.homeY / window.innerHeight) * 100;
          
          const dist = Math.sqrt(
            Math.pow(dotXPercent - point.x, 2) + 
            Math.pow(dotYPercent - point.y, 2)
          );
          if (dist < minDist) {
            minDist = dist;
            nearestPoint = point;
          }
        }

        return {
          ...dot,
          targetX: (nearestPoint.x / 100) * window.innerWidth,
          targetY: (nearestPoint.y / 100) * window.innerHeight,
          active: minDist < 15,
        };
      });
    });
  };

  const handleMouseLeave = () => {
    setIsForming(false);
    setDots((prevDots) =>
      prevDots.map((dot) => ({
        ...dot,
        targetX: dot.homeX,
        targetY: dot.homeY,
        active: false,
      }))
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed inset-0"
        style={{ 
        zIndex: 10,
        pointerEvents: 'auto'
      }}
    >
      {/* Instructions text */}
      <div className="absolute top-20 left-6 text-white/80 text-sm pointer-events-none">
        ✨ Hover anywhere to see the meditation pose
      </div>
      {dots.map((dot, index) => (
        <div
          key={index}
          className={`absolute rounded-full transition-all duration-500 pointer-events-none ${
            theme === 'dark'
              ? dot.active ? 'bg-white' : 'bg-white/30'
              : dot.active ? 'bg-white' : 'bg-white/40'
          }`}
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
            width: dot.active ? '10px' : '6px',
            height: dot.active ? '10px' : '6px',
            transform: 'translate(-50%, -50%)',
            boxShadow: dot.active 
              ? '0 0 20px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.5)' 
              : '0 0 5px rgba(255,255,255,0.5)',
          }}
        />
      ))}
      
      {isForming && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center pointer-events-none z-50">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full border-3 border-white/60 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
            </div>
          </div>
          <p className="text-3xl font-light mb-3">Breathe • Focus • Heal</p>
          <p className="text-base opacity-80">Your mental wellness journey starts here</p>
          
          {/* Floating particles */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2">
            <div className="w-3 h-3 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }} />
          </div>
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 translate-x-10">
            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2s' }} />
          </div>
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 -translate-x-10">
            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2s' }} />
          </div>
        </div>
      )}
    </div>
  );
}
