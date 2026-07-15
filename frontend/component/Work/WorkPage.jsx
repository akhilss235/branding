"use client";

import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

function HeroParallaxHeader() {
  return (
    <div className="parallax-header">
      <p className="parallax-header-eyebrow">Portfolio</p>
      <h1 className="parallax-header-headline">
        Crafted with vision.<br />Built to last.
      </h1>
      <p className="parallax-header-sub">
        Strategy, sound, and cinematic direction - from concept to execution,
        every project is a world of its own.
      </p>
      <div className="parallax-header-cta-row">
        <a href="#work" className="parallax-cta-primary">
          View Selected Work
        </a>
        <a href="#contact" className="parallax-cta-ghost">
          Get in Touch -&gt;
        </a>
      </div>
    </div>
  );
}

export default function Workpage() {
  const projectCards = [
    {
      category: "BRANDING",
      title: "Branding",
      desc: "Comprehensive brand strategy and visual identity for a tech startup.",
      img: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
      href: "/Branding",
    },
    {
      category: "BRANDING SYSTEM",
      title: "Branding System",
      desc: "Structured identity systems, guidelines, and reusable brand assets built for consistency across every touchpoint.",
      img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80",
      href: "/Branding",
    },
    {
      category: "DIGITAL MARKETING",
      title: "Digital Marketing",
      desc: "Performance-driven campaigns across social, search, and paid channels to increase reach, leads, and conversions.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      href: "/Digital-Marketing",
    },
    {
      category: "IT",
      title: "IT Solutions",
      desc: "Scalable websites, technical systems, and digital infrastructure tailored for business growth.",
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      href: "/web-development",
    },
    {
      category: "SOUND ENGINEERING",
      title: "Sound Engineering",
      desc: "Recording, sound design, mixing, and mastering crafted to give projects clarity, depth, and emotional impact.",
      img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
      href: "/Sound-engineering",
    },
    {
      category: "ACADEMY PUBLISHED",
      title: "Academy Published",
      desc: "Educational and published work that shares creative systems, process thinking, and practical insights with a wider audience.",
      img: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&q=80",
      href: "#contact",
    },
  ];

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 200, damping: 30, bounce: 100 };

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.15], [0.4, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-320, 20]),
    springConfig
  );

  return (
    <div ref={ref} className="parallax-root">
      <HeroParallaxHeader />

      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="parallax-rows-wrapper"
      >
        <div className="container py-4 py-xl-3">
          <div className="row g-3 work-card-grid">
            {projectCards.map((project) => (
              <div key={project.title} className="col-12 col-md-6 col-xl-4">
                <a href={project.href} className="parallax-card-link">
                  <div className="parallax-card">
                    <div className="parallax-card-img-zone">
                      <img
                        src={project.img}
                        className="parallax-card-media"
                        alt={project.title}
                      />
                      <div className="parallax-card-img-scrim" />
                    </div>
                    <div className="parallax-card-panel">
                      <span className="parallax-card-category">{project.category}</span>
                      <h3 className="parallax-card-title">{project.title}</h3>
                      <p className="parallax-card-desc">{project.desc}</p>
                      <span className="parallax-card-cta">View Project</span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
