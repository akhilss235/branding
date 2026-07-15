"use client";

import "./SocialPresence.css";

const PLATFORMS = [
  {
    name: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M15 8.5h-1.7c-.9 0-1.3.42-1.3 1.26V12H15l-.45 2.6H12v4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="7.2" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8 10.2v5.3M8 8.4h.01M11.5 15.5v-3.1c0-1.4.84-2.4 2.12-2.4 1.25 0 1.88.9 1.88 2.4v3.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Twitter/X",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 5h10M7 12h10M7 19h10M9 3l-2 18M17 3l-2 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function TrendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 15.5 10.2 12.3l2.2 2.2 4.6-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9.5h3.5V13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SocialPresence() {
  return (
    <section className="social-presence">
      <div className="social-presence__container">
        <div className="social-presence__visual" aria-hidden="true">
          <div className="social-presence__frame">
            <div className="social-presence__screen">
              <div className="social-presence__toolbar">
                <div className="social-presence__brand">
                  <span className="social-presence__brand-mark">Q</span>
                  QUANTUM
                </div>
                <div className="social-presence__toolbar-nav">
                  <span>Dashboard</span>
                  <span>Analytics</span>
                  <span>Campaigns</span>
                  <span>Audience</span>
                  <span>Reports</span>
                </div>
                {/* <div className="social-presence__toolbar-user" /> */}
              </div>

              <div className="social-presence__body">
                <p className="social-presence__body-title">SOCIAL MEDIA PERFORMANCE OVERVIEW</p>

                <div className="social-presence__stats">
                  <div className="social-presence__stat">
                    <p className="social-presence__stat-label">Reach</p>
                    <span className="social-presence__stat-value">1.2M</span>
                    <span className="social-presence__stat-trend">+15.3%</span>
                  </div>
                  <div className="social-presence__stat">
                    <p className="social-presence__stat-label">Engagement</p>
                    <span className="social-presence__stat-value">4.8%</span>
                    <span className="social-presence__stat-trend">+8.9%</span>
                  </div>
                  <div className="social-presence__stat">
                    <p className="social-presence__stat-label">Followers</p>
                    <span className="social-presence__stat-value">89,543</span>
                    <span className="social-presence__stat-trend">+12%</span>
                  </div>
                  <div className="social-presence__stat">
                    <p className="social-presence__stat-label">Conversions</p>
                    <span className="social-presence__stat-value">147</span>
                    <span className="social-presence__stat-trend">+5.6%</span>
                  </div>
                </div>

                <div className="social-presence__chart">
                  <div className="social-presence__chart-main">
                    <div className="social-presence__chart-grid" />
                    <svg viewBox="0 0 420 180" preserveAspectRatio="none">
                      <path
                        d="M0 122 C32 108, 58 132, 90 118 S150 96, 184 104 244 126, 282 112 336 88, 420 96"
                        fill="none"
                        stroke="#1f8f5a"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0 142 C30 130, 64 150, 96 138 S154 126, 190 132 246 144, 286 136 342 118, 420 124"
                        fill="none"
                        stroke="#93d8b0"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="social-presence__chart-side">
                    <div className="social-presence__mini-card">
                      <span className="social-presence__mini-label">Growth</span>
                      <span className="social-presence__mini-value">+18%</span>
                      <div className="social-presence__mini-bars">
                        <span style={{ height: "45%" }} />
                        <span style={{ height: "70%" }} />
                        <span style={{ height: "58%" }} />
                        <span style={{ height: "82%" }} />
                        <span style={{ height: "66%" }} />
                      </div>
                    </div>

                    <div className="social-presence__mini-card">
                      <span className="social-presence__mini-label">Top Channel</span>
                      <span className="social-presence__mini-value">Instagram</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

   
        </div>

        <div className="social-presence__content">
          <p className="social-presence__eyebrow">Social Presence</p>
          <h2 className="social-presence__title">Dominate the Social Landscape</h2>
          <p className="social-presence__lead">
            We don&apos;t just post; we cultivate communities. Our holistic approach combines
            aesthetic storytelling with rigorous data analysis to ensure your brand stands out
            in the noise.
          </p>

          <div className="social-presence__platforms">
            {PLATFORMS.map((platform) => (
              <div key={platform.name} className="social-presence__platform">
                {platform.icon}
                <span>{platform.name}</span>
              </div>
            ))}
          </div>

          <a href="#contact" className="social-presence__cta">
            Book a Strategy Call
          </a>
        </div>
      </div>
    </section>
  );
}
