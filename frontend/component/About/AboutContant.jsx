"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
// import Hover from "../component/about/Hover.jsx";
import About from "../About";
import Hover from "../Hover";


const FRONT_IMAGE_SRC = "/models/d3.png";
const BACK_IMAGE_SRC = "/models/d.png";
const ABOUT_HOVER_EFFECT_ENABLED = false;

const SERVICES = [
  "Brand Systems",
  "Experience Design",
  "Sonic Direction",
];

const BRAND_LOGOS = [
  {
    alt: "Misc Archive",
    href: "https://miscarchive.com/",
    src: "/bni-assets/misc-mini.png",
    width: 150,
    height: 100,
    className: "is-misc",
  },
  {
    alt: "Flumenx",
    href: "https://flumenx.com/",
    src: "/models/flumen.png",
    width: 150,
    height: 100,
    className: "is-flumen",
  },
];

export default function AboutContant() {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const imageWrapRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const imageWrap = imageWrapRef.current;

    if (!section || !media || !imageWrap) {
      return undefined;
    }

    const getImageBaseScale = () => {
      if (window.innerWidth <= 640) {
        return 0.95;
      }

      if (window.innerWidth <= 960) {
        return 0.91;
      }

      return 0.84;
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const hoverMotionEnabled = ABOUT_HOVER_EFFECT_ENABLED;

    if (reduceMotion || coarsePointer) {
      media.style.transform = "rotateX(0deg) rotateY(0deg) scale(1.01)";
      imageWrap.style.transform = `translate3d(0px, 0px, 0px) scale(${getImageBaseScale()})`;
      return undefined;
    }

    let frameId = 0;
    const current = { rx: 0, ry: 0, x: 0, y: 0, zoom: 0, opacity: 1 };
    const target = { rx: 0, ry: 0, x: 0, y: 0, zoom: 0, opacity: 1 };

    const interpolate = (start, end, progress) => start + (end - start) * progress;
    const lerp = (start, end, amount) => start + (end - start) * amount;

    const render = () => {
      const smoothFactor = 0.08; // Smoother transitions
      current.rx = lerp(current.rx, target.rx, smoothFactor);
      current.ry = lerp(current.ry, target.ry, smoothFactor);
      current.x = lerp(current.x, target.x, smoothFactor);
      current.y = lerp(current.y, target.y, smoothFactor);
      current.zoom = lerp(current.zoom, target.zoom, smoothFactor);
      current.opacity = lerp(current.opacity, target.opacity, smoothFactor);

      // Combine scroll-driven zoom with a base scale and mouse parallax scale
      const scrollScale = 1 + current.zoom * 0.22;
      const imageScale = getImageBaseScale();
      media.style.transform = `rotateX(${current.rx}deg) rotateY(${current.ry}deg) scale(${1.02 * scrollScale})`;
      media.style.opacity = current.opacity;
      imageWrap.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${imageScale})`;

      const isSettled =
        Math.abs(current.rx - target.rx) < 0.001 &&
        Math.abs(current.ry - target.ry) < 0.001 &&
        Math.abs(current.x - target.x) < 0.001 &&
        Math.abs(current.y - target.y) < 0.001 &&
        Math.abs(current.zoom - target.zoom) < 0.001 &&
        Math.abs(current.opacity - target.opacity) < 0.001;

      if (!isSettled) {
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
      if (!hoverMotionEnabled) {
        return;
      }

      const xProgress = event.clientX / window.innerWidth;
      const yProgress = event.clientY / window.innerHeight;

      target.rx = interpolate(4, -4, yProgress);
      target.ry = interpolate(-4, 4, xProgress);
      target.x = interpolate(-8, 8, xProgress);
      target.y = interpolate(-8, 8, yProgress);

      startRender();
    };

    const handlePointerLeave = () => {
      if (!hoverMotionEnabled) {
        return;
      }

      target.rx = 0;
      target.ry = 0;
      target.x = 0;
      target.y = 0;
      startRender();
    };

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      // Calculate how far we've scrolled into the section
      // 0 when section top is at viewport top, 1 when section bottom is at viewport bottom
      const totalScrollable = sectionHeight - viewportHeight;
      if (totalScrollable > 0) {
        const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
        target.zoom = progress;

        // Image should fade out as we move from the hero part to the details part
        // (Transition between 45% and 70% scroll progress)
        if (progress > 0.45) {
          const fadeProgress = (progress - 0.45) / 0.25;
          target.opacity = Math.max(0, 1 - fadeProgress);
        } else {
          target.opacity = 1;
        }

        startRender();
      }
    };

    if (hoverMotionEnabled) {
      section.addEventListener("pointermove", handlePointerMove);
      section.addEventListener("pointerleave", handlePointerLeave);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check for scroll position
    handleScroll();

    return () => {
      if (hoverMotionEnabled) {
        section.removeEventListener("pointermove", handlePointerMove);
        section.removeEventListener("pointerleave", handlePointerLeave);
      }
      window.removeEventListener("scroll", handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="about-cinematic"
      aria-labelledby="about-cinematic-title"
    >
      <div className="about-cinematic__backdrop" aria-hidden="true">
        <div className="about-cinematic__sticky-wrapper">
          <div ref={mediaRef} className="about-cinematic__media">
            <div ref={imageWrapRef} className="about-cinematic__image-wrap">
              <div className="about-cinematic__image-layer about-cinematic__image-layer--front">
                <Image
                  src={FRONT_IMAGE_SRC}
                  alt="Liquid mask hover reveal preview"
                  fill
                  priority
                  sizes="100vw"
                  className="about-cinematic__image"
                />
              </div>
              <Hover
                enabled={ABOUT_HOVER_EFFECT_ENABLED}
                scopeRef={sectionRef}
                src={BACK_IMAGE_SRC}
                className="about-cinematic__water-reveal"
                desktopPosition={{ x: 56, y: 12 }}
                mobilePosition={{ x: 56, y: 12 }}
                desktopScale={1}
                mobileScale={1.1}
              />
            </div>
          </div>
          <div className="about-cinematic__wash" />
          <div className="about-cinematic__grain" />
        </div>
      </div>

      <div className="about-cinematic__content">
        <div className="about-cinematic__inner">
          <div className="about-cinematic__lead">
            <div className="about-cinematic__intro">
              <p className="about-cinematic__eyebrow">Hi there! this is</p>
              <p className="about-cinematic__name">
                Anoop <span>Krishna</span>
              </p>
            </div>

            <h2 id="about-cinematic-title" className="about-cinematic__headline">
              <span>Creative</span>
              <span>Systems</span>
              <span className="is-accent">With Depth</span>
            </h2>
          </div>

          <aside className="about-cinematic__rail" aria-label="About summary">
            <div className="about-cinematic__panel about-cinematic__panel--services">
              <ul className="about-cinematic__service-list">
                {SERVICES.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>

            <a href="#about-cinematic-details" className="about-cinematic__cta">
              How can I help?
              <span aria-hidden="true">+</span>
            </a>

            <div className="about-cinematic__panel--summary">
              <p className="about-cinematic__summary">
                Founder &amp; CEO {"\u00b7"} Misc Archive &amp; Flumenx
                <br />
                Helping businesses move from being seen to being chosen.
              </p>

              <div className="about-cinematic__markers" aria-label="Brand logos">
                {BRAND_LOGOS.map((logo) => (
                
                
                <a
                    key={logo.alt}
                    href={logo.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={logo.alt}
                    className="about-cinematic__brand-link"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      className={`about-cinematic__brand-image ${logo.className}`}
                    />
                  </a>


                ))}
              </div>
            </div>
          </aside>
        </div>

        <div
          id="about-cinematic-details"
          className="about-cinematic__details"
        >
          {/* <About /> */}
          <About />
        </div>
      </div>

      <style jsx>{`
        .about-cinematic {
          --about-cinematic-image-position: 61% 23%;
          --about-cinematic-image-scale: 0.84;
          position: relative;
          isolation: isolate;
          color: #f7f1ea;
          background: #081210; /* Deeper green base */
        }

        .about-cinematic::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          background-size: 25% 100%;
          opacity: 0.16;
          pointer-events: none;
        }

        .about-cinematic::after {
          content: "";
          position: absolute;
          inset: auto 0 0;
          height: 10rem;
          z-index: 2;
          background: linear-gradient(180deg, rgba(5, 5, 5, 0), rgba(5, 5, 5, 0.92));
          pointer-events: none;
        }

        .about-cinematic__backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .about-cinematic__sticky-wrapper {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100svh;
          overflow: hidden;
          perspective: 1500px;
        }

        .about-cinematic__content {
          position: relative;
          z-index: 3;
        }

        .about-cinematic__media,
        .about-cinematic__wash,
        .about-cinematic__grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .about-cinematic__media {
          z-index: 0;
          transform-style: preserve-3d;
          transform: rotateX(0deg) rotateY(0deg) scale(1.01);
          will-change: transform;
        }

        .about-cinematic__image-wrap {
          position: absolute;
          inset: 0%;
          transform: translate3d(0px, 0px, 0px) scale(var(--about-cinematic-image-scale));
          will-change: transform;
        }

        .about-cinematic__image-layer {
          position: absolute;
          inset: 0;
        }

        .about-cinematic__image-layer--front {
          z-index: 0;
        }

        .about-cinematic__water-reveal {
          z-index: 1;
        }

        .about-cinematic__image {
          object-fit: cover;
          object-position: var(--about-cinematic-image-position);
        }

        .about-cinematic__wash {
          z-index: 1;
          background:
            linear-gradient(
              90deg,
              rgba(4, 15, 12, 0.92) 0%,
              rgba(4, 15, 12, 0.65) 30%,
              rgba(4, 15, 12, 0.35) 56%,
              rgba(4, 15, 12, 0.9) 100%
            ),
            radial-gradient(circle at 73% 22%, rgba(13, 110, 102, 0.35), transparent 0%),
            radial-gradient(circle at 40% 58%, rgba(13, 110, 102, 0.28), transparent 28%);
        }

        .about-cinematic__grain {
          z-index: 2;
          opacity: 0.08;
          mix-blend-mode: soft-light;
          background-size: 4px 4px;
        }

        .about-cinematic__inner {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(20rem, 26rem);
          gap: clamp(2rem, 4vw, 4.5rem);
          min-height: 100vh;
          min-height: 100svh;
          max-width: 1920px;
          margin: 0 auto;
          padding:
            clamp(6rem, 9vh, 7.5rem)
            clamp(1.25rem, 2.8vw, 3rem)
            clamp(1.5rem, 3vw, 2.5rem);
        }

        .about-cinematic__details {
          position: relative;
          z-index: 3;
          padding-bottom: clamp(4rem, 8vw, 7rem);
        }

        .about-cinematic__lead,
        .about-cinematic__rail {
          min-height: calc(100vh - clamp(6.5rem, 12vh, 7rem));
          min-height: calc(100svh - clamp(6.5rem, 12vh, 7rem));
        }

        .about-cinematic__lead {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          padding-bottom: clamp(1rem, 2.5vw, 2rem);
          max-width: min(100%, 52rem);
        }

        .about-cinematic__intro,
        .about-cinematic__headline span,
        .about-cinematic__panel,
        .about-cinematic__panel--summary,
        .about-cinematic__cta {
          opacity: 0;
          transform: translateY(28px);
          animation: rise 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .about-cinematic__intro {
          animation-delay: 0.12s;
        }

        .about-cinematic__headline span:nth-child(1) {
          animation-delay: 0.22s;
        }

        .about-cinematic__headline span:nth-child(2) {
          animation-delay: 0.32s;
        }

        .about-cinematic__headline span:nth-child(3) {
          animation-delay: 0.42s;
        }

        .about-cinematic__panel--services {
          animation-delay: 0.34s;
        }

        .about-cinematic__cta {
          animation-delay: 0.44s;
        }

        .about-cinematic__panel--summary {
          margin-top: auto;
          width: min(100%, 27rem);
          margin-left: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation-delay: 0.54s;
        }

        .about-cinematic__eyebrow {
          margin: 0;
          font-size: clamp(0.78rem, 0.86vw, 0.92rem);
          font-weight: 600;
          color: rgba(255, 255, 255, 0.74);
        }

        .about-cinematic__name {
          margin: 0.3rem 0 0;
          font-size: clamp(2rem, 2.45vw, 2rem);
          font-weight: 500;
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: #ffffff;
        }

        .about-cinematic__headline {
          margin: clamp(1.7rem, 4vh, 3.25rem) 0 0;
          display: flex;
          flex-direction: column;
          text-transform: uppercase;
          line-height: 0.82;
          letter-spacing: -0.08em;
        }

        .about-cinematic__headline span {
          font-size: clamp(4.9rem, 11.5vw, 7rem);
          font-weight: 800;
          text-shadow: 0 24px 50px rgba(0, 0, 0, 0.38);
        }

        .about-cinematic__headline .is-accent {
          color: #c9a84c;
        }

        .about-cinematic__rail {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: stretch;
          padding-top: clamp(4rem, 8vh, 5.5rem);
        }

        .about-cinematic__panel {
          width: min(100%, 27rem);
          margin-left: auto;
          padding: 1.7rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(90deg, rgba(6, 6, 8, 0), rgba(6, 6, 8, 0.18));
        }

        .about-cinematic__service-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 0.7rem;
        }

        .about-cinematic__service-list li {
          color: rgba(233, 226, 218, 0.72);
          font-size: clamp(0.96rem, 0.98vw, 1.06rem);
          font-weight: 500;
          line-height: 1.35;
        }

        .about-cinematic__cta {
          width: min(100%, 27rem);
          margin: 1.55rem 0 auto auto;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          color: #f9f3ea;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 0.18em;
          font-size: clamp(0.8rem, 1.02vw, 0.6rem);
          font-weight: 600;
          transition: color 0.25s ease, transform 0.25s ease;
        }

        .about-cinematic__cta span {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.58);
        }

        .about-cinematic__cta:hover {
          color: #ffcfbf;
          transform: translateX(-4px);
        }

        .about-cinematic__summary {
          margin: 0;
          max-width: 38ch;
          font-size: clamp(0.95rem, 0.98vw, 1.02rem);
          line-height: 1.68;
          color: rgba(222, 215, 207, 0.74);
        }

        .about-cinematic__markers {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
          gap: clamp(0.75rem, 2vw, 1rem);
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .about-cinematic__brand-link {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1 0;
          min-width: 0;
          text-decoration: none;
          opacity: 0.34;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .about-cinematic__brand-link:hover {
          opacity: 0.7;
          transform: translateY(-2px);
        }

        .about-cinematic__brand-image {
          display: block;
          max-width: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          filter: grayscale(1) brightness(1.95) contrast(0.72);
        }

        .about-cinematic__brand-image.is-misc {
          width: clamp(4rem, 11vw, 7.8rem);
          height: auto;
        }

        .about-cinematic__brand-image.is-flumen {
          width: clamp(4.75rem, 13vw, 7.8rem);
          height: auto;
        }

        @keyframes rise {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }









        @media (max-width: 1680px) {
          .about-cinematic__inner {
            grid-template-columns: minmax(0, 1fr) minmax(18rem, 22rem);
          }

          .about-cinematic__panel {
            width: min(70%, 27rem);
            padding: 1rem 0;
          }

          .about-cinematic__service-list li {
            font-size: clamp(0.86rem, 0.98vw, 0.86rem);
            font-weight: 500;
            line-height: 1.15;
          }

          .about-cinematic__cta span {
            font-size: 1rem;
          }

          .about-cinematic__cta {
            width: min(70%, 27rem);
            margin: 1.35rem 0 auto auto;
            gap: 1rem;
            font-size: clamp(0.6rem, 1.02vw, 0.5rem);
          }

          .about-cinematic__panel--summary {
            width: min(75%, 27rem);
            gap: 0.9rem;
          }

          .about-cinematic__summary {
            max-width: 35ch;
            font-size: clamp(0.86rem, 0.98vw, 0.86rem);
            line-height: 1.15;
          }

          .about-cinematic__eyebrow {
            font-size: clamp(0.68rem, 0.86vw, 0.82rem);
            font-weight: 500;
          }

          .about-cinematic__name {
            font-size: clamp(1rem, 2.45vw, 1.4rem);
            line-height: 0.85;
          }

          .about-cinematic__headline span {
            font-size: clamp(4.2rem, 5.2vw, 5.9rem);
          }
        }

        @media (max-width: 960px) {
          .about-cinematic {
            --about-cinematic-image-scale: 0.91;
          }

          .about-cinematic::before {
            background-size: 50% 100%;
          }

          .about-cinematic__inner {
            grid-template-columns: 1fr;
            min-height: auto;
            gap: 1.5rem;
            padding-top: 6.25rem;
            padding-bottom: 2rem;
          }

          .about-cinematic__lead,
          .about-cinematic__rail {
            min-height: auto;
          }

          .about-cinematic__lead {
            padding-top: 0.75rem;
            padding-bottom: 0;
            justify-content: flex-end;
          }

          .about-cinematic__headline {
            margin-top: 1.8rem;
          }

          .about-cinematic__rail {
            width: 100%;
            max-width: 32rem;
            padding-top: 0;
          }

          .about-cinematic__panel,
          .about-cinematic__panel--summary,
          .about-cinematic__cta {
            width: min(100%, 32rem);
            margin-left: 0;
          }

          .about-cinematic__cta {
            margin-top: 1.25rem;
            margin-bottom: 1.25rem;
          }

          .about-cinematic__panel--summary {
            margin-top: 0;
          }
        }

        @media (max-width: 640px) {
          .about-cinematic {
            --about-cinematic-image-position: 58% 24%;
            --about-cinematic-image-scale: 0.95;
          }

          .about-cinematic::before {
            background-size: 100% 100%;
            opacity: 0.08;
          }

          .about-cinematic__image {
            filter: brightness(1.08) contrast(1.08) saturate(1.02);
          }

          .about-cinematic__wash {
            background:
              linear-gradient(
                180deg,
                rgba(4, 4, 6, 0.18) 0%,
                rgba(4, 4, 6, 0.12) 18%,
                rgba(4, 4, 6, 0.42) 56%,
                rgba(4, 4, 6, 0.82) 100%
              ),
              linear-gradient(
                90deg,
                rgba(4, 4, 6, 0.54) 0%,
                rgba(4, 4, 6, 0.06) 42%,
                rgba(4, 4, 6, 0.38) 100%
              ),
              radial-gradient(circle at 56% 30%, rgba(255, 255, 255, 0.12), transparent 18%),
              radial-gradient(circle at 78% 22%, rgba(255, 87, 27, 0.24), transparent 24%);
          }

          .about-cinematic__grain {
            opacity: 0.04;
          }

          .about-cinematic__inner {
            gap: 1.25rem;
            padding: 5.4rem 1rem 1.25rem;
          }

          .about-cinematic__eyebrow {
            font-size: 0.9rem;
          }

          .about-cinematic__name {
            font-size: 1.85rem;
          }

          .about-cinematic__headline {
            margin-top: 1.35rem;
          }

          .about-cinematic__headline span {
            font-size: clamp(2.9rem, 14vw, 4.3rem);
          }

          .about-cinematic__service-list li,
          .about-cinematic__summary,
          .about-cinematic__cta {
            font-size: 0.95rem;
          }

          .about-cinematic__panel {
            padding: 1rem 0;
            background: linear-gradient(90deg, rgba(6, 6, 8, 0.06), rgba(6, 6, 8, 0.14));
            backdrop-filter: blur(2px);
          }

          .about-cinematic__panel,
          .about-cinematic__panel--summary,
          .about-cinematic__cta {
            width: 100%;
          }

          .about-cinematic__summary {
            max-width: none;
          }

          .about-cinematic__markers {
            gap: 0.9rem;
            padding-top: 0.85rem;
          }
        }

        @media (max-width: 420px) {
          .about-cinematic__inner {
            padding-inline: 0.9rem;
          }

          .about-cinematic__headline span {
            font-size: clamp(2.45rem, 13.5vw, 3.5rem);
          }

          .about-cinematic__cta {
            gap: 0.75rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-cinematic__intro,
          .about-cinematic__headline span,
          .about-cinematic__panel,
          .about-cinematic__panel--summary,
          .about-cinematic__cta {
            opacity: 1;
            transform: none;
            animation: none;
          }

          .about-cinematic__media {
            transform: rotateX(0deg) rotateY(0deg) scale(1.01);
          }

          .about-cinematic__image-wrap {
            transform: translate3d(0px, 0px, 0px) scale(var(--about-cinematic-image-scale));
          }
        }
      `}</style>
    </section>
  );
}
