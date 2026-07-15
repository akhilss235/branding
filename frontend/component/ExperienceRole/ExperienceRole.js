"use client";

import { motion, useReducedMotion } from "framer-motion";

const roleCards = [
  {
    title: "FLUMENX",
    tag: "Studio",
    roleLine: "Founder / Creative Systems / Brand Direction",
    description:
      "Built a practice focused on turning brand intent into scalable execution systems, templates, libraries, and production pipelines that keep creative consistent across teams and channels.",
    detailBlocks: [
      {
        label: "Deliverables",
        value: "Brand systems, playbooks, campaign frameworks.",
      },
      {
        label: "Outcome",
        value: "Faster production, cleaner decisions, clearer story.",
      },
    ],
  },
  {
    title: "Misc Archive",
    tag: "Archive",
    roleLine: "Founder / Curation / Story & Craft",
    description:
      "A living archive for collecting visual, sonic, and conceptual patterns, so creative direction is never built from scratch but from a deliberate library of references and principles.",
    chips: [
      "Curation",
      "Taste systems",
      "Reference libraries",
      "Story patterns",
    ],
  },
  {
    title: "Sound Engineering",
    tag: "Audio",
    roleLine: "Recording / Post / Mix / Master",
    description:
      "Sound is strategy: attention, emotion, memory. I treat audio like a brand asset that is repeatable, intentional, and measurable in impact.",
    detailBlocks: [
      {
        label: "Approach",
        value: "Sonic palette to mix language to delivery.",
      },
      {
        label: "Favorite work",
        value: "Cinematic textures, minimal but deep spaces.",
      },
    ],
  },
  {
    title: "Diving",
    tag: "Fieldcraft",
    roleLine: "Certified Diver / Ocean discipline",
    description:
      "Diving trained my design instincts: pre-briefs, checklists, calm under pressure, and navigation by fundamentals. That is exactly how good creative operations should feel.",
    chips: ["Preparation", "Risk control", "Navigation", "Composure"],
  },
];

export default function ExperienceRole() {
  const prefersReducedMotion = useReducedMotion();
  const easing = [0.22, 1, 0.36, 1];
  const viewport = { once: true, amount: 0.22 };

  const getRevealProps = (delay = 0, distance = 32) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: distance },
          whileInView: { opacity: 1, y: 0 },
          viewport,
          transition: { duration: 0.82, delay, ease: easing },
        };

  return (
    <section id="experience" className="py-16 sm:py-20">
      <div className="container">
        <div className="grid gap-4 lg:grid-cols-2">
          {roleCards.map((card, index) => (
            <motion.article
              key={card.title}
              className="cardy flex h-full flex-col p-6 sm:p-7"
              {...getRevealProps(0.08 + Math.min(index * 0.08, 0.24), 40)}
            >
              <div className="flex items-start justify-between gap-3">
                <div >
                  <h2 className=" checking-card-title text-uppercase">
                    {card.title}
                  </h2>
                  <p className="text-uppercase checking-card-label opacity-75 mt-2 mb-2">{card.roleLine}</p>
                </div>

                <span className="shrink-0  work-story-subtitle">{card.tag}</span>
              </div>

              <p className="mt-5 checking-card-description">
                {card.description}
              </p>

              {card.detailBlocks ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {card.detailBlocks.map((detail) => (
                    <div key={detail.label} className="glass h-full rounded-2xl p-4">
                      <div className="text-sm font-semibold text-white">
                        {detail.label}
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        {detail.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.chips.map((chip) => (
                    <span key={chip} className="pill_about">
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
