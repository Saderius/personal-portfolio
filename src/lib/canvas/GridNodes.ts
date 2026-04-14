export class GridNodes {
  nodes: Map<string, number> = new Map();
  cellSize: number = 50;

  updateAndDraw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, mouseX: number, mouseY: number, glowRadius: number, color: string) {
    // 1. Add/Update nodes near mouse
    const startX = Math.max(0, Math.floor((mouseX - glowRadius) / this.cellSize) * this.cellSize);
    const endX = Math.min(canvasWidth, Math.ceil((mouseX + glowRadius) / this.cellSize) * this.cellSize);
    const startY = Math.max(0, Math.floor((mouseY - glowRadius) / this.cellSize) * this.cellSize);
    const endY = Math.min(canvasHeight, Math.ceil((mouseY + glowRadius) / this.cellSize) * this.cellSize);

    for (let x = startX; x <= endX; x += this.cellSize) {
      for (let y = startY; y <= endY; y += this.cellSize) {
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
