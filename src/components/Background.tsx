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
    let offsetX = 0;
    let offsetY = 0;
    const cellSize = 50;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const clientWidth = document.documentElement.clientWidth;
      const clientHeight = window.innerHeight;
      const centerX = clientWidth / 2;
      const centerY = clientHeight / 2;
      
      offsetX = (centerX % cellSize) - (cellSize / 2);
      offsetY = (centerY % cellSize) - (cellSize / 2);
    };
    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const glowRadius = 300;
    
    // Read dynamic colors from the palette object directly
    const primaryColor = palette.primaryRgb;
    const secondaryColor = palette.secondaryRgb;

    // Pool of active tracers (reduced count for better performance)
    let tracers = Array.from({ length: 75 }).map(() => new Tracer(canvas.width, canvas.height, primaryColor, secondaryColor));
    
    const gridNodes = new GridNodes();
    let ripples: {x: number, y: number, scale: number, opacity: number}[] = [];

    const onMouseClick = (e: MouseEvent) => {
      const cellX = Math.floor((e.clientX - offsetX) / cellSize) * cellSize + offsetX;
      const cellY = Math.floor((e.clientY - offsetY) / cellSize) * cellSize + offsetY;
      
      ripples.push({ x: cellX, y: cellY, scale: 1, opacity: 1 });
    };
    window.addEventListener('mousedown', onMouseClick);

    const onGhostHitFloor = () => {
      if (!canvas) return;
      let centerX = canvas.width / 2;
      let centerY = canvas.height / 2;
      
      const ghostEl = document.getElementById('ghost-icon');
      if (ghostEl) {
        const rect = ghostEl.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      }
      
      // Optional: add a subtle ripple
      const cellX = Math.floor((centerX - offsetX) / cellSize) * cellSize + offsetX;
      const cellY = Math.floor((centerY - offsetY) / cellSize) * cellSize + offsetY;
      ripples.push({ x: cellX, y: cellY, scale: 1, opacity: 0.4 });

      // Emit burst lines under the ghost
      const numBurst = Math.floor(Math.random() * 5) + 3; // 3 to 7
      for (let i = 0; i < numBurst; i++) {
        tracers.push(new Tracer(canvas.width, canvas.height, primaryColor, secondaryColor, true, centerX, centerY));
      }
    };
    window.addEventListener('ghost-hit-floor', onGhostHitFloor);

    let lastTime: number | null = null;

    const draw = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.1); // clamp delta time to 100ms max to prevent jumps
      lastTime = time;

      // Smooth mouse interpolation (speed adjusted for dt)
      mouse.x += (targetMouse.x - mouse.x) * 10 * dt;
      mouse.y += (targetMouse.y - mouse.y) * 10 * dt;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Determine if light mode is active by checking the document class
      const isLight = document.documentElement.classList.contains('light');
      const gridColorRgb = isLight ? '0, 0, 0' : '255, 255, 255';

      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      let currentOffsetX = (offsetX - scrollX) % cellSize;
      if (currentOffsetX > 0) currentOffsetX -= cellSize;
      
      let currentOffsetY = (offsetY - scrollY) % cellSize;
      if (currentOffsetY > 0) currentOffsetY -= cellSize;

      // 1. Base Grid (fades out towards edges for a clean, centered look)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const fadeRadius = Math.max(canvas.width, canvas.height) * 0.6;
      
      const baseGridGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, fadeRadius);
      baseGridGradient.addColorStop(0, `rgba(${gridColorRgb}, 0.06)`);
      baseGridGradient.addColorStop(1, `rgba(${gridColorRgb}, 0)`);

      ctx.strokeStyle = baseGridGradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = currentOffsetX; x <= canvas.width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = currentOffsetY; y <= canvas.height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      const nearestX = Math.round((mouse.x - currentOffsetX) / cellSize) * cellSize + currentOffsetX;
      const nearestY = Math.round((mouse.y - currentOffsetY) / cellSize) * cellSize + currentOffsetY;
      const cellX = Math.floor((mouse.x - currentOffsetX) / cellSize) * cellSize + currentOffsetX;
      const cellY = Math.floor((mouse.y - currentOffsetY) / cellSize) * cellSize + currentOffsetY;

      // 2. Illuminated Grid near mouse
      const gridGlowGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
      gridGlowGradient.addColorStop(0, `rgba(${primaryColor}, 0.4)`);
      gridGlowGradient.addColorStop(1, `rgba(${primaryColor}, 0)`);
      
      ctx.strokeStyle = gridGlowGradient;
      ctx.beginPath();
      
      const startX = Math.floor((mouse.x - glowRadius - currentOffsetX) / cellSize) * cellSize + currentOffsetX;
      const endX = Math.ceil((mouse.x + glowRadius - currentOffsetX) / cellSize) * cellSize + currentOffsetX;
      const startY = Math.floor((mouse.y - glowRadius - currentOffsetY) / cellSize) * cellSize + currentOffsetY;
      const endY = Math.ceil((mouse.y + glowRadius - currentOffsetY) / cellSize) * cellSize + currentOffsetY;

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
      gridNodes.updateAndDraw(ctx, canvas.width, canvas.height, mouse.x, mouse.y, glowRadius, secondaryColor, currentOffsetX, currentOffsetY);

      // 6. Grid Tracers (Data streams decoupled from mouse, fade in fast, fade out slowly)
      tracers = tracers.filter(tracer => 
        tracer.update(ctx, canvas.width, canvas.height, mouse.x, mouse.y, glowRadius, primaryColor, secondaryColor, currentOffsetX, currentOffsetY, dt)
      );

      // 7. Ambient Mouse Glow
      const ambientGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
      ambientGlow.addColorStop(0, `rgba(${primaryColor}, 0.08)`);
      ambientGlow.addColorStop(1, `rgba(${primaryColor}, 0)`);
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(mouse.x - glowRadius, mouse.y - glowRadius, glowRadius * 2, glowRadius * 2);

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame((time) => { lastTime = time; draw(time); });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseClick);
      window.removeEventListener('ghost-hit-floor', onGhostHitFloor);
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
