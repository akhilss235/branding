"use client";

const STATS = [
  { eyebrow: "Up to", value: "5x", label: "CTR" },
  { eyebrow: "Up to", value: "2x", label: "Engagement" },
  { eyebrow: "Up to", value: "+40%", label: "Conversion", wide: true },
//   { eyebrow: "", value: "10x", label: "Awards & Nominations" },
];

export default function Clinet() {
  return (
    <section className="client-proof">
      <div className="client-proof-shell">
        <div className="client-proof-copy">
          <h2>
            Use the power of immersive storytelling
            <br />
            to stand out and impress your clients.
          </h2>
        </div>

        <div className="client-proof-grid">
          {STATS.map((item) => (
            <article
              key={`${item.value}-${item.label}`}
              className={`client-proof-card ${item.wide ? "client-proof-card-wide" : ""}`}
            >
              <p className="client-proof-eyebrow">{item.eyebrow || "\u00A0"}</p>
              <div className="client-proof-value">{item.value}</div>
              <p className="client-proof-label">{item.label}</p>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .client-proof {
          padding: clamp(4rem, 8vw, 7rem) 1rem clamp(4.5rem, 9vw, 7.5rem);
          background:
            radial-gradient(circle at 18% 0%, rgba(190, 185, 222, 0.16), transparent 28%),
            linear-gradient(180deg, #f4f4f7 0%, #efeff4 100%);
          color: #2b2369;
        }

        .client-proof-shell {
          width: min(1680px, 100%);
          margin: 0 auto;
        }

        .client-proof-copy {
          max-width: 1260px;
          padding-left: clamp(0rem, 5vw, 5.4rem);
        }

        .client-proof-copy h2 {
          margin: 0;
          font-size: clamp(2rem, 4.5vw, 4.1rem);
          line-height: 0.98;
          letter-spacing: -0.08em;
          font-weight: 500;
          color: #2b2369;
        }

        .client-proof-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1.8rem;
          padding-top: clamp(3rem, 6vw, 4.5rem);
          padding-left: clamp(0rem, 5vw, 5.4rem);
        }

        .client-proof-card {
          width: min(100%, 205px);
          min-height: 225px;
          padding: 1.7rem 1.85rem 1.5rem;
          border: 1px solid rgba(90, 88, 156, 0.22);
          border-radius: 1.9rem;
          background: rgba(255, 255, 255, 0.16);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .client-proof-card-wide {
          width: min(100%, 335px);
        }

        .client-proof-eyebrow {
          margin: 0 0 0.6rem;
          min-height: 1.6rem;
          font-size: 0.95rem;
          line-height: 1.2;
          color: rgba(43, 35, 105, 0.88);
        }

        .client-proof-value {
          font-size: clamp(3.2rem, 5.8vw, 5rem);
          line-height: 0.88;
          letter-spacing: -0.1em;
          font-weight: 400;
          color: #2b2369;
        }

        .client-proof-label {
          margin: 0.7rem 0 0;
          font-size: 0.98rem;
          line-height: 1.15;
          color: rgba(43, 35, 105, 0.92);
        }

        @media (max-width: 1100px) {
          .client-proof {
            padding: 3.5rem 0.9rem 5rem;
          }

          .client-proof-copy,
          .client-proof-grid {
            padding-left: 0;
          }

          .client-proof-copy {
            max-width: 920px;
          }

          .client-proof-grid {
            gap: 1.2rem;
          }
        }

        @media (max-width: 820px) {
          .client-proof {
            padding: 3rem 0.9rem 4rem;
          }

          .client-proof-copy {
            text-align: center;
          }

          .client-proof-copy h2 {
            font-size: clamp(1.8rem, 6.2vw, 2.9rem);
            line-height: 1.02;
          }

          .client-proof-grid {
            justify-content: center;
            padding-top: 2.2rem;
          }

          .client-proof-card,
          .client-proof-card-wide {
            width: calc(50% - 0.6rem);
            min-width: 240px;
            min-height: 210px;
          }

          .client-proof-value {
            font-size: clamp(3rem, 8.8vw, 4.2rem);
          }
        }

        @media (max-width: 580px) {
          .client-proof {
            padding: 2.4rem 0.75rem 3.2rem;
          }

          .client-proof-copy h2 {
            font-size: clamp(1.5rem, 8vw, 2rem);
            letter-spacing: -0.05em;
          }

          .client-proof-grid {
            gap: 0.95rem;
            padding-top: 1.7rem;
          }

          .client-proof-card,
          .client-proof-card-wide {
            width: 100%;
            min-width: 0;
            min-height: 180px;
            padding: 1.25rem 1.2rem 1.1rem;
            border-radius: 1.4rem;
          }

          .client-proof-eyebrow {
            margin-bottom: 0.35rem;
            min-height: 1.25rem;
            font-size: 0.88rem;
          }

          .client-proof-value {
            font-size: clamp(2.7rem, 15vw, 3.8rem);
          }

          .client-proof-label {
            margin-top: 0.45rem;
            font-size: 0.92rem;
          }
        }
      `}</style>
    </section>
  );
}
