import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { Tracer } from '../lib/canvas/Tracer';
import { GridNodes } from '../lib/canvas/GridNodes';

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
    
    let primaryColor = '139, 92, 246'; // default
    let secondaryColor = '244, 114, 182'; // default
    
    if (palette === 'green') {
      primaryColor = '34, 197, 94';
      secondaryColor = '14, 165, 233';
    } else if (palette === 'dark-blue') {
      primaryColor = '251, 191, 36';
      secondaryColor = '59, 130, 246';
    } else if (palette === 'grey') {
      primaryColor = '156, 163, 175';
      secondaryColor = '107, 114, 128';
    }

    // Pool of active tracers (increased count since they are now global)
    let tracers = Array.from({ length: 150 }).map(() => new Tracer(canvas.width, canvas.height, primaryColor, secondaryColor));
    const gridNodes = new GridNodes();
    let ripples: {x: number, y: number, scale: number, opacity: number}[] = [];

    const onMouseClick = (e: MouseEvent) => {
      const cellX = Math.floor(e.clientX / cellSize) * cellSize;
      const cellY = Math.floor(e.clientY / cellSize) * cellSize;
      
      ripples.push({ x: cellX, y: cellY, scale: 1, opacity: 1 });

      const numBurst = Math.floor(Math.random() * 5) + 3; // 3 to 7
      for (let i = 0; i < numBurst; i++) {
        tracers.push(new Tracer(canvas.width, canvas.height, primaryColor, secondaryColor, true, e.clientX, e.clientY));
      }
    };
    window.addEventListener('mousedown', onMouseClick);

    const draw = () => {
      // Smooth mouse interpolation
      mouse.x += (targetMouse.x - mouse.x) * 0.15;
      mouse.y += (targetMouse.y - mouse.y) * 0.15;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const offsetX = 0;
      const offsetY = 0;

      // 1. Base Grid (very faint)
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = offsetX; x <= canvas.width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = offsetY; y <= canvas.height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      const nearestX = Math.round((mouse.x - offsetX) / cellSize) * cellSize + offsetX;
      const nearestY = Math.round((mouse.y - offsetY) / cellSize) * cellSize + offsetY;
      const cellX = Math.floor((mouse.x - offsetX) / cellSize) * cellSize + offsetX;
      const cellY = Math.floor((mouse.y - offsetY) / cellSize) * cellSize + offsetY;

      // 2. Illuminated Grid near mouse
      const gridGlowGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
      gridGlowGradient.addColorStop(0, `rgba(${primaryColor}, 0.4)`);
      gridGlowGradient.addColorStop(1, `rgba(${primaryColor}, 0)`);
      
      ctx.strokeStyle = gridGlowGradient;
      ctx.beginPath();
      
      const startX = Math.floor((mouse.x - glowRadius - offsetX) / cellSize) * cellSize + offsetX;
      const endX = Math.ceil((mouse.x + glowRadius - offsetX) / cellSize) * cellSize + offsetX;
      const startY = Math.floor((mouse.y - glowRadius - offsetY) / cellSize) * cellSize + offsetY;
      const endY = Math.ceil((mouse.y + glowRadius - offsetY) / cellSize) * cellSize + offsetY;

      for (let x = startX; x <= endX; x += cellSize) {
        if (x >= 0 && x <= canvas.width) {
          ctx.moveTo(x, Math.max(0, startY));
          ctx.lineTo(x, Math.min(canvas.height, endY));
        }
      }
      for (let y = startY; y <= endY; y += cellSize) {
        if (y >= 0 && y <= canvas.height) {
          ctx.moveTo(Math.max(0, startX), y);
          ctx.lineTo(Math.min(canvas.width, endX), y);
        }
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

      // Draw Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.scale += 0.05;
        r.opacity -= 0.03;
        
        if (r.opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(${primaryColor}, ${r.opacity})`;
        ctx.lineWidth = 2;
        
        const size = cellSize * r.scale;
        const offset = (size - cellSize) / 2;
        const rx = r.x - offset;
        const ry = r.y - offset;
        const rCornerSize = 8 * r.scale;

        ctx.beginPath(); ctx.moveTo(rx, ry + rCornerSize); ctx.lineTo(rx, ry); ctx.lineTo(rx + rCornerSize, ry); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + size - rCornerSize, ry); ctx.lineTo(rx + size, ry); ctx.lineTo(rx + size, ry + rCornerSize); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx, ry + size - rCornerSize); ctx.lineTo(rx, ry + size); ctx.lineTo(rx + rCornerSize, ry + size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx + size - rCornerSize, ry + size); ctx.lineTo(rx + size, ry + size); ctx.lineTo(rx + size, ry + size - rCornerSize); ctx.stroke();
      }

      // 5. Grid Nodes (intersections light up near mouse and fade out slowly)
      gridNodes.updateAndDraw(ctx, canvas.width, canvas.height, mouse.x, mouse.y, glowRadius, secondaryColor);

      // 6. Grid Tracers (Data streams decoupled from mouse, fade in fast, fade out slowly)
      tracers = tracers.filter(tracer => 
        tracer.update(ctx, canvas.width, canvas.height, mouse.x, mouse.y, glowRadius, primaryColor, secondaryColor)
      );

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
      window.removeEventListener('mousedown', onMouseClick);
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
