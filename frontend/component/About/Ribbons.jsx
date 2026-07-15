"use client";

import { useEffect, useRef } from "react";

const OFFSCREEN = -9999;
const TAU = Math.PI * 1;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (start, end, amount) => start + (end - start) * amount;

function drawCoverImage(ctx, img, width, height, position) {
  if (!img.complete || !img.naturalWidth) {
    return;
  }

  const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
  const drawWidth = img.naturalWidth * scale;
  const drawHeight = img.naturalHeight * scale;
  const drawX = (width - drawWidth) * (position.x / 100);
  const drawY = (height - drawHeight) * (position.y / 100);

  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

function paintRibbon(ctx, points, thickness, color, opacity, settings) {
  const { enableFade, enableShaderEffect, effectAmplitude, time } = settings;

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    const prev = index > 0 ? points[index - 1] : point;
    const progress = 1 - index / Math.max(1, points.length - 1);
    const fadeFactor = enableFade ? progress : 1;
    const radius = Math.max(1.2, thickness * 0.5 * Math.pow(progress, 0.92));
    const alpha = opacity * fadeFactor * (0.18 + progress * 0.82);
    const dx = point.x - prev.x;
    const dy = point.y - prev.y;
    const length = Math.hypot(dx, dy) || 1;
    const normalX = -dy / length;
    const normalY = dx / length;
    const waveOffset =
      enableShaderEffect
        ? Math.sin(time * 3.2 + point.x * 0.018 + point.y * 0.012) *
          effectAmplitude *
          (0.24 + progress * 0.76)
        : 0;
    const x = point.x + normalX * waveOffset;
    const y = point.y + normalY * waveOffset;
    const prevX = prev.x + normalX * waveOffset;
    const prevY = prev.y + normalY * waveOffset;

    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();

    if (index > 0) {
      ctx.lineWidth = radius * 2;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  ctx.restore();
}

export default function Ribbons({
  scopeRef,
  revealSrc,
  className = "",
  colors = ["#49d7c9", "#6ab6ff"],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 30,
  offsetFactor = 0.05,
  maxAge = 800,
  pointCount = 50,
  speedMultiplier = 0.6,
  enableFade = false,
  enableShaderEffect = false,
  effectAmplitude = 2,
  backgroundColor = [0, 0, 0, 0],
  desktopPosition = { x: 50, y: 50 },
  mobilePosition = { x: 50, y: 50 },
  mobileBreakpoint = 640,
}) {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    const scope = scopeRef?.current ?? mount?.parentElement ?? mount;

    if (!mount || !canvas || !scope || !revealSrc) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");
    const revealCanvas = document.createElement("canvas");
    const revealCtx = revealCanvas.getContext("2d");

    if (!ctx || !maskCtx || !revealCtx) {
      return undefined;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion || coarsePointer) {
      return undefined;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let width = 5;
    let height = 5;
    let rafId = 0;
    let hasPointer = false;
    let isPointerInside = false;
    let isVisible = true;
    let overlayOpacity = 0;
    let overlayOpacityTarget = 0;
    let lastTime = performance.now();

    const mouse = { x: OFFSCREEN, y: OFFSCREEN };
    const mouseTarget = { x: OFFSCREEN, y: OFFSCREEN };
    const lastClientPoint = { x: 0, y: 0 };

    const getPosition = () =>
      window.innerWidth <= mobileBreakpoint ? mobilePosition : desktopPosition;

    const center = (colors.length - 1) / 2;
    const lines = colors.map((color, index) => ({
      color,
      spring: baseSpring + (Math.random() - 0.5) * 0.05,
      friction: baseFriction + (Math.random() - 0.5) * 0.05,
      thickness: baseThickness + (Math.random() - 0.5) * 3,
      velocity: { x: 0, y: 0 },
      offset: {
        x: (index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.1,
      },
      points: Array.from({ length: pointCount }, () => ({ x: 0, y: 0 })),
    }));

    const syncCanvasSizes = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, mount.clientWidth);
      height = Math.max(1, mount.clientHeight);

      [
        [canvas, ctx],
        [maskCanvas, maskCtx],
        [revealCanvas, revealCtx],
      ].forEach(([targetCanvas, targetCtx]) => {
        targetCanvas.width = Math.max(1, Math.round(width * pixelRatio));
        targetCanvas.height = Math.max(1, Math.round(height * pixelRatio));
        if (targetCanvas.style) {
          targetCanvas.style.width = `${width}px`;
          targetCanvas.style.height = `${height}px`;
        }
        targetCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      });
    };

    const initializeLines = (x, y) => {
      lines.forEach((line) => {
        line.velocity.x = 0;
        line.velocity.y = 0;
        line.points.forEach((point) => {
          point.x = x + line.offset.x * width;
          point.y = y + line.offset.y * height;
        });
      });
    };

    const updatePointer = (clientX, clientY) => {
      const rect = mount.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        isPointerInside = false;
        overlayOpacityTarget = 0;
        return;
      }

      lastClientPoint.x = clientX;
      lastClientPoint.y = clientY;
      isPointerInside = true;
      overlayOpacityTarget = 1;
      mouseTarget.x = x;
      mouseTarget.y = y;

      if (!hasPointer || mouse.x === OFFSCREEN || mouse.y === OFFSCREEN) {
        hasPointer = true;
        mouse.x = x;
        mouse.y = y;
        initializeLines(x, y);
      }
    };

    const resize = () => {
      syncCanvasSizes();

      if (hasPointer) {
        initializeLines(mouse.x, mouse.y);
      }
    };

    const drawFrame = (time) => {
      ctx.clearRect(0, 0, width, height);
      maskCtx.clearRect(0, 0, width, height);
      revealCtx.clearRect(0, 0, width, height);

      if (Array.isArray(backgroundColor) && backgroundColor.length === 4 && backgroundColor[3] > 0) {
        ctx.fillStyle = `rgba(${Math.round(backgroundColor[0] * 255)}, ${Math.round(
          backgroundColor[1] * 255,
        )}, ${Math.round(backgroundColor[2] * 255)}, ${backgroundColor[3]})`;
        ctx.fillRect(0, 0, width, height);
      }

      const revealOpacity = clamp(overlayOpacity, 0, 1);

      if (!hasPointer || revealOpacity <= 0.01 || !img.complete || !img.naturalWidth) {
        return;
      }

      lines.forEach((line) => {
        paintRibbon(maskCtx, line.points, line.thickness, "#ffffff", revealOpacity, {
          enableFade,
          enableShaderEffect,
          effectAmplitude,
          time,
        });
      });

      drawCoverImage(revealCtx, img, width, height, getPosition());
      revealCtx.globalCompositeOperation = "destination-in";
      revealCtx.drawImage(maskCanvas, 0, 0, width, height);
      revealCtx.globalCompositeOperation = "source-over";

      ctx.drawImage(revealCanvas, 0, 0, width, height);

      lines.forEach((line) => {
        paintRibbon(ctx, line.points, Math.max(2, line.thickness * 0.14), line.color, revealOpacity * 0.75, {
          enableFade,
          enableShaderEffect,
          effectAmplitude,
          time,
        });
      });
    };

    const animate = (now) => {
      rafId = requestAnimationFrame(animate);

      if (!isVisible) {
        lastTime = now;
        return;
      }

      const dt = Math.max(1, now - lastTime);
      lastTime = now;

      if (hasPointer) {
        mouse.x = lerp(mouse.x, mouseTarget.x, isPointerInside ? 0.22 : 0.1);
        mouse.y = lerp(mouse.y, mouseTarget.y, isPointerInside ? 0.22 : 0.1);
      }

      overlayOpacity = lerp(
        overlayOpacity,
        overlayOpacityTarget,
        overlayOpacityTarget > overlayOpacity ? 0.14 : 0.07,
      );

      lines.forEach((line) => {
        if (!hasPointer) {
          return;
        }

        const targetX = mouse.x + line.offset.x * width;
        const targetY = mouse.y + line.offset.y * height;
        line.velocity.x = (line.velocity.x + (targetX - line.points[0].x) * line.spring) * line.friction;
        line.velocity.y = (line.velocity.y + (targetY - line.points[0].y) * line.spring) * line.friction;
        line.points[0].x += line.velocity.x;
        line.points[0].y += line.velocity.y;

        for (let index = 1; index < line.points.length; index += 1) {
          if (Number.isFinite(maxAge) && maxAge > 0) {
            const segmentDelay = maxAge / Math.max(1, line.points.length - 1);
            const alpha = Math.min(1, (dt * speedMultiplier) / Math.max(1, segmentDelay));
            line.points[index].x = lerp(line.points[index].x, line.points[index - 1].x, alpha);
            line.points[index].y = lerp(line.points[index].y, line.points[index - 1].y, alpha);
          } else {
            line.points[index].x = lerp(line.points[index].x, line.points[index - 1].x, 0.9);
            line.points[index].y = lerp(line.points[index].y, line.points[index - 1].y, 0.9);
          }
        }
      });

      drawFrame(now * 0.001);
    };

    const onPointerMove = (event) => updatePointer(event.clientX, event.clientY);
    const onPointerLeave = () => {
      isPointerInside = false;
      overlayOpacityTarget = 0;
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => resize());
    resizeObserver?.observe(mount);

    const intersectionObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => {
            isVisible = entries[0]?.isIntersecting ?? true;
          });
    intersectionObserver?.observe(mount);

    img.onload = () => drawFrame(performance.now() * 0.001);
    img.src = revealSrc;
    syncCanvasSizes();

    if (hasPointer && lastClientPoint.x) {
      updatePointer(lastClientPoint.x, lastClientPoint.y);
    }

    rafId = requestAnimationFrame(animate);
    scope.addEventListener("pointermove", onPointerMove, { passive: true });
    scope.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      scope.removeEventListener("pointermove", onPointerMove);
      scope.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, [
    backgroundColor,
    baseFriction,
    baseSpring,
    baseThickness,
    colors,
    desktopPosition,
    effectAmplitude,
    enableFade,
    enableShaderEffect,
    maxAge,
    mobileBreakpoint,
    mobilePosition,
    offsetFactor,
    pointCount,
    revealSrc,
    scopeRef,
    speedMultiplier,
  ]);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <canvas ref={canvasRef} style={{ display: "block", height: "100%", width: "100%" }} />
    </div>
  );
}
