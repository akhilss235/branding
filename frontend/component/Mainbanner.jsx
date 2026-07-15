"use client";
import "./Mainbanner.css";
import { useEffect, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const HERO_VIDEO_SRC = "/models/v11.mp4";
const HERO_VIDEO_SPEED = 1;

export default function Mainbanner() {
  const heroRef = useRef(null);
  const heroVideoRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return undefined;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion || coarsePointer) {
      return undefined;
    }

    let frameId = 0;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const lerp = (start, end, amount) => start + (end - start) * amount;

    const render = () => {
      current.x = lerp(current.x, target.x, 0.12);
      current.y = lerp(current.y, target.y, 0.12);

      hero.style.setProperty("--hero-pointer-x", current.x.toFixed(4));
      hero.style.setProperty("--hero-pointer-y", current.y.toFixed(4));

      if (
        Math.abs(current.x - target.x) > 0.002 ||
        Math.abs(current.y - target.y) > 0.002
      ) {
        frameId = window.requestAnimationFrame(render);
      } else {
        frameId = 0;
      }
    };

    const startRender = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event) => {
      const bounds = hero.getBoundingClientRect();
      const xProgress = (event.clientX - bounds.left) / bounds.width;
      const yProgress = (event.clientY - bounds.top) / bounds.height;

      target.x = Math.max(-1, Math.min(1, xProgress * 2 - 1));
      target.y = Math.max(-1, Math.min(1, yProgress * 2 - 1));

      startRender();
    };

    const handlePointerLeave = () => {
      target.x = 0;
      target.y = 0;
      startRender();
    };

    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    const video = heroVideoRef.current;

    if (!video) {
      return undefined;
    }

    const applyPlaybackRate = () => {
      video.defaultPlaybackRate = HERO_VIDEO_SPEED;
      video.playbackRate = HERO_VIDEO_SPEED;
    };

    applyPlaybackRate();
    video.addEventListener("loadedmetadata", applyPlaybackRate);
    video.addEventListener("play", applyPlaybackRate);

    return () => {
      video.removeEventListener("loadedmetadata", applyPlaybackRate);
      video.removeEventListener("play", applyPlaybackRate);
    };
  }, []);

  return (
    <>
      {/* <Diversection /> */}
    {/* <Diver /> */}
      <section ref={heroRef} className="hero-shell" id="hero">
          {/* <Diversection /> */}

  

        <div className="hero-background" aria-hidden="true">
          <video
            ref={heroVideoRef}
            className="hero-background-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
          <div className="hero-background-shade" />
          <div className="hero-future-overlay">
            <div className="hero-future-grid" />
            <div className="hero-future-particles" />
            <span className="hero-future-pin hero-future-pin-1" />
            <span className="hero-future-pin hero-future-pin-2" />
            <span className="hero-future-pin hero-future-pin-3" />
            <span className="hero-future-pin hero-future-pin-4" />
            <span className="hero-future-pin hero-future-pin-5" />
            <span className="hero-future-pin hero-future-pin-6" />
          </div>

        </div>

        {/* <div className="hero-corner hero-corner-top" aria-hidden="true" />
        <div className="hero-corner hero-corner-bottom" aria-hidden="true" /> */}

        <main className="hero-layout">
          <div className="hero-copy-block">
            <p className="hero-kicker">Creative Systems Architect</p>

            <h1 className="hero-heading">
              <span className="hero-heading-primary">Brand System</span>
              <span className="hero-heading-accent">Architect</span>
            </h1>

            <p className="hero-copy">
              I design brand ecosystems, creative systems, and strategies that{" "}
              <strong>transform complexity into clarity</strong>, driving
              meaningful impact and sustainable growth.
            </p>

            <div className="hero-actions">
              <a href="#work" className="hero-button hero-button-primary">
                <span>View Work</span>
                <i className="fas fa-arrow-right" aria-hidden="true" />
              </a>

              <a href="http://localhost:3000/profile.html" className="hero-button hero-button-secondary">
                About Me
              </a>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
