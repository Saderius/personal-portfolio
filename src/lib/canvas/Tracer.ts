export class Tracer {
  isVertical: boolean = false;
  lineIndex: number = 0;
  pos: number = 0;
  speed: number = 0;
  length: number = 0;
  color: string = '';
  opacity: number = 0;
  targetOpacity: number = 0;
  dieOnExit: boolean = false;

  constructor(canvasWidth: number, canvasHeight: number, primaryColor: string, secondaryColor: string, isBurst: boolean = false, mouseX?: number, mouseY?: number) {
    this.dieOnExit = isBurst;
    this.respawn(canvasWidth, canvasHeight, primaryColor, secondaryColor, true, isBurst, mouseX, mouseY);
  }

  respawn(canvasWidth: number, canvasHeight: number, primaryColor: string, secondaryColor: string, initial: boolean = false, isBurst: boolean = false, mouseX?: number, mouseY?: number) {
    const cellSize = 50;
    this.isVertical = Math.random() > 0.5;
    
    if (isBurst && mouseX !== undefined && mouseY !== undefined) {
      if (this.isVertical) {
        this.lineIndex = Math.floor(mouseX / cellSize) * cellSize + (Math.random() > 0.5 ? cellSize : 0);
        this.pos = mouseY;
      } else {
        this.lineIndex = Math.floor(mouseY / cellSize) * cellSize + (Math.random() > 0.5 ? cellSize : 0);
        this.pos = mouseX;
      }
      // Even faster for burst lines
      this.speed = (Math.random() * 15 + 10) * (Math.random() > 0.5 ? 1 : -1);
      this.opacity = 1;
      this.targetOpacity = 1;
    } else {
      if (this.isVertical) {
        this.lineIndex = Math.floor(Math.random() * (canvasWidth / cellSize)) * cellSize;
        this.pos = initial ? Math.random() * canvasHeight : (Math.random() > 0.5 ? -100 : canvasHeight + 100);
      } else {
        this.lineIndex = Math.floor(Math.random() * (canvasHeight / cellSize)) * cellSize;
        this.pos = initial ? Math.random() * canvasWidth : (Math.random() > 0.5 ? -100 : canvasWidth + 100);
      }
      
      // 2x faster normal lines
      if (!initial) {
         this.speed = this.pos < 0 ? (Math.random() * 8 + 4) : -(Math.random() * 8 + 4);
      } else {
         this.speed = (Math.random() * 8 + 4) * (Math.random() > 0.5 ? 1 : -1);
      }
      this.opacity = 0;
      this.targetOpacity = 0;
    }

    this.length = Math.random() * 100 + 40;
    this.color = Math.random() > 0.5 ? primaryColor : secondaryColor;
  }

  update(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, mouseX: number, mouseY: number, glowRadius: number, primaryColor: string, secondaryColor: string, offsetX: number = 0, offsetY: number = 0): boolean {
    this.pos += this.speed;

    let isOffScreen = false;
    if (this.isVertical) {
      if (this.speed > 0 && this.pos > canvasHeight + 100) isOffScreen = true;
      else if (this.speed < 0 && this.pos + this.length < -100) isOffScreen = true;
    } else {
      if (this.speed > 0 && this.pos > canvasWidth + 100) isOffScreen = true;
      else if (this.speed < 0 && this.pos + this.length < -100) isOffScreen = true;
    }

    if (isOffScreen) {
      if (this.dieOnExit) return false;
      this.respawn(canvasWidth, canvasHeight, primaryColor, secondaryColor);
    }

    const x = (this.isVertical ? this.lineIndex : this.pos) + offsetX;
    const y = (this.isVertical ? this.pos : this.lineIndex) + offsetY;

    const distToMouse = Math.hypot(
      Math.max(x, Math.min(mouseX, x + (this.isVertical ? 0 : this.length))) - mouseX,
      Math.max(y, Math.min(mouseY, y + (this.isVertical ? this.length : 0))) - mouseY
    );

    if (this.dieOnExit) {
      this.targetOpacity = 1;
    } else {
      if (distToMouse < glowRadius) {
        this.targetOpacity = 1 - (distToMouse / glowRadius);
      } else {
        this.targetOpacity = 0;
      }
    }

    if (this.opacity < this.targetOpacity) {
      this.opacity += 0.15;
    } else {
      this.opacity -= 0.003;
    }
    
    this.opacity = Math.max(0, Math.min(1, this.opacity));

    if (this.opacity > 0.01) {
      const gradient = ctx.createLinearGradient(
        x, y, 
        this.isVertical ? x : x + this.length, 
        this.isVertical ? y + this.length : y
      );
      gradient.addColorStop(0, `rgba(${this.color}, 0)`);
      gradient.addColorStop(0.5, `rgba(${this.color}, ${this.opacity})`);
      gradient.addColorStop(1, `rgba(${this.color}, 0)`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.dieOnExit ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        this.isVertical ? x : x + this.length,
        this.isVertical ? y + this.length : y
      );
      ctx.stroke();
    }

    return true;
  }
}
