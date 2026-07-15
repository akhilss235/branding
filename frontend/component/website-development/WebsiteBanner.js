"use client";
import { useEffect, useRef } from "react";
import styles from "./WebsiteBanner.module.css";

export default function WebsiteBanner() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    let frameId = 0;

    const resizeCanvas = () => {
      const { clientWidth, clientHeight } = canvas;
      const ratio = window.devicePixelRatio || 1;

      canvas.width = clientWidth * ratio;
      canvas.height = clientHeight * ratio;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(ratio, ratio);
    };

    const drawFrame = () => {
      if (video.readyState >= 2) {
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        const videoRatio = video.videoWidth / video.videoHeight;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (videoRatio > canvasRatio) {
          drawHeight = canvasHeight;
          drawWidth = drawHeight * videoRatio;
          offsetX = (canvasWidth - drawWidth) / 2;
        } else {
          drawWidth = canvasWidth;
          drawHeight = drawWidth / videoRatio;
          offsetY = (canvasHeight - drawHeight) / 2;
        }

        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
      }

      frameId = window.requestAnimationFrame(drawFrame);
    };

    const startPlayback = async () => {
      resizeCanvas();

      try {
        await video.play();
      } catch {
        // Ignore autoplay blocking; the poster-like first frame will still render when available.
      }

      drawFrame();
    };

    video.addEventListener("loadeddata", startPlayback);
    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();

    if (video.readyState >= 2) {
      startPlayback();
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      video.removeEventListener("loadeddata", startPlayback);
      window.removeEventListener("resize", resizeCanvas);
      video.pause();
    };
  }, []);

  const lines = [
    // { y: 24, turnX: 88, radius: 14, rise: 980, delay: 0 },
    // { y: 68, turnX: 138, radius: 14, rise: 940, delay: 0.55 },
    // { y: 112, turnX: 188, radius: 14, rise: 900, delay: 1.1 },
    // { y: 156, turnX: 238, radius: 14, rise: 860, delay: 1.65 },
    // { y: 200, turnX: 288, radius: 14, rise: 820, delay: 2.2 },
    { y: 244, turnX: 338, radius: 14, rise: 780, delay: 2.75 },
    { y: 288, turnX: 388, radius: 14, rise: 740, delay: 3.3 },
    { y: 332, turnX: 438, radius: 14, rise: 700, delay: 3.85 },
    { y: 376, turnX: 488, radius: 14, rise: 660, delay: 4.4 },
    { y: 420, turnX: 538, radius: 14, rise: 620, delay: 4.95 },
    { y: 464, turnX: 588, radius: 14, rise: 580, delay: 5.5 },
  ];

  return (
    <section className={styles.websiteBanner}>
      <div className={styles.websiteBannerGlow} aria-hidden="true">
        <svg
          className={styles.websiteLinesSvg}
          viewBox="0 0 820 620"
          preserveAspectRatio="xMinYMin slice"
        >
          <defs>
            <linearGradient id="lineFade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0aa" stopOpacity="0.88" />
              <stop offset="58%" stopColor="#00f0aa" stopOpacity="0.52" />
              <stop offset="100%" stopColor="#b9ffea" stopOpacity="0.92" />
            </linearGradient>
            <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {lines.map((line, i) => {
            const d = `M -40 ${line.y} H ${line.turnX - line.radius} Q ${line.turnX} ${line.y} ${line.turnX} ${line.y - line.radius} V ${-line.rise}`;
            const isMobileHiddenLine = i >= lines.length - 2;
            return (
              <g
                key={i}
                className={isMobileHiddenLine ? styles.websiteLineMobileHidden : undefined}
              >
                <path
                  d={d}
                  fill="none"
                  stroke="url(#lineFade)"
                  strokeWidth="1.55"
                  strokeLinecap="round"
                  filter="url(#lineGlow)"
                  opacity="0.92"
                />
                <path
                  d={d}
                  fill="none"
                  stroke="#cfffec"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  filter="url(#lineGlow)"
                  className={styles.websiteLinePulse}
                  style={{
                    animationDelay: `${line.delay}s`,
                  }}
                  pathLength="1"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.websiteBannerShell}>
        <div className={styles.websiteHeroCopy}>
          <p className={styles.websiteKicker}>
            {/* Portfolio  */}
            3D Websites</p>
          <h1>
            Meets Immersive
            <br />
            Storytelling.
          </h1>
          <a href="#contact" className={styles.websiteCta}>
            <span>Get Started for Free</span>
            <span aria-hidden="true" className={styles.websiteCtaArrow}>
              &rarr;
            </span>
          </a>
        </div>


            {/* <div className="website-canvas-frame">
              <canvas
                ref={canvasRef}
                className="website-showcase-canvas"
                aria-label="Website showcase video preview"
              />
              <video
                ref={videoRef}
                className="website-showcase-video-source"
                src="/models/v3.mp4"
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
              />
            </div>
   */}
   
      </div>

    </section>
  );
}
