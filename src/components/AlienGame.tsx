import React, { useState, useEffect, useRef } from 'react';
import { Ghost, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from './ui/Button';

interface AlienGameProps {
  onGameStart: () => void;
  onGameEnd: () => void;
}

const CELL_SIZE = 50;

export function AlienGame({ onGameStart, onGameEnd }: AlienGameProps) {
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'waiting' | 'active' | 'finished'>('idle');
  const [countdownValue, setCountdownValue] = useState(3);
  const [reactionTimes, setReactionTimes] = useState<{ time: number; score: number }[]>([]);
  const [alienPos, setAlienPos] = useState({ x: 0, y: 0 });
  const [gameGrid, setGameGrid] = useState({ left: 0, top: 0, width: 0, height: 0, cols: 0, rows: 0 });
  const [spawnSequence, setSpawnSequence] = useState<{x: number, y: number}[]>([]);
  const [spawnIndex, setSpawnIndex] = useState(0);
  const [isListOpen, setIsListOpen] = useState(false);
  
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef({ x: 0, y: 0 });

  const updateGrid = () => {
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    
    const availableWidth = clientWidth - 40; // 20px padding on sides
    const availableHeight = clientHeight - 250; // Leave space for header/UI and roulette
    
    const cols = Math.max(1, Math.min(10, Math.floor(availableWidth / CELL_SIZE)));
    const rows = Math.max(1, Math.min(10, Math.floor(availableHeight / CELL_SIZE)));

    const grid = { left: 0, top: 0, width: cols * CELL_SIZE, height: rows * CELL_SIZE, cols, rows };
    setGameGrid(grid);
    return grid;
  };

  const alignGridToBackground = () => {
    if (!gameContainerRef.current || !boundsRef.current) return;
    
    const boundsRect = boundsRef.current.getBoundingClientRect();
    
    // Calculate the base layout position by subtracting the current transform
    const baseLeft = boundsRect.left - transformRef.current.x;
    const baseTop = boundsRect.top - transformRef.current.y;
    
    // Snap to the nearest 50px (CELL_SIZE) to match the background grid perfectly
    const snappedLeft = Math.round(baseLeft / CELL_SIZE) * CELL_SIZE;
    const snappedTop = Math.round(baseTop / CELL_SIZE) * CELL_SIZE;
    
    const translateX = snappedLeft - baseLeft;
    const translateY = snappedTop - baseTop;
    
    // Only update DOM if it changed to avoid unnecessary repaints
    if (translateX !== transformRef.current.x || translateY !== transformRef.current.y) {
      transformRef.current = { x: translateX, y: translateY };
      boundsRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
  };

  useEffect(() => {
    alignGridToBackground();
  }, [gameGrid.width, gameGrid.height]);

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (gameState !== 'idle') {
        alignGridToBackground();
      }
    };
    
    // Use passive listeners for better scrolling performance
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    
    // Initial alignment
    handleScrollOrResize();
    
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [gameState, gameGrid.width, gameGrid.height]);

  const startGame = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    const grid = updateGrid();

    // Pre-calculate 5 random spawn locations within the grid
    const spawns = [];
    for(let i=0; i<5; i++) {
      const col = Math.floor(Math.random() * grid.cols);
      const row = Math.floor(Math.random() * grid.rows);
      spawns.push({
        x: col * CELL_SIZE + CELL_SIZE / 2,
        y: row * CELL_SIZE + CELL_SIZE / 2
      });
    }
    
    setSpawnSequence(spawns);
    setSpawnIndex(0);
    setReactionTimes([]);
    setIsListOpen(false);
    onGameStart();
    
    setGameState('countdown');
    setCountdownValue(3);
  };

  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdownValue > 0) {
        const timer = setTimeout(() => setCountdownValue(countdownValue - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameState('waiting');
        scheduleNextSpawn(0, spawnSequence, true);
      }
    }
  }, [gameState, countdownValue, spawnSequence]);

  useEffect(() => {
    if (gameState === 'countdown' && gameContainerRef.current) {
      setTimeout(() => {
        gameContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [gameState]);

  const scheduleNextSpawn = (index: number, spawns: {x:number, y:number}[], isFirst: boolean = false) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    const delay = isFirst 
      ? 500 + Math.random() * 1500 // 0.5s to 2s
      : 200 + Math.random() * 300; // 200ms to 500ms
    
    timeoutRef.current = setTimeout(() => {
      setAlienPos(spawns[index]);
      setSpawnIndex(index);
      setGameState('active');
    }, delay);
  };

  // Use double requestAnimationFrame to record the exact time the browser paints the ghost
  useEffect(() => {
    if (gameState === 'active') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          startTimeRef.current = Date.now();
        });
      });
    }
  }, [gameState]);

  const handleAlienClick = (e: React.MouseEvent) => {
    if (gameState === 'idle') {
      startGame();
      return;
    }

    if (gameState === 'active') {
      const rt = Date.now() - startTimeRef.current;
      let score = 0;
      if (rt <= 200) score = 100;
      else if (rt <= 300) score = 100 - ((rt - 200) / 100) * 50;
      else if (rt <= 500) score = 50 - ((rt - 300) / 200) * 50;
      else score = 0;
      
      score = Math.round(score);

      const newTimes = [...reactionTimes, { time: rt, score }];
      setReactionTimes(newTimes);

      if (newTimes.length >= 5) {
        setGameState('finished');
        setIsListOpen(true); // Auto-open results when finished
      } else {
        setGameState('waiting');
        scheduleNextSpawn(spawnIndex + 1, spawnSequence, false);
      }
    }
  };

  const resetGame = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setGameState('idle');
    setReactionTimes([]);
    setIsListOpen(false);
    onGameEnd();
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (gameState !== 'idle') {
        updateGrid();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gameState]);

  const totalScore = reactionTimes.reduce((acc, curr) => acc + curr.score, 0);
  
  let scoreMessage = "";
  if (gameState === 'finished') {
    if (totalScore < 100) scoreMessage = "Not Hard Enough!";
    else if (totalScore < 150) scoreMessage = "Try Harder!";
    else scoreMessage = "You beat my score! Amazing!";
  }

  return (
    <>
      {gameState === 'idle' && (
        <div className="flex flex-col items-center justify-center mt-8 cursor-pointer group" onClick={handleAlienClick}>
          <div className="glass p-4 rounded-full group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300 animate-bounce">
            <Ghost className="w-8 h-8 text-primary" />
          </div>
          <div className="flex flex-col items-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-bold text-primary">Click to play</span>
            <span className="text-xs text-text-muted mt-1">Saderius's Best: 150</span>
          </div>
        </div>
      )}

      {gameState !== 'idle' && (
        <div ref={gameContainerRef} className="relative w-full flex flex-col items-center justify-center my-8">
          
          {/* Scoreboard - Placed above the game bounds */}
          <div className="relative w-full max-w-md z-50 mb-6 mx-auto">
            {/* Header */}
            <div className="glass rounded-3xl shadow-2xl border-primary/20 overflow-hidden transition-all duration-500 flex flex-col">
              <div 
                className="p-4 flex items-center justify-between bg-surface-hover/50 cursor-pointer hover:bg-surface-hover transition-colors"
                onClick={() => setIsListOpen(!isListOpen)}
              >
                <div className="flex items-center gap-3">
                  <Ghost className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-display font-bold text-text-main leading-none mb-1">
                      {gameState === 'finished' ? 'Results' : `Target ${reactionTimes.length + 1} / 5`}
                    </h3>
                    {gameState === 'countdown' && <span className="text-xs text-primary animate-pulse">Starting in {countdownValue}...</span>}
                    {gameState === 'waiting' && <span className="text-xs text-text-muted animate-pulse">Get ready...</span>}
                    {gameState === 'active' && <span className="text-xs text-primary animate-pulse">Click it!</span>}
                    {gameState === 'finished' && <span className="text-xs text-primary">Test Complete</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {gameState !== 'finished' && reactionTimes.length > 0 && !isListOpen && (
                    <div className="text-right flex flex-col items-end mr-2">
                      <span className="text-[10px] uppercase tracking-wider text-text-muted">Last</span>
                      <span className="text-sm font-mono text-primary font-bold">{reactionTimes[reactionTimes.length - 1].time}ms</span>
                    </div>
                  )}
                  <div className="text-text-muted">
                    {isListOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                  
                  {/* Close Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); resetGame(); }}
                    className="p-1.5 hover:bg-surface-border rounded-full text-text-muted hover:text-text-main transition-colors ml-1"
                    title="Close Game"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded List (Absolute to overlap game view) */}
            <div 
              className={`absolute top-full left-0 right-0 mt-2 glass rounded-3xl border border-primary/20 shadow-2xl transition-all duration-500 ease-in-out origin-top overflow-hidden ${isListOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 !border-transparent'}`}
            >
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {reactionTimes.map((rt, i) => (
                    <div key={i} className="flex justify-between items-center text-sm bg-surface-hover p-2 rounded-lg">
                      <span className="text-text-muted font-medium">Target {i + 1}</span>
                      <div className="text-right flex items-center gap-3">
                        <span className="text-text-main font-mono">{rt.time}ms</span>
                        <span className="text-primary font-bold w-12 text-right">{rt.score}</span>
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: 5 - reactionTimes.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex justify-between items-center text-sm opacity-30 p-2">
                      <span className="text-text-muted font-medium">Target {reactionTimes.length + i + 1}</span>
                      <span className="text-text-main font-mono">---</span>
                    </div>
                  ))}
                </div>
                
                {gameState === 'finished' && (
                  <div className="pt-4 border-t border-surface-border">
                    <div className="text-center mb-6">
                      <span className="text-3xl font-display font-bold text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)] block mb-2">
                        {scoreMessage}
                      </span>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-text-muted">Your Score:</span>
                        <span className="font-bold text-text-main">{totalScore}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs mt-1">
                        <span className="text-text-muted">Saderius's Best:</span>
                        <span className="font-bold text-primary">150</span>
                      </div>
                    </div>
                    <Button onClick={resetGame} className="w-full">Close Game</Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Illuminated Bounds Area */}
          <div 
            ref={boundsRef}
            className="relative pointer-events-none border border-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)] z-0"
            style={{
              width: gameGrid.width,
              height: gameGrid.height,
            }}
          >
            {/* Countdown Overlay */}
            {gameState === 'countdown' && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <span className="text-6xl font-display font-bold text-primary animate-ping">
                  {countdownValue > 0 ? countdownValue : 'GO!'}
                </span>
              </div>
            )}

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary"></div>

            {/* Alien (Ghost) */}
            {gameState === 'active' && (
              <div 
                className="absolute z-20 cursor-crosshair transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{ left: alienPos.x, top: alienPos.y }}
                onMouseDown={handleAlienClick}
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
                  <div className="glass p-2 rounded-full bg-surface-hover border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] hover:scale-110 transition-transform">
                    <Ghost className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
