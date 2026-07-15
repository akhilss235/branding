"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const WORK_TIMELINE = [
  {
    category: "Core Functions",
    year: "01",
    title: "Architecture | Story | Sound",
    description:
      "Designing brand systems as living ecosystems - dynamic, interdependent, and resilient under pressure.",
  },
  {
    category: "Ventures",
    year: "02",
    title: "FLUMENX | Misc Archive",
    description:
      "One arm for flows and frameworks. One for experiments and archives.",
  },
  {
    category: "Mediums",
    year: "03",
    title: "Brand Systems | Audio | Film",
    description:
      "Working where narrative, interfaces, and acoustic space meet.",
  },
  {
    category: "Dive Modes",
    year: "04",
    title: " with founders · Core teams",
    description:
      "Focused collaborations for high-stakes, high-ambiguity environments.",
  },
];

function TimelineCard({ item, index, progress, isMobileView }) {
  const start = index * 0.2;
  const fadeStart = Math.max(0, start - 0.14);
  const fadeEnd = Math.max(0.08, start - 0.04);
  const mid = start + 0.12;
  const end = start + 0.26;

  const opacity = useTransform(progress, [fadeStart, fadeEnd], [0.25, 1]);
  const y = useTransform(progress, [start, end], [170, -20]);
  const x = useTransform(progress, [start, end], [80, 0]);
  
  const scale = useTransform(progress, [start, mid], [0.9, 1]);

  return (
    <motion.article
      className="timeline-card-shell"
      style={isMobileView ? undefined : { opacity, y, x, scale }}
      initial={isMobileView ? { opacity: 0, y: 40 } : false}
      whileInView={isMobileView ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="timeline-card" >
        <div className="timeline-card-topline">
          {/* <span className="timeline-card-index">{item.year}</span> */}
          <span className="timeline-card-category">{item.category}</span>
        </div>
        <h3 className="timeline-card-title">{item.title}</h3>
        <p className="timeline-card-description">{item.description}</p>
      </div>
    </motion.article>
  );
}

export default function Home_contant() {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 991.98);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isMobileView = isClient && isMobile;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 0.92], [0, 1]);
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.5]);

  return (
    <section ref={sectionRef} className="work-timeline-section">
      <div className="work-timeline-sticky">
        <div className="work-timeline-backdrop" aria-hidden="true">
          <div className="work-timeline-glow work-timeline-glow-left" />
          <div className="work-timeline-glow work-timeline-glow-right" />
        </div>

        <motion.div
          className="work-timeline-header"
          style={isMobileView ? undefined : { y: headerY, opacity: headerOpacity }}
          initial={isMobileView ? { opacity: 0, y: 20 } : false}
          whileInView={isMobileView ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
        >
          <p className="work-timeline-eyebrow">Sound Engineer · Creative Director · Certified Diver</p>
          <h2 className="work-timeline-title">
           A Deep-Ocean Guide for
            <br />
           Branding & Business.
          </h2>
          <p className="work-timeline-copy">
I dive with you, bringing clarity, strategy, and creative systems so you can move with intent, not noise.          </p>
        </motion.div>

        <div className="work-timeline-stage">
          <div className="work-timeline-line-wrap" aria-hidden="true">
            <div className="work-timeline-line-base" />
            <motion.div
              className="work-timeline-line-fill"
              style={isMobileView ? undefined : { scaleY: lineScale }}
              initial={isMobileView ? { scaleY: 0 } : false}
              whileInView={isMobileView ? { scaleY: 1 } : undefined}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2 }}
            />
            <motion.div 
              className="work-timeline-orb" 
              style={isMobileView ? { top: "100%" } : { top: orbY }}
              initial={isMobileView ? { opacity: 0 } : false}
              whileInView={isMobileView ? { opacity: 1 } : undefined}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 1.2, duration: 0.4 }}
            />
          </div>

          <div className="work-timeline-cards">
            {WORK_TIMELINE.map((item, index) => (
              <TimelineCard
                key={item.category}
                item={item}
                index={index}
                progress={scrollYProgress}
                isMobileView={isMobileView}
              />
            ))}
          </div>
        </div>
      </div>




      <style jsx>{`
        .work-timeline-section {
          position: relative;
          height: 340vh;
          background:
            radial-gradient(circle at 16% 18%, rgba(101, 208, 255, 0.2), transparent 24%),
            radial-gradient(circle at 86% 78%, rgba(255, 146, 97, 0.16), transparent 24%),
            // linear-gradient(180deg, #04131f 0%, #071c2c 36%, #020a12 100%);
          overflow: clip;
        }

        .work-timeline-sticky {
          position: sticky;
          top: 0;
          min-height: 100vh;
          min-height: 100svh;
          width: min(100%, 88rem);
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          column-gap: clamp(2.5rem, 7vw, 6rem);
          align-items: center;
          padding: 8rem 1.5rem 4rem;
          margin: 0 auto;
        }

        .work-timeline-backdrop {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        // .work-timeline-glow {
        //   position: absolute;
        //   width: 22rem;
        //   height: 22rem;
        //   border-radius: 999px;
        //   filter: blur(70px);
        //   opacity: 0.42;
        // }

        .work-timeline-glow-left {
          top: 10%;
          left: -8rem;
          background: rgba(88, 205, 255, 0.3);
        }

        .work-timeline-glow-right {
          right: -6rem;
          bottom: 12%;
          background: rgba(255, 174, 93, 0.24);
        }

        .work-timeline-header {
          position: relative;
          z-index: 2;
          width: 100%;
          margin: 0;
        }

        .work-timeline-eyebrow {
          margin: 0 0 0.9rem;
          font-size: 0.82rem;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(212, 236, 246, 0.7);
        }

        .work-timeline-title {
          margin: 0;
          max-width: 12ch;
          font-size: clamp(2.6rem, 5vw, 5.5rem);
          line-height: 0.92;
          letter-spacing: -0.06em;
          color: #ffffff;
          text-transform: uppercase;
        }

        .work-timeline-copy {
          margin: 1.15rem 0 0;
          max-width: 34rem;
          font-size: clamp(1rem, 1.8vw, 1.12rem);
          line-height: 1.7;
          color: #d4ecf6;
        }

        .work-timeline-stage {
          position: relative;
          z-index: 2;
          width: 100%;
          margin: 0;
          display: grid;
          gap: 1.25rem;
          align-items: start;
          min-height: 74vh;
          min-height: 560px;
        }

        .work-timeline-line-wrap {
          position: relative;
          display: flex;
          justify-content: center;
          pointer-events: none;
          height: 100%;
        }

        .work-timeline-line-base,
        .work-timeline-line-fill {
          position: absolute;
          top: 0;
          width: 3px;
          height: 100%;
          border-radius: 999px;
          transform-origin: top center;
        }

        .work-timeline-line-base {
        }

     
        .work-timeline-orb {
          position: absolute;
          left: 50%;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #f4fbff;
     
        }

        .work-timeline-cards {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-top: 0.25rem;
        }

        .timeline-card-shell {
          width: min(100%, 20rem);
        }

        .timeline-card {
          position: relative;
          overflow: hidden;
         
          }

        .timeline-card::before {
          content: "";
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 3px;
        }

        .timeline-card-topline {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.2rem;
        }

        .timeline-card-index {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 3rem;
          height: 3rem;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }


        .timeline-card-category {
          font-size: 0.78rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #ffffff;
        }

        .timeline-card-title {
          margin: 0;
          font-size: clamp(1.4rem, 2vw, 2.1rem);
          line-height: 1;
          letter-spacing: -0.05em;
          color: #ffffff;
          text-transform: uppercase;
        }

        .timeline-card-description {
          margin: 1rem 0 0;
          font-size: 0.98rem;
          line-height: 1.75;
          color: #ffffff;
        }

        @media (max-width: 991.98px) {
          .work-timeline-section {
            height: auto;
          }

          .work-timeline-sticky {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            width: auto;
            margin: 0;
            padding-top: 5.5rem;
            padding-bottom: 4.5rem;
          }

          .work-timeline-stage {
            min-height: auto;
            display: grid;
            grid-template-columns: 28px minmax(0, 1fr);
            gap: 1rem;
            align-items: start;
          }

          .work-timeline-line-wrap {
            position: relative;
            inset: auto;
            min-height: 100%;
            height: auto;
          }

          .work-timeline-cards {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .timeline-card-shell {
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .work-timeline-sticky {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .work-timeline-title {
            max-width: none;
          }

          .timeline-card {
            padding: 1.15rem 1rem 1.2rem;
            border-radius: 20px;
          }
        }
      `}</style>
    </section>
  );
}
