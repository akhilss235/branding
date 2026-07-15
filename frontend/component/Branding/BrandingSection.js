"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./BrandingSection.module.css";

const FEATURED_CARDS = [
  {
    kicker: "Brand identity",
    title: "TillWeCollide Launch System",
    author: "Campaign rollout and visual direction",
    authorName: ".DEBUT.",
    authorLocation: "Heredia, Costa Rica",
    link: "https://www.behance.net/",
    summary:
      "A launch-ready identity system designed to keep campaign visuals, social rollouts, and presentation assets consistent across every touchpoint.",
    details: [
      "Identity framework for campaign launches",
      "Art direction, layout logic, and asset planning",
      "Rollout support across digital and presentation formats",
    ],
    palette: ["#937154", "#c7bfb7", "#ccac8a", "#5c3e14", "#8c8c8a", "#3c3c3f"],
    styles: ["Clean", "Bold", "Modern", "Minimal"],
    industries: ["Agency", "Consultant"],
    typeface: "Satoshi",
    published: "May 22, 2026",
    gallery: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  },
  {
    kicker: "Packaging design",
    title: "PALUM Clothing Brand",
    author: "Packaging, retail touchpoints, and brand language",
    authorName: "Alona Avrash",
    authorLocation: "Warsaw, Poland",
    link: "https://www.behance.net/",
    summary:
      "A packaging and retail brand system built to feel bold, premium, and easy to extend across product drops and physical environments.",
    details: [
      "Packaging concept and production direction",
      "Retail-facing visual language",
      "Systemized typography and campaign adaptability",
    ],
    palette: ["#7464d8", "#dfef6f", "#ebe6ff", "#403898", "#f0c9ff"],
    styles: ["Playful", "Bold", "Retail"],
    industries: ["Fashion", "Packaging"],
    typeface: "Clash Display",
    published: "April 03, 2026",
    gallery: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    kicker: "Digital campaign",
    title: "Team Heretics Campaign",
    author: "Motion-led visuals and content design system",
    authorName: "Pol De Haro",
    authorLocation: "Barcelona, Spain",
    link: "https://www.behance.net/",
    summary:
      "A digital-first campaign identity focused on motion, energy, and strong visual consistency for fast-moving content ecosystems.",
    details: [
      "Motion-aware brand design system",
      "Visual direction for high-frequency content",
      "Digital campaign kit for repeatable execution",
    ],
    palette: ["#121212", "#86621f", "#d3c4a4", "#f4efe8", "#494949"],
    styles: ["Dynamic", "Esports", "Digital"],
    industries: ["Gaming", "Entertainment"],
    typeface: "Neue Haas Grotesk",
    published: "February 18, 2026",
    gallery: [
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    kicker: "Cafe branding",
    title: "Crumb and Co",
    author: "Menu styling, packaging, and social templates",
    authorName: "Shreya Chindarkar",
    authorLocation: "Pune, India",
    link: "https://www.behance.net/",
    summary:
      "A hospitality brand package with warm visual cues, packaging consistency, and social assets that support everyday storytelling.",
    details: [
      "Cafe identity and menu styling",
      "Packaging and takeaway visual system",
      "Social templates for content consistency",
    ],
    palette: ["#d8c0a5", "#f5eadf", "#9c6a43", "#4b3124", "#e7d7b8"],
    styles: ["Warm", "Minimal", "Hospitality"],
    industries: ["Food", "Cafe"],
    typeface: "Averta",
    published: "January 12, 2026",
    gallery: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1200&q=80",
    ],
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
];

const STATS = [
  { value: "24+", label: "branding systems" },
  { value: "12+", label: "years of creative work" },
  { value: "360", label: "strategy to rollout" },
];

export default function BrandingSection() {
  const [activeCardTitle, setActiveCardTitle] = useState(FEATURED_CARDS[0].title);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const activeCard = useMemo(
    () => FEATURED_CARDS.find((card) => card.title === activeCardTitle) ?? FEATURED_CARDS[0],
    [activeCardTitle]
  );

  useEffect(() => {
    if (!isOffcanvasOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOffcanvasOpen]);

  const openOffcanvas = (title) => {
    setActiveCardTitle(title);
    setIsOffcanvasOpen(true);
  };

  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  return (
    <section className={styles.brandingShowcase} aria-labelledby="branding-showcase-title">
      <div className={styles.shell}>
        <div className={styles.intro}>
          {/* <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>100% free - Just enjoy it</span>
          </div> */}

          <h1 className={styles.title} id="branding-showcase-title">
            <span>Design that</span>
            <span className={styles.titleMuted}>demands attention.</span>
          </h1>

          <p className={styles.subtitle}>
            Brand strategy, identity systems, and rollout assets built with clarity.
          </p>

          <div className={styles.stats} aria-label="Branding statistics">
            {STATS.map((item) => (
              <div key={item.label} className={styles.stat}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {FEATURED_CARDS.map((card) => (
            <button
              key={card.title}
              type="button"
              className={styles.card}
              onClick={() => openOffcanvas(card.title)}
            >
              <p className={styles.cardKicker}>{card.kicker}</p>
              <div className={styles.mediaFrame}>
                <img src={card.image} alt={card.title} className={styles.media} />
              </div>
              <div className={styles.cardMeta}>
                <h2>{card.title}</h2>
                <p>{card.author}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`${styles.offcanvasBackdrop}${isOffcanvasOpen ? ` ${styles.offcanvasBackdropVisible}` : ""}`}
        onClick={closeOffcanvas}
        aria-hidden={!isOffcanvasOpen}
      />

      <aside
        className={`${styles.offcanvasPanel}${isOffcanvasOpen ? ` ${styles.offcanvasPanelOpen}` : ""}`}
        aria-labelledby="branding-offcanvas-title"
        aria-hidden={!isOffcanvasOpen}
      >
        <div className={styles.offcanvasHeader}>
          <div className={styles.offcanvasHeaderLeft}>
            <p className={styles.offcanvasKicker}>{activeCard.kicker}</p>
            <a
              href={activeCard.link}
              target="_blank"
              rel="noreferrer"
              className={styles.offcanvasLink}
            >
              Open project
            </a>
          </div>
          <button
            type="button"
            className={styles.offcanvasClose}
            onClick={closeOffcanvas}
            aria-label="Close details panel"
          >
            X
          </button>
        </div>

        <div className={styles.offcanvasLayout}>
          <div className={styles.offcanvasMain}>
            <h2 className={styles.offcanvasTitle} id="branding-offcanvas-title">
              {activeCard.title}
            </h2>
            <p className={styles.offcanvasSummary}>{activeCard.summary}</p>

            <div className={styles.offcanvasGallery}>
              {activeCard.gallery.map((image, index) => (
                <div key={`${activeCard.title}-${index}`} className={styles.offcanvasMedia}>
                  <img
                    src={image}
                    alt={`${activeCard.title} preview ${index + 1}`}
                    className={styles.offcanvasImage}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.offcanvasSide}>
            <div className={styles.offcanvasSection}>
              <p className={styles.offcanvasLabel}>Author</p>
              <p className={styles.offcanvasAuthorName}>{activeCard.authorName}</p>
              <p className={styles.offcanvasAuthor}>{activeCard.authorLocation}</p>
            </div>

            <div className={styles.offcanvasSection}>
              <p className={styles.offcanvasLabel}>Colors</p>
              <div className={styles.paletteRow}>
                {activeCard.palette.map((color) => (
                  <div key={color} className={styles.paletteSwatchWrap}>
                    <span
                      className={styles.paletteSwatch}
                      style={{ backgroundColor: color }}
                      aria-hidden="true"
                    />
                    <span className={styles.paletteCode}>{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.offcanvasSection}>
              <p className={styles.offcanvasLabel}>Style</p>
              <div className={styles.tagRow}>
                {activeCard.styles.map((item) => (
                  <span key={item} className={styles.tagChip}>
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.offcanvasSection}>
              <p className={styles.offcanvasLabel}>Industry</p>
              <div className={styles.tagRow}>
                {activeCard.industries.map((item) => (
                  <span key={item} className={styles.tagChip}>
                    #{item}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.offcanvasSection}>
              <p className={styles.offcanvasLabel}>Typeface</p>
              <p className={styles.metaText}>{activeCard.typeface}</p>
            </div>

            <div className={styles.offcanvasSection}>
              <p className={styles.offcanvasLabel}>Published</p>
              <p className={styles.metaText}>{activeCard.published}</p>
            </div>

            <div className={styles.offcanvasSection}>
              <p className={styles.offcanvasLabel}>What this includes</p>
              <ul className={styles.offcanvasList}>
                {activeCard.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
