"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};


const BRAND_TILES = [
  {
    primary: "Misc Archive",
    variant: "archive",
  },
  {
    primary: "Flumenx",
    variant: "flumenx",
  },
  {
    primary: "Welgate",
    variant: "welgate",
  },
  {
    primary: "EIQ",
    secondary: "Brand Systems",
    variant: "stacked",
  },
  {
    primary: "Swarasaakhi",
    variant: "swarasaakhi",
  },
  {
    primary: "BNI Kerala",
    variant: "mono",
  },
];

const MARQUEE_GROUP_COUNT = 4;
const TILE_BORDER_DURATION = "3.2s";

export default function BrandingLogo() {
  const baseMarqueeSpeed = 0.0005;
  const maxScrollBoost = 0.35;
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 20], [0, maxScrollBoost], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  const directionFactor = useRef(1);
  const marqueeRef = useRef(null);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseMarqueeSpeed * delta;

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);

    // Update skew CSS custom property based on scroll direction
    if (marqueeRef.current) {
      const skew = directionFactor.current === -1 ? "-16deg" : "16deg";
      marqueeRef.current.style.setProperty("--tile-skew", skew);
    }
  });

  return (

<>






    <section className="branding-logo-section" aria-labelledby="branding-logo-title">
      <div className="branding-logo-section__grid" aria-hidden="true" />

        <div className="branding-logo-section__content">
          <div className="branding-logo-section__copy">
            <p className="branding-logo-section__eyebrow">Selected collaborations</p>
            <h2 className="branding-logo-section__title" id="branding-logo-title">
              Brands &amp; creative teams <br /> I&apos;ve collaborated with:
            </h2>
          </div>

        {/* <p className="branding-logo-section__sr">
          Collaborated with Misc Archive, Flumenx, Welgate, EIQ Brand Systems,
          Swarasaakhi, and BNI Kerala.
        </p> */}

        <div
          className="branding-logo-marquee"
          aria-hidden="true"
          ref={marqueeRef}
          style={{
            "--tile-skew": "-16deg",
            "--tile-border-duration": TILE_BORDER_DURATION
          }}
        >
          <motion.div className="branding-logo-marquee__track" style={{ x }}>
            {Array.from({ length: MARQUEE_GROUP_COUNT }, (_, loopIndex) => (
              <div className="branding-logo-marquee__group" key={`group-${loopIndex}`}>
                {BRAND_TILES.map((tile) => {
                  return (
                    <div
                      className="branding-logo-marquee__tile"
                      key={`${loopIndex}-${tile.primary}`}
                    >
                      <span className="branding-logo-marquee__border" aria-hidden="true" />
                      <div
                        className={`branding-logo-marquee__wordmark branding-logo-marquee__wordmark--${tile.variant}`}
                      >
                        <span className="branding-logo-marquee__primary">{tile.primary}</span>
                        {tile.secondary ? (
                          <span className="branding-logo-marquee__secondary">
                            {tile.secondary}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .branding-logo-section {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          display: flex;
          align-items: center;
          background:
            radial-gradient(circle at 50% 45%, rgba(17, 99, 124, 0.18), transparent 34%),
            linear-gradient(180deg, #001a28 0%, #001b2a 48%, #001724 100%);
          color: #fff;
        }

        .branding-logo-section__grid {
          --grid-column: min(16vw, 19rem);
          --grid-row: 17rem;
          position: absolute;
          inset: 0;
          overflow: hidden;
          background-image:
            linear-gradient(to right, rgba(46, 49, 56, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(46, 49, 56, 0.05) 1px, transparent 1px);
          background-size: var(--grid-column) 100%, 100% var(--grid-row);
          pointer-events: none;
        }

        .branding-logo-section__grid::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              to right,
              transparent 0,
              transparent calc(var(--grid-column) - 1px),
              rgb(0, 247, 255) calc(var(--grid-column) - 1px),
              rgba(5, 187, 253, 0.88) var(--grid-column)
            );
          background-size: var(--grid-column) 100%;
          background-repeat: repeat;
          opacity: 0.82;
          filter: drop-shadow(0 0 8px rgba(126, 220, 255, 0.28));
          -webkit-mask-image: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 0, 0, 0.16) 14%,
            rgba(0, 0, 0, 1) 50%,
            rgba(0, 0, 0, 0.16) 86%,
            transparent 100%
          );
          -webkit-mask-size: 100% 28%;
          -webkit-mask-repeat: no-repeat;
          mask-image: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 0, 0, 0.16) 14%,
            rgba(0, 0, 0, 1) 50%,
            rgba(0, 0, 0, 0.16) 86%,
            transparent 100%
          );
          mask-size: 100% 28%;
          mask-repeat: no-repeat;
          animation: branding-logo-grid-wave-vertical 8s linear infinite;
        }

        .branding-logo-section__grid::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent calc(var(--grid-row) - 1px),
              rgb(0, 234, 255) calc(var(--grid-row) - 1px),
              rgba(0, 195, 255, 0.68) var(--grid-row)
              
            );
          background-size: 100% var(--grid-row);
          background-repeat: repeat;
          opacity: 0.72;
          filter: drop-shadow(0 0 7px rgba(126, 220, 255, 0.22));
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 0, 0, 0.14) 14%,
            rgba(0, 0, 0, 1) 50%,
            rgba(0, 0, 0, 0.14) 86%,
            transparent 100%
          );
          -webkit-mask-size: 26% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-image: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 0, 0, 0.14) 14%,
            rgba(0, 0, 0, 1) 50%,
            rgba(0, 0, 0, 0.14) 86%,
            transparent 100%
          );
          mask-size: 26% 100%;
          mask-repeat: no-repeat;
          animation: branding-logo-grid-wave-horizontal 10s linear infinite;
        }

        .branding-logo-section__content {
          position: relative;
          z-index: 1;
          display: grid;
          width: 100%;
          min-height: 100svh;
          align-content: center;
          gap: clamp(2rem, 5vh, 4.5rem);
          padding: clamp(4rem, 8vh, 6rem) 0;
        }

        .branding-logo-section__copy {
          width: min(100%, 40rem);
          padding-inline: clamp(1.2rem, 4vw, 3.75rem);
        }

        .branding-logo-section__eyebrow {
          margin: 0 0 1rem;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.82rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #fff;
        }

        .branding-logo-section__title {
          margin: 0;
          font-size: clamp(2rem, 6vw, 3rem);
          font-weight: 600;
          line-height: 0.92;
          letter-spacing: -0.075em;
          text-wrap: balance;
        }

        .branding-logo-section__sr {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .branding-logo-marquee {
          --tile-gap: clamp(1rem, 2.7vw, 1.6rem);
          --tile-width: clamp(15.5rem, 18vw, 20rem);
          --tile-height: clamp(8rem, 12vw, 13rem);
          --tile-border-color: #5fd06f;
          --tile-border-color-soft: rgba(95, 208, 111, 0.14);
          --tile-border-color-glow: rgba(95, 208, 111, 0.45);
          position: relative;
          width: 100%;
          overflow: hidden;
          padding-block: clamp(2rem, 4vw, 3rem);
        }

        .branding-logo-marquee::before,
        .branding-logo-marquee::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(2rem, 6vw, 6rem);
          z-index: 2;
          pointer-events: none;
        }

        .branding-logo-marquee::before {
          left: 0;
        }

        .branding-logo-marquee::after {
          right: 0;
        }

        :global(.branding-logo-marquee__track) {
          display: flex;
          flex-wrap: nowrap;
          align-items: stretch;
          width: max-content;
          will-change: transform;
        }

        .branding-logo-marquee__group {
          display: flex;
          gap: var(--tile-gap);
          padding-right: var(--tile-gap);
          flex: 0 0 auto;
        }

        .branding-logo-marquee__tile {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--tile-width);
          height: var(--tile-height);
          flex: 0 0 var(--tile-width);
          padding: 1.35rem 1.25rem;
          box-sizing: border-box;
          isolation: isolate;
        }

        .branding-logo-marquee__tile::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.3rem;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.72)),
            rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(46, 49, 56, 0.04);
          box-shadow:
            0 18px 45px rgba(106, 112, 126, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.92);
          transform: skewX(var(--tile-skew, -16deg));
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 0;
        }

        .branding-logo-marquee__tile::after {
          content: "";
          position: absolute;
          top: 0.65rem;
          bottom: 0.65rem;
          left: 1rem;
          width: 1px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0)
          );
          transform: skewX(var(--tile-skew, -16deg));
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          opacity: 0.8;
          z-index: 1;
        }

        .branding-logo-marquee__border {
          position: absolute;
          inset: 0;
          display: block;
          overflow: hidden;
          box-sizing: border-box;
          padding: 1px;
          border-radius: 0.3rem;
          pointer-events: none;
          transform: skewX(var(--tile-skew, -16deg));
          z-index: 2;
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
        }

        .branding-logo-marquee__border::before {
          content: "";
          position: absolute;
          inset: -38%;
          border-radius: inherit;
          background: conic-gradient(
            from 0deg,
            transparent 0deg 300deg,
            var(--tile-border-color-soft) 320deg,
            var(--tile-border-color) 338deg,
            rgba(216, 255, 220, 0.98) 350deg,
            transparent 360deg
          );
          filter: drop-shadow(0 0 12px var(--tile-border-color-glow));
          animation: branding-logo-tile-border-spin var(--tile-border-duration, 3.2s) linear infinite;
          will-change: transform;
        }

        .branding-logo-marquee__border::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            130deg,
            rgba(46, 49, 56, 0.06),
            rgba(65, 70, 76, 0.12),
            rgba(46, 49, 56, 0.06)
          );
        }

        .branding-logo-marquee__wordmark {
          position: relative;
          z-index: 3;
          display: inline-grid;
          gap: 0.2rem;
          justify-items: center;
          color: rgba(96, 100, 108, 0.82);
          text-align: center;
          white-space: nowrap;
          transform: translateZ(0);
        }

        .branding-logo-marquee__primary,
        .branding-logo-marquee__secondary {
          display: block;
        }

        .branding-logo-marquee__wordmark--archive {
          font-size: clamp(1.2rem, 2.15vw, 1rem);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .branding-logo-marquee__wordmark--flumenx {
          font-size: clamp(1.55rem, 2.45vw, 2.2rem);
          font-weight: 700;
          letter-spacing: -0.05em;
        }

        .branding-logo-marquee__wordmark--welgate {
          font-size: clamp(1.55rem, 2.25vw, 2rem);
          font-weight: 600;
          letter-spacing: -0.04em;
        }

        .branding-logo-marquee__wordmark--stacked {
          gap: 0.05rem;
          font-size: clamp(1rem, 2vw, 1.55rem);
          font-weight: 800;
          line-height: 0.86;
          letter-spacing: -0.06em;
          text-transform: uppercase;
        }

        .branding-logo-marquee__wordmark--stacked
          .branding-logo-marquee__secondary {
          font-size: 0.56em;
          line-height: 1;
          letter-spacing: 0.16em;
          color: rgba(116, 121, 130, 0.72);
        }

        .branding-logo-marquee__wordmark--swarasaakhi {
          font-size: clamp(1.32rem, 2.15vw, 1.9rem);
          font-weight: 500;
          letter-spacing: -0.06em;
        }

        .branding-logo-marquee__wordmark--mono {
          font-family: var(--font-geist-mono), monospace;
          font-size: clamp(1rem, 1.8vw, 1.4rem);
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        @keyframes branding-logo-grid-wave-vertical {
          0% {
            -webkit-mask-position: 0 -40%;
            mask-position: 0 -40%;
            opacity: 0;
          }

          100% {
            -webkit-mask-position: 0 140%;
            mask-position: 0 140%;
            opacity: 0.82;
          }
        }

        @keyframes branding-logo-grid-wave-horizontal {
          0% {
            -webkit-mask-position: -40% 0;
            mask-position: -40% 0;
            opacity: 0;
          }

          100% {
            -webkit-mask-position: 140% 0;
            mask-position: 140% 0;
            opacity: 0.72;
          }
        }

        @keyframes branding-logo-tile-border-spin {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 991.98px) {
          .branding-logo-section,
          .branding-logo-section__content {
            min-height: 100svh;
          }

          .branding-logo-section__grid {
            --grid-column: min(18vw, 10rem);
            --grid-row: 13rem;
          }

          .branding-logo-marquee {
            --tile-width: clamp(15.5rem, 24vw, 18rem);
            --tile-height: clamp(10rem, 10vw, 12.4rem);
          }

          .branding-logo-marquee__wordmark--archive {
            font-size: clamp(1.22rem, 1.45vw, 1.55rem);
          }

          .branding-logo-marquee__wordmark--flumenx {
            font-size: clamp(1.18rem, 1.95vw, 1.65rem);
          }

          .branding-logo-marquee__wordmark--welgate {
            font-size: clamp(1.18rem, 1.9vw, 1.55rem);
          }

          .branding-logo-marquee__wordmark--stacked {
            font-size: clamp(0.86rem, 1.55vw, 1.2rem);
          }

          .branding-logo-marquee__wordmark--swarasaakhi {
            font-size: clamp(1rem, 1.65vw, 1.4rem);
          }

          .branding-logo-marquee__wordmark--mono {
            font-size: clamp(0.84rem, 1.35vw, 1.05rem);
          }

          .branding-logo-section__content {
            gap: 3rem;
            justify-content: center;
          }

          .branding-logo-section__title {
            max-width: 52ch;
            font-size: clamp(2.5rem, 10vw, 3.4rem);
          }

          .branding-logo-marquee {
            margin-block: 0;
          }
        }










        @media (max-width: 640px) {
          .branding-logo-section,
          .branding-logo-section__content {
            min-height: 100svh;
          }

          .branding-logo-section__grid {
            --grid-column: 3.35rem;
            --grid-row: 8rem;
          }

          .branding-logo-section__grid::before {
            opacity: 0.62;
          }

          .branding-logo-section__grid::after {
            opacity: 0.54;
          }

          .branding-logo-section__content {
            gap: 1.35rem;
            padding-block: 4rem 3.5rem;
          }

          .branding-logo-section__copy {
            width: min(100%, 18rem);
            padding-inline: 1rem;
          }

          .branding-logo-section__eyebrow {
            margin-bottom: 0.65rem;
            font-size: 0.72rem;
            letter-spacing: 0.18em;
          }

          .branding-logo-section__title {
            width: 100%;
            font-size: clamp(1.05rem, 8.8vw, 1.30rem);
            line-height: 0.94;
            letter-spacing: -0.06em;
          }

          .branding-logo-marquee {
            --tile-gap: 0.7rem;
            --tile-width: clamp(7.9rem, 39vw, 9.15rem);
            --tile-height: 5.15rem;
            overflow: hidden;
            padding-inline: 0.75rem;
            padding-block: 0.35rem 0;
          }

          .branding-logo-marquee::before,
          .branding-logo-marquee::after {
            width: 1.15rem;
            display: block;
          }

          .branding-logo-marquee__tile {
            width: var(--tile-width);
            height: var(--tile-height);
            flex-basis: var(--tile-width);
            padding: 0.85rem 0.75rem;
          }

          .branding-logo-marquee__tile::after {
            top: 0.5rem;
            bottom: 0.5rem;
            left: 0.78rem;
          }

          .branding-logo-marquee__wordmark--archive {
            font-size: clamp(0.72rem, 3.1vw, 0.9rem);
          }

          .branding-logo-marquee__wordmark--flumenx {
            font-size: clamp(1rem, 4vw, 1.2rem);
          }

          .branding-logo-marquee__wordmark--welgate {
            font-size: clamp(1rem, 3.9vw, 1.16rem);
          }

          .branding-logo-marquee__wordmark--stacked {
            font-size: clamp(0.74rem, 3vw, 0.96rem);
          }

          .branding-logo-marquee__wordmark--swarasaakhi {
            font-size: clamp(0.9rem, 3.5vw, 1.08rem);
          }

          .branding-logo-marquee__wordmark--mono {
            font-size: clamp(0.72rem, 2.85vw, 0.9rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .branding-logo-section__grid::before,
          .branding-logo-section__grid::after {
            animation: none;
          }

          .branding-logo-section__grid::before,
          .branding-logo-section__grid::after {
            -webkit-mask-position: center;
            mask-position: center;
            opacity: 0.18;
          }

          .branding-logo-marquee__border::before {
            animation: none;
            filter: none;
          }
        }

      `}</style>
    </section> </>
  );
}
