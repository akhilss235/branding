"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Footer.module.css";

const EMAIL = "hello@anoopkrishna.in";

const PRODUCT_LINKS = [
  { label: "Brand Systems", href: "#work" },
  { label: "Sonic Identity", href: "#work" },
  { label: "Creative Direction", href: "#ExperienceRole" },
  { label: "Campaign Worlds", href: "#work" },
  { label: "Web Experiences", href: "#intro" },
];

const COMPANY_LINKS = [
  { label: "About", href: "#overview" },
  { label: "Selected Work", href: "#work" },
  { label: "Experience", href: "#ExperienceRole" },
  { label: "Contact", href: "#contact" },
  { label: "FLUMENX", href: "#about" },
];

const LEGAL_LINKS = [
  {
    label: "Privacy",
    href: `mailto:${EMAIL}?subject=Privacy%20request`,
  },
  {
    label: "Terms",
    href: `mailto:${EMAIL}?subject=Project%20terms`,
  },
];

const SOCIAL_LINKS = [
  {
    label: "Email",
    href: `mailto:${EMAIL}`,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/anoop-krishna-v-a-2b7501234/?originalSubdomain=in",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/anoopkrishna_akv?igsh=MTNlNHMxZWN5bmY3cw==",
  },
  {
    label: "YouTube",
    href: "http://youtube.com/@akvanoop",
  },
];

function useFooterScrollReveal(ref) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef(null);

  const update = useCallback(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const startTrigger = viewportH;
    const endTrigger = viewportH * 0.45;
    const rawProgress = (startTrigger - rect.top) / (startTrigger - endTrigger);
    const clamped = Math.min(1, Math.max(0, rawProgress));

    setProgress(clamped);
  }, [ref]);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [update]);

  return progress;
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const year = new Date().getFullYear();
  const footerRef = useRef(null);
  const progress = useFooterScrollReveal(footerRef);

  const minScale = 0.52;
  const scale = minScale + (1 - minScale) * progress;
  const maxRadius = 28;
  const borderRadius = maxRadius * (1 - progress);
  const translateY = 40 * (1 - progress);
  const opacity = 0.4 + 0.6 * progress;

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setStatus("idle");
      return;
    }

    const subject = encodeURIComponent("Newsletter sign up");
    const body = encodeURIComponent(
      `Please add ${cleanEmail} to the update list.`
    );

    setStatus("sent");
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <footer className={styles.portfolioFooter} aria-label="Footer" ref={footerRef}>
      <div className={styles.scrollWrapper}>
        <div
          className={styles.revealCard}
          style={{
            transform: `scale(${scale}) translateY(${translateY}px)`,
            borderRadius: `${borderRadius}px`,
            opacity,
          }}
        >
          <div className={styles.gridFloor} aria-hidden="true" />
          <div className={styles.inner}>
            <div className={styles.top}>
              <div className={styles.lead}>
                <h2 className={styles.headline}>
                  Clear, deliberate, outcome-driven creative systems.
                </h2>

                <p className={styles.summary}>
                  Brand architecture, sonic direction, and digital experiences for
                  teams that want depth without noise.
                </p>
              </div>

              <div className={styles.navCol}>
                <h3 className={styles.label}>Product</h3>
                <div className={styles.links}>
                  {PRODUCT_LINKS.map((item) => (
                    <a key={item.label} href={item.href} className={styles.link}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className={styles.navCol}>
                <h3 className={styles.label}>Company</h3>
                <div className={styles.links}>
                  {COMPANY_LINKS.map((item) => (
                    <a key={item.label} href={item.href} className={styles.link}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className={styles.newsletter}>
                <h3 className={styles.label}>Newsletter</h3>
                <form className={styles.newsletterForm} onSubmit={handleSubmit}>
                  <label className={styles.srOnly} htmlFor="footer-email">
                    Your email
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className={styles.input}
                    placeholder="Your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className={styles.submit}
                    aria-label="Join newsletter"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4.5 11.8 19.7 4.8l-4.5 14.5-3.5-5.1-7.2-2.4Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.8 14.2 19.5 5.1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </form>

                <p className={styles.newsletterCopy}>
                  Updates on launches, sound experiments, and behind-the-scenes
                  process notes.
                </p>

                <p
                  className={`${styles.newsletterStatus}${
                    status === "sent" ? ` ${styles.newsletterStatusVisible}` : ""
                  }`}
                >
                  Email draft opened for subscription.
                </p>
              </div>
            </div>

            <div className={styles.bottom}>
              <p className={styles.copyright}>
                &copy; {year} Anoop Krishna. All rights reserved.
              </p>

              <div className={styles.bottomRight}>
                <div className={styles.legal}>
                  {LEGAL_LINKS.map((item) => (
                    <a key={item.label} href={item.href} className={styles.legalLink}>
                      {item.label}
                    </a>
                  ))}
                </div>

                <div className={styles.socials}>
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className={styles.socialLink}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
