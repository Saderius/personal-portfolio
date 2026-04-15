export class GridNodes {
  nodes: Map<string, number> = new Map();
  cellSize: number = 50;

  updateAndDraw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, mouseX: number, mouseY: number, glowRadius: number, color: string, offsetX: number = 0, offsetY: number = 0) {
    // 1. Add/Update nodes near mouse
    const startX = Math.floor((mouseX - glowRadius - offsetX) / this.cellSize) * this.cellSize + offsetX;
    const endX = Math.ceil((mouseX + glowRadius - offsetX) / this.cellSize) * this.cellSize + offsetX;
    const startY = Math.floor((mouseY - glowRadius - offsetY) / this.cellSize) * this.cellSize + offsetY;
    const endY = Math.ceil((mouseY + glowRadius - offsetY) / this.cellSize) * this.cellSize + offsetY;

    for (let x = startX; x <= endX; x += this.cellSize) {
      for (let y = startY; y <= endY; y += this.cellSize) {
        if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) continue;
        
        const dist = Math.hypot(x - mouseX, y - mouseY);
        if (dist < glowRadius) {
          const targetOpacity = 1 - (dist / glowRadius);
          const key = `${x},${y}`;
          const currentOpacity = this.nodes.get(key) || 0;
          
          // Fast fade in
          if (currentOpacity < targetOpacity) {
            this.nodes.set(key, Math.min(1, currentOpacity + 0.15));
          }
        }
      }
    }

    // 2. Draw and decay all nodes
    ctx.fillStyle = `rgba(${color}, 1)`;
    
    for (const [key, opacity] of this.nodes.entries()) {
      if (opacity <= 0.005) {
        this.nodes.delete(key);
        continue;
      }

      const [xStr, yStr] = key.split(',');
      const x = parseFloat(xStr);
      const y = parseFloat(yStr);

      // Draw
      const size = 1.5 * opacity;
      ctx.globalAlpha = opacity * 0.6;
      ctx.fillRect(x - size, y - size, size * 2, size * 2);

      // Decay (slow fade out)
      this.nodes.set(key, opacity - 0.005);
    }
    ctx.globalAlpha = 1.0; // Reset
  }
}
