"use client";

import "./DigitalServices.css";

const SERVICES = [
  {
    title: "SEO",
    copy:
      "Advanced search optimization that moves the needle on organic traffic and high-intent keyword rankings.",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 15.5 10 10.5l3.5 3.5L19 8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 8.5H19v4.5"
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
    title: "PPC Advertising",
    copy:
      "Data-driven paid media campaigns across Google, Meta, and LinkedIn designed for maximum ROI and conversion.",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle
          cx="11"
          cy="11"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="11" cy="11" r="2.2" fill="currentColor" />
        <path
          d="M16 16l3 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M11 5v3m3 3h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Content Strategy",
    copy:
      "Crafting compelling narratives that resonate with your audience and establish undeniable industry authority.",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M8 4h6l4 4v12H8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 4v4h4M10 12h6M10 16h6"
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
    title: "Social Media Handling",
    copy:
      "End-to-end social media management covering content planning, publishing, audience engagement, and consistent brand presence across platforms.",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 9.5A2.5 2.5 0 1 1 9.5 7 2.5 2.5 0 0 1 7 9.5ZM17 9.5A2.5 2.5 0 1 1 19.5 7 2.5 2.5 0 0 1 17 9.5ZM12 18a3 3 0 1 1 3-3 3 3 0 0 1-3 3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.2 8.6 10.8 10m2.4 0 1.6-1.4M10.5 14.6 8.8 16m4.7-1.4 1.7 1.4"
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
    title: "Brand Systems",
    singleLineTitle: true,
    copy:
      "Structured identity systems that align messaging, visuals, and touchpoints into one consistent brand experience people can recognize and trust.",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 6h5v5H6zm7 0h5v5h-5zM6 13h5v5H6zm7 2.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
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
    title: "ARK Tech",
    singleLineTitle: true,
    copy:
      "Technology-led digital solutions that connect strategy, automation, and execution to build smarter marketing systems at scale.",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3v4m0 10v4M3 12h4m10 0h4M6.3 6.3l2.8 2.8m5.8 5.8 2.8 2.8m0-11.4-2.8 2.8m-5.8 5.8-2.8 2.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },

];

export default function DigitalServices() {
  return (
    <section className="digital-services">
      <div className="digital-services__container">
        <p className="digital-services__eyebrow">EXPERTISE</p>
        <h2 className="digital-services__title">Digital Marketing Services</h2>
        <p className="digital-services__lead">
          Precision-engineered strategies to accelerate your brand&apos;s digital growth and
          market dominance.
        </p>

        <div className="digital-services__grid">
          {SERVICES.map((service) => (
            <article key={service.title} className="digital-services__card">
              <div className="digital-services__icon-wrap">{service.icon}</div>
              <h3
                className={`digital-services__card-title${service.singleLineTitle ? " digital-services__card-title--single" : ""}`}
              >
                {service.title}
              </h3>
              <p className="digital-services__card-copy">{service.copy}</p>
              <a href={service.href} className="digital-services__link">
                Learn More <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
