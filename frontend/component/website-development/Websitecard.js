"use client";
import styles from "./Websitecard.module.css";

const WEBSITE_CARDS = [
  {
    kicker: "Portfolio",
    title: "Curved",
    video: "/models/v9.mp4",
    brand: "NIKE",
    subtitle: "VISUALISATION",
    accent: "#ff7a59",
    accentSoft: "rgba(255, 122, 89, 0.26)",
    accentGlow: "rgba(255, 122, 89, 0.44)",
    surface: "linear-gradient(145deg, rgba(52, 16, 9, 0.96), rgba(20, 7, 4, 0.98))",
  },
  {
    kicker: "Showcase",
    title: "Motion",
    video: "/models/v3.mp4",
    brand: "ADIDAS",
    subtitle: "IMMERSIVE REEL",
    accent: "#7c9cff",
    accentSoft: "rgba(124, 156, 255, 0.24)",
    accentGlow: "rgba(124, 156, 255, 0.42)",
    surface: "linear-gradient(145deg, rgba(15, 20, 54, 0.96), rgba(6, 8, 20, 0.98))",
  },
  {
    kicker: "Experience",
    title: "Studio",
    video: "/models/bg7.mp4",
    brand: "PUMA",
    subtitle: "DIGITAL STORY",
    accent: "#b7ff4a",
    accentSoft: "rgba(183, 255, 74, 0.24)",
    accentGlow: "rgba(183, 255, 74, 0.44)",
    surface: "linear-gradient(145deg, rgba(20, 36, 7, 0.96), rgba(8, 15, 4, 0.98))",
  },
];

export default function Websitecard() {
  return (
    <section className={styles.websiteCardSection}>
      <div className={styles.websiteCardStack}>
        {WEBSITE_CARDS.map((card) => (
          <div
            key={`${card.brand}-${card.title}`}
            className={styles.websiteCardShell}
            style={{
              "--card-accent": card.accent,
              "--card-accent-soft": card.accentSoft,
              "--card-accent-glow": card.accentGlow,
              "--card-surface": card.surface,
            }}
          >
            <div className={styles.websiteCardLayout}>
              <div className={styles.websiteCardCopy}>
                <div className={styles.websiteCardHeading}>
                  <span className={styles.websiteCardKicker}>{card.kicker}</span>
                  <h2>{card.title}</h2>
                </div>

                <div className={styles.websiteCardActions}>
                  <a href="#contact" className={`${styles.websiteCardBtn} ${styles.websiteCardBtnPrimary}`}>
                    <span>Experience</span>
                    <span aria-hidden="true" className={styles.websiteCardBtnArrow}>
                      &rarr;
                    </span>
                  </a>
                  <a href="#contact" className={`${styles.websiteCardBtn} ${styles.websiteCardBtnSecondary}`}>
                    Book a Call
                  </a>
                </div>
              </div>

              <article className={styles.websiteCardMedia}>
                <div className={styles.websiteCardMediaTop}>
                  <span className={styles.websiteCardRing} aria-hidden="true"></span>
                </div>

                <video
                  className={styles.websiteCardVideo}
                  src={card.video}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
                />

                <div className={styles.websiteCardMediaOverlay}></div>

                <div className={styles.websiteCardMediaCaption}>
                  <h3>{card.brand}</h3>
                  <p>{card.subtitle}</p>
                  <span>read more</span>
                </div>

                <a href="#contact" className={styles.websiteCardTag}>
                  <span>Get In Touch</span>
                  <span aria-hidden="true">&nearr;</span>
                </a>
              </article>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
