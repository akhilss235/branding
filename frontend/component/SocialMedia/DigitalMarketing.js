
"use client";

import { useEffect, useRef, useState } from "react";
import "./SocialMedia.css";
const FRAME_COUNT = 240;
const PRELOAD_AHEAD = 4;
const PRELOAD_BEHIND = 2;
const frameSource = (index) =>
  `/macbook/ezgif-frame-${String(index + 1).padStart(3, "0")}.webp`;

const FEATURES = [
  {
    eyebrow: "Digital Marketing Strategist",
    title: "Attention becomes action.",
    copy: "I build digital marketing systems that turn visibility into clicks, conversations, and measurable growth.",
  },
  {
    eyebrow: "01 / Campaign strategy",
    title: "Clear campaigns. Stronger results.",
    copy: "From positioning to rollout, every campaign is shaped to reach the right audience with the right message.",
  },
  {
    eyebrow: "02 / Content marketing",
    title: "Content that carries intent.",
    copy: "Social content, ad creatives, and branded storytelling designed to engage people and keep the brand in motion.",
  },
  {
    eyebrow: "03 / Performance growth",
    title: "Optimize what matters.",
    copy: "Insights, iteration, and performance tracking help refine every touchpoint for stronger reach, response, and return.",
  },
];

export default function DigitalMarketing() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(-1);
  const rafRef = useRef(null);
  const activeFeatureRef = useRef(0);
  const currentTargetFrameRef = useRef(0);
  const preloadTimerRef = useRef(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!section || !canvas || !context) return undefined;

    let mounted = true;
    let progress = 0;

    const drawFrame = (index) => {
      if (frameRef.current === index) return;
      const image = imagesRef.current[index];
      if (!image?.complete || !image.naturalWidth) return;

      const { width, height } = canvas.getBoundingClientRect();
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;

      context.clearRect(0, 0, width, height);
      context.drawImage(
        image,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
      frameRef.current = index;
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * pixelRatio);
      canvas.height = Math.round(bounds.height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawFrame(Math.max(frameRef.current, 0));
    };

    const requestFrame = (index) => {
      const existing = imagesRef.current[index];
      if (existing) {
        if (existing.complete) drawFrame(index);
        return;
      }

      const image = new Image();
      imagesRef.current[index] = image;
      image.decoding = "async";
      image.src = frameSource(index);
      image.onload = () => {
        if (!mounted) return;
        const currentTarget = Math.round(progress * (FRAME_COUNT - 1));
        if (index === currentTarget || frameRef.current < 0) drawFrame(index);
        if (index === 0) setIsReady(true);
      };
    };

    const scheduleSequentialPreload = (startIndex) => {
      if (preloadTimerRef.current) return;

      let nextIndex = startIndex;

      const step = () => {
        preloadTimerRef.current = null;
        if (!mounted) return;

        while (nextIndex < FRAME_COUNT && imagesRef.current[nextIndex]) {
          nextIndex += 1;
        }

        if (nextIndex >= FRAME_COUNT) return;

        requestFrame(nextIndex);
        nextIndex += 1;
        preloadTimerRef.current = window.setTimeout(step, 120);
      };

      preloadTimerRef.current = window.setTimeout(step, 120);
    };

    const update = () => {
      rafRef.current = null;
      const bounds = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      progress = Math.min(Math.max(-bounds.top / distance, 0), 1);

      const targetFrame = Math.round(progress * (FRAME_COUNT - 1));
      currentTargetFrameRef.current = targetFrame;
      requestFrame(targetFrame);
      for (let offset = 1; offset <= PRELOAD_AHEAD; offset += 1) {
        requestFrame(Math.min(targetFrame + offset, FRAME_COUNT - 1));
      }
      for (let offset = 1; offset <= PRELOAD_BEHIND; offset += 1) {
        requestFrame(Math.max(targetFrame - offset, 0));
      }

      scheduleSequentialPreload(Math.min(targetFrame + PRELOAD_AHEAD + 1, FRAME_COUNT - 1));

      const nextFeature = Math.min(Math.floor(progress * FEATURES.length), FEATURES.length - 1);
      if (activeFeatureRef.current !== nextFeature) {
        activeFeatureRef.current = nextFeature;
        setActiveFeature(nextFeature);
      }
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    requestFrame(0);
    resize();
    update();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mounted = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (preloadTimerRef.current) window.clearTimeout(preloadTimerRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="macbook-hero" id="hero">
      <div className="macbook-hero__sticky">
        <canvas ref={canvasRef} className="macbook-hero__canvas" aria-hidden="true" />
        <div className="macbook-hero__shade" aria-hidden="true" />

        <div className={`macbook-hero__loader ${isReady ? "is-hidden" : ""}`} aria-hidden="true">
          <span />
        </div>

        <div className="macbook-hero__content">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.eyebrow}
              className={`macbook-hero__feature ${activeFeature === index ? "is-active" : ""}`}
              aria-hidden={activeFeature !== index}
            >
              <p className="macbook-hero__eyebrow">{feature.eyebrow}</p>
              <h1>{feature.title}</h1>
              <p className="macbook-hero__copy">{feature.copy}</p>
              {index === 0 && (
                <a href="#work" className="macbook-hero__cta">
                  Explore selected work <span aria-hidden="true">↘</span>
                </a>
              )}
            </article>
          ))}
        </div>

        <div className="macbook-hero__rail" aria-label={`Chapter ${activeFeature + 1} of ${FEATURES.length}`}>
          {FEATURES.map((feature, index) => (
            <span key={feature.eyebrow} className={activeFeature === index ? "is-active" : ""} />
          ))}
        </div>

        <p className="macbook-hero__scroll-cue">
          <span aria-hidden="true" /> Scroll to explore
        </p>
      </div>
    </section>
  );
}
