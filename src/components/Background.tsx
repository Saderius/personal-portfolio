import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, palette } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000 };
    let targetMouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const cellSize = 50;
    const glowRadius = 300;

    const isLight = theme === 'light';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)';
    
    const primaryColor = palette === 'green' ? '34, 197, 94' : '139, 92, 246';
    const secondaryColor = palette === 'green' ? '14, 165, 233' : '244, 114, 182';

    // Function to create a tracer on a grid line near the mouse
    const createTracer = () => {
      const isVertical = Math.random() > 0.5;
      // Pick a grid line near the target mouse
      const offset = (Math.floor(Math.random() * (glowRadius * 2 / cellSize)) * cellSize) - Math.floor(glowRadius / cellSize) * cellSize;
      
      return {
        isVertical,
        lineIndex: isVertical 
          ? Math.round(targetMouse.x / cellSize) * cellSize + offset 
          : Math.round(targetMouse.y / cellSize) * cellSize + offset,
        pos: isVertical 
          ? targetMouse.y + (Math.random() * glowRadius * 2 - glowRadius) 
          : targetMouse.x + (Math.random() * glowRadius * 2 - glowRadius),
        speed: (Math.random() * 6 + 3) * (Math.random() > 0.5 ? 1 : -1),
        length: Math.random() * 100 + 40,
        color: Math.random() > 0.5 ? primaryColor : secondaryColor
      };
    };

    // Pool of active tracers
    const tracers = Array.from({ length: 60 }).map(createTracer);

    const draw = () => {
      // Smooth mouse interpolation
      mouse.x += (targetMouse.x - mouse.x) * 0.15;
      mouse.y += (targetMouse.y - mouse.y) * 0.15;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Base Grid (very faint)
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      const nearestX = Math.round(mouse.x / cellSize) * cellSize;
      const nearestY = Math.round(mouse.y / cellSize) * cellSize;
      const cellX = Math.floor(mouse.x / cellSize) * cellSize;
      const cellY = Math.floor(mouse.y / cellSize) * cellSize;

      // 2. Illuminated Grid near mouse
      const gridGlowGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
      gridGlowGradient.addColorStop(0, `rgba(${primaryColor}, 0.4)`);
      gridGlowGradient.addColorStop(1, `rgba(${primaryColor}, 0)`);
      
      ctx.strokeStyle = gridGlowGradient;
      ctx.beginPath();
      
      const startX = Math.max(0, Math.floor((mouse.x - glowRadius) / cellSize) * cellSize);
      const endX = Math.min(canvas.width, Math.ceil((mouse.x + glowRadius) / cellSize) * cellSize);
      const startY = Math.max(0, Math.floor((mouse.y - glowRadius) / cellSize) * cellSize);
      const endY = Math.min(canvas.height, Math.ceil((mouse.y + glowRadius) / cellSize) * cellSize);

      for (let x = startX; x <= endX; x += cellSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
      }
      for (let y = startY; y <= endY; y += cellSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
      }
      ctx.stroke();

      // 3. Crosshair tracking lines (full width/height on nearest grid axis)
      ctx.strokeStyle = `rgba(${secondaryColor}, 0.15)`;
      ctx.beginPath();
      ctx.moveTo(nearestX, 0); ctx.lineTo(nearestX, canvas.height);
      ctx.moveTo(0, nearestY); ctx.lineTo(canvas.width, nearestY);
      ctx.stroke();

      // 4. Tracking Box (snaps to the nearest cell)
      ctx.strokeStyle = `rgba(${primaryColor}, 0.8)`;
      ctx.lineWidth = 2;
      const cornerSize = 8;
      
      // Top Left
      ctx.beginPath(); ctx.moveTo(cellX, cellY + cornerSize); ctx.lineTo(cellX, cellY); ctx.lineTo(cellX + cornerSize, cellY); ctx.stroke();
      // Top Right
      ctx.beginPath(); ctx.moveTo(cellX + cellSize - cornerSize, cellY); ctx.lineTo(cellX + cellSize, cellY); ctx.lineTo(cellX + cellSize, cellY + cornerSize); ctx.stroke();
      // Bottom Left
      ctx.beginPath(); ctx.moveTo(cellX, cellY + cellSize - cornerSize); ctx.lineTo(cellX, cellY + cellSize); ctx.lineTo(cellX + cornerSize, cellY + cellSize); ctx.stroke();
      // Bottom Right
      ctx.beginPath(); ctx.moveTo(cellX + cellSize - cornerSize, cellY + cellSize); ctx.lineTo(cellX + cellSize, cellY + cellSize); ctx.lineTo(cellX + cellSize, cellY + cellSize - cornerSize); ctx.stroke();

      // 5. Grid Nodes (intersections light up near mouse)
      ctx.fillStyle = `rgba(${secondaryColor}, 0.6)`;
      for (let x = startX; x <= endX; x += cellSize) {
        for (let y = startY; y <= endY; y += cellSize) {
          const dist = Math.hypot(x - mouse.x, y - mouse.y);
          if (dist < glowRadius) {
            const size = 1.5 * (1 - dist / glowRadius);
            ctx.fillRect(x - size, y - size, size * 2, size * 2);
          }
        }
      }

      // 6. Grid Tracers (Data streams strictly on grid lines)
      tracers.forEach(tracer => {
        tracer.pos += tracer.speed;
        
        const x = tracer.isVertical ? tracer.lineIndex : tracer.pos;
        const y = tracer.isVertical ? tracer.pos : tracer.lineIndex;

        const distToMouse = Math.hypot(
          Math.max(x, Math.min(mouse.x, x + (tracer.isVertical ? 0 : tracer.length))) - mouse.x,
          Math.max(y, Math.min(mouse.y, y + (tracer.isVertical ? tracer.length : 0))) - mouse.y
        );

        // If tracer leaves the glow radius, respawn it near the mouse
        if (distToMouse > glowRadius * 1.2) {
          Object.assign(tracer, createTracer());
        } else {
          const opacity = Math.max(0, 1 - (distToMouse / glowRadius));
          
          const gradient = ctx.createLinearGradient(
            x, y, 
            tracer.isVertical ? x : x + tracer.length, 
            tracer.isVertical ? y + tracer.length : y
          );
          gradient.addColorStop(0, `rgba(${tracer.color}, 0)`);
          gradient.addColorStop(0.5, `rgba(${tracer.color}, ${opacity})`);
          gradient.addColorStop(1, `rgba(${tracer.color}, 0)`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            tracer.isVertical ? x : x + tracer.length,
            tracer.isVertical ? y + tracer.length : y
          );
          ctx.stroke();
        }
      });

      // 7. Ambient Mouse Glow
      const ambientGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
      ambientGlow.addColorStop(0, `rgba(${primaryColor}, 0.08)`);
      ambientGlow.addColorStop(1, `rgba(${primaryColor}, 0)`);
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(mouse.x - glowRadius, mouse.y - glowRadius, glowRadius * 2, glowRadius * 2);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, palette]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] bg-background transition-colors duration-300"
      style={{ pointerEvents: 'none' }}
    />
  );
}
