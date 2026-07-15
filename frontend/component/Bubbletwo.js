"use client";

import { useEffect, useRef } from "react";

export default function BubbleTwo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let W, H;
    let bubbles = [];
    let micros = [];
    let t = 0;
    let scrollY = window.scrollY || 0;

    const handleScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", handleScroll, { passive: true });

    function rand(a, b) { return a + Math.random() * (b - a); }

    // Stagger columns by ~2 s each (120 frames apart at 60 fps)
    const COL_PHASE = [0, 120, 240];

    // Returns { x, col } so callers know which column was picked
    function getSpawnX() {
      const zone = Math.floor(Math.random() * 3);
      const xs = [W * 0.18, W * 0.50, W * 0.82];
      return { x: xs[zone] + rand(-12, 12), col: zone };
    }

    const resize = () => {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.scale(DPR, DPR);
    };

    class Bubble {
      constructor() { this.reset(); }
      reset() {
        this.r = rand(0.8, 4.5);
        const spawn = getSpawnX();
        this.originX = spawn.x;
        this.x = this.originX;
        this.y = H + rand(0, 120);
        this.vy = rand(0.9, 1.2);
        this.vx = rand(-0.25, 0.25);
        this.phase = rand(0, Math.PI * 2);
        this.freq = rand(0.012, 0.03);
        this.amp = rand(0.5, 1.8);
        this.alpha = rand(0.55, 0.9);
        this.spawnCX = this.originX;
        this.colPhase = COL_PHASE[spawn.col]; // ← per-column time offset
        this.alive = true;
      }
      update(t) {
        this.y -= this.vy;

        const progress = 1 - this.y / H;
        const spread = progress * progress * 55;

        this.originX += this.vx;

        const lo = this.spawnCX - spread;
        const hi = this.spawnCX + spread;
        if (this.originX < lo) this.originX += (lo - this.originX) * 0.05;
        if (this.originX > hi) this.originX -= (this.originX - hi) * 0.05;

        if (this.originX < 8) this.originX = 8;
        if (this.originX > W - 8) this.originX = W - 8;

        // Use (t + colPhase) so each column sways on its own timeline
        this.x = this.originX + Math.sin((t + this.colPhase) * this.freq + this.phase) * this.amp * 3;

        if (this.y + this.r < 0) this.alive = false;
      }
      draw() {
        const { x, y, r, alpha } = this;
        let docY = scrollY + y;
        let fadeMult = 1;
        if (docY < H * 0.8) fadeMult = Math.max(0, (docY - H * 0.5) / (H * 0.3));
        let currentAlpha = alpha * fadeMult;
        if (currentAlpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = currentAlpha;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(200, 235, 255, 0.80)";
        ctx.lineWidth = r > 3 ? 0.9 : 0.6;
        ctx.stroke();

        const body = ctx.createRadialGradient(x, y, 0, x, y, r);
        body.addColorStop(0, "rgba(210, 240, 255, 0.12)");
        body.addColorStop(0.7, "rgba(80, 160, 220, 0.06)");
        body.addColorStop(1, "rgba(30, 100, 180, 0.02)");
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = body;
        ctx.fill();

        const hx = x - r * 0.3, hy = y - r * 0.32;
        const spec = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.65);
        spec.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        spec.addColorStop(0.2, "rgba(255, 255, 255, 0.65)");
        spec.addColorStop(0.6, "rgba(230, 248, 255, 0.18)");
        spec.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = spec;
        ctx.fill();

        if (r > 3) {
          ctx.beginPath();
          ctx.arc(x - r * 0.32, y - r * 0.34, r * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.88)";
          ctx.fill();
        }

        ctx.restore();
      }
    }

    class Micro {
      constructor() { this.reset(); }
      reset() {
        const spawn = getSpawnX();
        this.spawnCX = spawn.x;
        this.originX = spawn.x;
        this.x = this.originX;
        this.y = H + rand(0, 40);
        this.r = rand(0.3, 0.9);
        this.vy = rand(0.5, 1.0);
        this.alpha = rand(0.25, 0.55);
        this.phase = rand(0, Math.PI * 2);
        this.vx = rand(-0.2, 0.2);
        this.colPhase = COL_PHASE[spawn.col]; // ← per-column time offset
        this.alive = true;
      }
      update(t) {
        this.y -= this.vy;

        const progress = 1 - this.y / H;
        const spread = progress * progress * 40;

        this.originX += this.vx;

        const lo = this.spawnCX - spread;
        const hi = this.spawnCX + spread;
        if (this.originX < lo) this.originX += (lo - this.originX) * 0.05;
        if (this.originX > hi) this.originX -= (this.originX - hi) * 0.05;

        if (this.originX < 4) this.originX = 4;
        if (this.originX > W - 4) this.originX = W - 4;

        // Use (t + colPhase) so each column sways on its own timeline
        this.x = this.originX + Math.sin((t + this.colPhase) * 0.025 + this.phase) * 0.6;
        if (this.y + this.r < 0) this.alive = false;
      }
      draw() {
        let docY = scrollY + this.y;
        let fadeMult = 1;
        if (docY < H * 0.8) fadeMult = Math.max(0, (docY - H * 0.5) / (H * 0.3));
        let currentAlpha = this.alpha * fadeMult;
        if (currentAlpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(200,235,255,0.9)";
        ctx.lineWidth = 0.4;
        ctx.stroke();
        ctx.fillStyle = "rgba(220,245,255,0.18)";
        ctx.fill();
        ctx.restore();
      }
    }

    function init() { resize(); }

    function drawBG() {
      const topGlow = ctx.createRadialGradient(W / 2, -10, 0, W / 2, -10, 260);

      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, W, H);

      const shimmerX = W / 2 + Math.sin(t * 0.008) * 20;
      const shimmer = ctx.createRadialGradient(shimmerX, 0, 0, shimmerX, 0, 140);

      ctx.fillStyle = shimmer;
      ctx.fillRect(0, 0, W, 200);

      const depthFog = ctx.createLinearGradient(0, H * 0.7, 0, H);

      ctx.fillStyle = depthFog;
      ctx.fillRect(0, H * 0.7, W, H * 0.3);
    }

    function drawSource() {
      const sources = [W * 0.18, W * 0.50, W * 0.82];
      const vy = H - 10;
      for (const vx of sources) {
        const vg = ctx.createRadialGradient(vx, vy, 0, vx, vy, 40);

        ctx.fillStyle = vg;
        ctx.fillRect(vx - 45, vy - 45, 90, 60);
      }
    }

    let isStreaming = false;

    function animate() {
      t++;
      ctx.clearRect(0, 0, W, H);
      drawBG();
      drawSource();

      bubbles = bubbles.filter(b => b.alive);
      micros = micros.filter(m => m.alive);

      if (isStreaming) {
        if (bubbles.length < 120) {
          bubbles.push(new Bubble());
          if (Math.random() > 0.5) bubbles.push(new Bubble());
        }
        if (micros.length < 80) micros.push(new Micro());
      }

      for (const m of micros) { m.update(t); m.draw(); }
      for (const b of bubbles) { b.update(t); b.draw(); }

      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    init();
    animate();

    const streamTimeout = setTimeout(() => { isStreaming = true; }, 2000);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(streamTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
