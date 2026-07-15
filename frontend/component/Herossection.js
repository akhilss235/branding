"use client";

import Image from "next/image";
import "./Herossection.css";
import Fish from "../app/Particles/Fish";
import Schoolofherring from "../app/Particles/School_of_herring";


const HERO_STATS = [
  {
    value: "10+",
    label: "Years Experience",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l2.7 5.46 6.03.88-4.36 4.25 1.03 6.01L12 16.77 6.6 19.6l1.03-6.01-4.36-4.25 6.03-.88L12 3z" />
      </svg>
    ),
  },
  {
    value: "80+",
    label: "Projects Completed",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7.5h16a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a1 1 0 0 1 1-1zm4-3h8l1 2H7l1-2zm-1 8h10" />
      </svg>
    ),
  },
  {
    value: "45+",
    label: "Happy Clients",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm8 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM3.5 19a4.5 4.5 0 0 1 9 0M11.5 19a4.5 4.5 0 0 1 9 0" />
      </svg>
    ),
  },
  {
    value: "12+",
    label: "Industries Served",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 0c2.3 2.3 3.5 5.6 3.5 9S14.3 18.7 12 21m0-18C9.7 5.3 8.5 8.6 8.5 12s1.2 6.7 3.5 9M4 12h16M5.8 7.5h12.4M5.8 16.5h12.4" />
      </svg>
    ),
  },
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
    {
    alt: "swarasaakhi",
    href: "https://swarasaakhi.com/",
    src: "/models/swarasaakhilogo.png",
    width: 150,
    height: 100,
    className: "is-flumen",
  },


    {
    alt: "miscaudible",
    href: "https://www.instagram.com/miscaudible?igsh=MTI3cHl6aHg2c25oOQ==",
    src: "/models/Miscaudiblelogowhite.png",
    width: 150,
    height: 100,
    className: "is-flumen",
  },


    {
    alt: "ananthapuram",
    href: "https://www.instagram.com/aananthapuram?igsh=MXN5dnVxaXhoZ2x5",
    src: "/models/ananthapuram logo final-01.png",
    width: 150,
    height: 100,
    className: "is-flumen",
  },




];
const BRAND_LOGO_SLIDES = [...BRAND_LOGOS, ...BRAND_LOGOS];

export default function Herossection() {
  return (
    <>
      <section className="underwater-hero" id="hero">
        <div className="underwater-hero__fish-stage" aria-hidden="true">
          <Fish />
        </div>

        <div >


        <div className="underwater-hero__fish-stage" aria-hidden="true">
<Schoolofherring />

{/* <Schooloffish /> */}
        </div>



        </div>

        <div className="underwater-hero__content">
          <div className="underwater-hero__copy">
            <p className="underwater-hero__intro">Hi there! this is</p>
            <p className="underwater-hero__name">Anoop Krishna</p>

            <h1 className="underwater-hero__headline">
              <span>Creative</span>
              <span>Systems</span>
              <span className="underwater-hero__headline-accent">With Depth</span>
            </h1>

            <div className="underwater-hero__divider" />

            <p className="underwater-hero__role">
              Founder &amp; CEO {"\u00b7"} Creative Systems Architect
            </p>

            <p className="underwater-hero__description">
              Helping businesses move from being seen to being chosen through
              Brand Systems, Experience Design and Sonic Direction.
            </p>

            <div className="underwater-hero__brands" aria-label="Brand logos">
              <div className="underwater-hero__brands-viewport">
                <div className="underwater-hero__brands-track">
                  {BRAND_LOGO_SLIDES.map((logo, index) => (
                    <a
                      key={`${logo.alt}-${index}`}
                      href={logo.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={logo.alt}
                      className="underwater-hero__brand-link"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.width}
                        height={logo.height}
                        className={`underwater-hero__brand-image ${logo.className}`}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
{/* 
            <div className="underwater-hero__stats">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="underwater-hero__stat">
                  <span className="underwater-hero__stat-icon" aria-hidden="true">
                    {stat.icon}
                  </span>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div> */}

          </div>

          <div className="underwater-hero__visual">
            <div className="underwater-hero__portrait-frame">
              <div className="underwater-hero__portrait-glow" />
              <Image
                src="/models/ANOOP PHOTO 1 copy.png"
                alt="Anoop Krishna portrait"
                fill
                priority
                className="underwater-hero__portrait-image"
                sizes="(max-width: 1180px) 90vw, 38vw"
              />
            </div>

            <div className="underwater-hero__quote">
              <span className="underwater-hero__quote-mark">&ldquo;</span>
              <p>
                I craft systems that connect brands with people with depth and
                intention.
              </p>
              <span className="underwater-hero__quote-line" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
