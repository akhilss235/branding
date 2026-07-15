"use client";

import { useState } from "react";

const FOOTER_NAV = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#ExperienceRole" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
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

const EMAIL = "hello@anoopkrishna.in";

export default function SiteFooter() {
  const [copied, setCopied] = useState(false);
  const year = new Date().getFullYear();

  const handleCopyEmail = async () => {
    if (!navigator?.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer className="site-footer" aria-label="Footer">
      <div >
        <div className="site-footer__panel">
          <div className="site-footer__intro">
            <div className="site-footer__copy">
              <p className="site-footer__eyebrow">Closing Frame</p>
              <a href="#hero" className="site-footer__brand">
                Anoop Krishna
              </a>
              <p className="site-footer__summary">
                Brand systems, sound direction, and clear creative thinking for
                projects that need depth without the noise.
              </p>
            </div>

            {/* <div className="site-footer__actions">
              <button
                type="button"
                className="site-footer__button"
                onClick={handleCopyEmail}
              >
                {copied ? "Email copied" : "Copy email"}
              </button>

              <a href="#hero" className="site-footer__button site-footer__button--ghost">
                Back to top
              </a>
            </div> */}
          </div>

          <div className="site-footer__grid">
            <div className="site-footer__card">
              <p className="site-footer__label">Navigate</p>
              <div className="site-footer__links">
                {FOOTER_NAV.map((item) => (
                  <a key={item.label} href={item.href} className="site-footer__link">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="site-footer__card">
              <p className="site-footer__label">Contact</p>
              <div className="site-footer__stack">
                <a href={`mailto:${EMAIL}`} className="site-footer__meta-link">
                  {EMAIL}
                </a>
                <p className="site-footer__meta">Remote-first, timezone flexible</p>
                <p className="site-footer__meta">Based in India</p>
              </div>
            </div>

            <div className="site-footer__card">
              <p className="site-footer__label">Social</p>
              <div className="site-footer__links">
                {SOCIAL_LINKS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="site-footer__link"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="site-footer__bottom">
            <span>Copyright {year} Anoop Krishna</span>
            <span>Clarity, craft, and long-horizon thinking.</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          position: relative;
          z-index: 10;
        }

        .site-footer__panel {
          overflow: hidden;
          border: 1px solid rgba(0, 245, 201, 0.14);
          border-radius: 1rem;
          background:
            radial-gradient(circle at 0% 0%, rgba(0, 245, 201, 0.14), transparent 28%),
            linear-gradient(180deg, rgba(1, 8, 8, 0.92) 0%, rgba(2, 7, 7, 0.98) 100%);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.3);
        }

        .site-footer__intro {
          display: flex;
          justify-content: space-between;
          gap: 2rem;
          padding: clamp(2rem, 4vw, 3rem);
          border-bottom: 1px solid rgba(0, 245, 201, 0.1);
        }

        .site-footer__copy {
          max-width: 44rem;
        }

        .site-footer__eyebrow {
          margin: 0 0 0.9rem;
          font-size: 0.74rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-soft);
        }

        .site-footer__brand {
          display: inline-block;
          margin-bottom: 0.3rem;
          text-decoration: none;
          font-size: clamp(2.2rem, 4vw, 3rem);
          line-height: 0.96;
          letter-spacing: -0.05em;
          color: var(--text-main);
        }

        .site-footer__summary {
          margin: 0;
          max-width: 38rem;
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text-soft);
        }

        .site-footer__actions {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .site-footer__button {
          border: 1px solid rgba(0, 245, 201, 0.42);
          border-radius: 999px;
          padding: 0.9rem 1.2rem;
          background: rgba(0, 245, 201, 0.12);
          color: var(--text-main);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 0.74rem;
          cursor: pointer;
          transition:
            transform 0.16s ease,
            border-color 0.16s ease,
            background 0.16s ease;
        }

        .site-footer__button:hover {
          transform: translateY(-1px);
          border-color: rgba(0, 245, 201, 0.8);
          background: rgba(0, 245, 201, 0.18);
        }

        .site-footer__button--ghost {
          background: transparent;
        }

        .site-footer__grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1.2rem;
          padding: 0 3rem 2rem;
        }

        .site-footer__card {
          border-radius: 1.3rem;
          padding: 1.2rem;
        }

        .site-footer__label {
          margin: 0 0 1rem;
          font-size: 0.74rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-soft);
        }

        .site-footer__links,
        .site-footer__stack {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .site-footer__link,
        .site-footer__meta-link {
          color: var(--text-main);
          text-decoration: none;
          transition: color 0.16s ease, transform 0.16s ease;
        }

        .site-footer__link:hover,
        .site-footer__meta-link:hover {
          color: var(--accent);
          transform: translateX(3px);
        }

        .site-footer__meta {
          margin: 0;
          color: var(--text-soft);
        }

        .site-footer__bottom {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 0 3rem 2rem;
          font-size: 0.8rem;
          color: rgba(231, 251, 247, 0.74);
        }

        @media (max-width: 960px) {
          .site-footer__intro {
            flex-direction: column;
            align-items: flex-start;
          }

          .site-footer__grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .site-footer {
            padding-bottom: 1.1rem;
          }

          .site-footer__panel {
            border-radius: 1.4rem;
          }

          .site-footer__intro,
          .site-footer__grid,
          .site-footer__bottom {
            padding-left: 1.2rem;
            padding-right: 1.2rem;
          }

          .site-footer__grid {
            padding-bottom: 1.4rem;
          }

          .site-footer__bottom {
            padding-bottom: 1.4rem;
          }
        }
      `}</style>
    </footer>
  );
}
