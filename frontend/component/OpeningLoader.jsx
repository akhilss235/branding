"use client";

import { useEffect, useRef, useState } from "react";

const MIN_VISIBLE_MS = 1400;
const MAX_WAIT_MS = 3800;
const HOLD_PROGRESS = 94;
const EXIT_DURATION_MS = 520;

export default function OpeningLoader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const readyRef = useRef(false);
  const minElapsedRef = useRef(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    const body = document.body;
    const startedAt = performance.now();
    const shouldListenToLoad = document.readyState !== "complete";

    let progressTimer;
    let minTimer;
    let fallbackTimer;
    let exitTimer;

    const finish = () => {
      if (finishedRef.current) return;

      finishedRef.current = true;
      window.clearInterval(progressTimer);
      window.clearTimeout(fallbackTimer);
      setProgress(100);
      setIsExiting(true);

      exitTimer = window.setTimeout(() => {
        body.classList.remove("startup-loading");
        setIsVisible(false);
      }, EXIT_DURATION_MS);
    };

    const maybeFinish = () => {
      if (readyRef.current && minElapsedRef.current) {
        finish();
      }
    };

    const markReady = () => {
      readyRef.current = true;
      maybeFinish();
    };

    body.classList.add("startup-loading");

    progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (finishedRef.current) {
          return 100;
        }

        const elapsed = performance.now() - startedAt;
        const normalized = Math.min(elapsed / MAX_WAIT_MS, 1);
        const eased = 1 - Math.pow(1 - normalized, 3);
        const target = Math.max(current + 1, Math.round(eased * HOLD_PROGRESS));

        return Math.min(HOLD_PROGRESS, target);
      });
    }, 70);

    minTimer = window.setTimeout(() => {
      minElapsedRef.current = true;
      maybeFinish();
    }, MIN_VISIBLE_MS);

    fallbackTimer = window.setTimeout(markReady, MAX_WAIT_MS);

    if (shouldListenToLoad) {
      window.addEventListener("load", markReady, { once: true });
    } else {
      markReady();
    }

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(minTimer);
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(exitTimer);

      if (shouldListenToLoad) {
        window.removeEventListener("load", markReady);
      }

      body.classList.remove("startup-loading");
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`opening-loader${isExiting ? " is-exiting" : ""}`}
      aria-label="Opening website loader"
    >
      <div className="opening-loader__content">
        <p className="opening-loader__label">Loading</p>
        <div
          className="opening-loader__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Website loading progress"
        >
          <span
            className="opening-loader__fill"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
        <p className="opening-loader__value">{progress}%</p>
      </div>
    </div>
  );
}
