"use client";

import { useState } from "react";

const DEPTH_LABELS = {
  10: "Surface Scan",
  20: "Exploratory",
  30: "Focused",
  40: "Deep Mapping",
  50: "Strategy Build",
  60: "Full Immersion",
};

export default function ContactPage() {
  const [depth, setDepth] = useState(20);

  return (
    <section className="container">
      <div className="contact-shell">
        <div className="contact-grid">
          <div>
            <h2 className="display-6 text-uppercase">
              Ready for a <span>deeper dive</span> into your brand?
            </h2>

            <p className="checking-card-description">
              If your brand feels like a <strong>huge body of water with no map</strong>,
              too many ideas, channels, or collaborators, I can help you chart what is
              below the surface and design a route forward. Tell me where you are, what
              currents you are feeling, and how deep you are willing to go.
            </p>

            <p className="contact-note">
              I work best with people who value <strong>clarity, craft, and long-term thinking</strong>.
              If that is you, let&apos;s start with a low-pressure conversation.
            </p>

            {/* <div className="contact-meta-row">
              <span>Direct channel:</span>
              <a href="mailto:hello@anoopkrishna.in">hello@anoopkrishna.in</a>
            </div> */}

            <div className="contact-meta-row">
              <span>Based in:</span>
              <span>Between studios & shorelines (remote-first, timezone flexible)</span>
            </div>
          </div>

          <div>
            <form className="contact-form" autoComplete="on">
              <div className="field-row">
                <div className="form-field" style={{ flex: "1 1 140px" }}>
                  <label className="form-label" htmlFor="name">
                    Name
                    <span>Who&apos;s diving?</span>
                  </label>
                  <input
                    id="name"
                    className="input"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="form-field" style={{ flex: "1 1 160px" }}>
                  <label className="form-label" htmlFor="email">
                    Email
                    <span>Where I can reply</span>
                  </label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="project-type">
                  Project Current
                  <span>What are we navigating?</span>
                </label>
                <select id="project-type" name="project-type" className="select" defaultValue="brand-systems">
                  <option value="brand-systems">Brand systems & narrative architecture</option>
                  <option value="sonic-identity">Sonic identity / sound for brand</option>
                  <option value="film-sound">Film / series sound design & mix</option>
                  <option value="experience">Immersive / spatial experience</option>
                  <option value="consult">Clarity session / consultation</option>
                  <option value="other">Something that doesn&apos;t fit a label yet</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="depth">
                  Desired Depth
                  <span id="depth-label" aria-live="polite">
                    {DEPTH_LABELS[depth]}
                  </span>
                </label>
                <div className="range-wrap">
                  <input
                    id="depth"
                    className="range"
                    type="range"
                    min="10"
                    max="60"
                    step="10"
                    value={depth}
                    onChange={(event) => setDepth(Number(event.target.value))}
                  />
                  <div className="range-label">10 m - 60 m</div>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="message">
                  Notes from the surface
                  <span>Context, links, timelines</span>
                </label>
                <textarea
                  id="message"
                  className="textarea"
                  name="message"
                  placeholder="Tell me about your brand, team, and why now feels like the right moment to dive."
                />
              </div>
              <div className="contact-submit">
                <button type="submit" className="btn-primary">
                  <span>Send dive briefing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-shell {
          padding: clamp(4rem, 8vw, 7rem) 0;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.2fr);
          gap: 2.6rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            max-width: none;
          }
        }

        .contact-note {
          font-size: 1.2rem;
          line-height: 1.8;
          color: var(--text-soft);
          max-width: 35rem;
          margin-bottom: 1.2rem;
        }

        .contact-note strong {
          color: var(--text-main);
          font-weight: 500;
        }

        .contact-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 0.6rem;
    font-size: 1.10rem;
  line-height: 1.65;
          color: var(--text-soft);
        }

        .contact-meta-row a {
          color: var(--accent-soft);
          text-decoration: none;
          border-bottom: 1px dashed rgba(0, 245, 201, 0.5);
        }

        .contact-meta-row a:hover {
          color: var(--accent);
          border-bottom-style: solid;
        }

        .contact-form {
          border-radius: 1.6rem;
          padding: 1.5rem 1.6rem;
          background:
            radial-gradient(circle at 0 0, rgba(0, 245, 201, 0.22), transparent 70%),
            rgba(0, 0, 0, 0.86);
          border: 1px solid rgba(0, 245, 201, 0.3);
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.96);
        }

        .field-row {
          display: flex;
          gap: 0.9rem;
          flex-wrap: wrap;
        }

        .form-field {
          width: 100%;
          margin-bottom: 0.9rem;
        }

        .form-label {
          font-size: 0.86rem;
          line-height: 1.35;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--text-soft);
          margin-bottom: 0.45rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .form-label span {
          font-size: 0.76rem;
          color: rgba(155, 201, 192, 0.8);
          text-align: right;
        }

        .input,
        .textarea,
        .select {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgba(0, 245, 201, 0.35);
          background: rgba(1, 10, 9, 0.96);
          padding: 0.6rem 0.8rem;
          font-size: 0.92rem;
          line-height: 1.4;
          color: var(--text-main);
          font-family: inherit;
          outline: none;
          transition:
            border-color 0.14s ease-out,
            box-shadow 0.14s ease-out,
            background 0.14s ease-out;
        }

        .input::placeholder,
        .textarea::placeholder {
          color: rgba(155, 201, 192, 0.6);
        }

        .textarea {
          min-height: 120px;
          resize: vertical;
        }

        .input:focus,
        .textarea:focus,
        .select:focus {
          border-color: rgba(0, 245, 201, 0.8);
          box-shadow: 0 0 0 1px rgba(0, 245, 201, 0.6), 0 0 22px rgba(0, 245, 201, 0.3);
          background: rgba(2, 19, 17, 0.96);
        }

        .range-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .range {
          appearance: none;
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--accent), var(--gold));
          outline: none;
        }

        .range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #000;
          border: 2px solid var(--accent);
          box-shadow: 0 0 10px rgba(0, 245, 201, 0.7);
          cursor: pointer;
        }

        .range::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #000;
          border: 2px solid var(--accent);
          box-shadow: 0 0 10px rgba(0, 245, 201, 0.7);
          cursor: pointer;
        }

        .range-label {
          font-size: 0.78rem;
          color: var(--text-soft);
          min-width: 95px;
          white-space: nowrap;
        }

        .contact-submit {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          border: 1px solid rgba(0, 245, 201, 0.45);
          border-radius: 999px;
          padding: 0.9rem 1.2rem;
          background: linear-gradient(135deg, rgba(0, 245, 201, 0.16), rgba(0, 245, 201, 0.05));
          color: var(--text-main);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition:
            transform 0.16s ease,
            box-shadow 0.16s ease,
            border-color 0.16s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          border-color: rgba(0, 245, 201, 0.75);
          box-shadow: 0 16px 30px rgba(0, 245, 201, 0.12);
        }

        @media (max-width: 700px) {
          .contact-shell {
            padding: 5rem 0 3rem;
          }

          .contact-grid {
            gap: 1.6rem;
          }

          .contact-note {
            max-width: none;
            font-size: 0.98rem;
            line-height: 1.7;
          }

          .contact-meta-row {
            display: grid;
            gap: 0.2rem;
            font-size: 0.96rem;
            line-height: 1.5;
          }

          .contact-form {
            border-radius: 1.25rem;
            padding: 1.25rem;
          }

          .field-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
          }

          .form-field {
            margin-bottom: 1rem;
          }

          .form-label {
            display: grid;
            justify-content: stretch;
            gap: 0.2rem;
            font-size: 0.78rem;
            letter-spacing: 0.12em;
          }

          .form-label span {
            font-size: 0.68rem;
            line-height: 1.4;
            text-align: left;
          }

          .input,
          .textarea,
          .select {
            min-height: 3.1rem;
            padding: 0.78rem 0.9rem;
            font-size: 0.92rem;
          }

          .select {
            text-overflow: ellipsis;
          }

          .range-wrap {
            align-items: flex-start;
            flex-direction: column;
            gap: 0.7rem;
          }

          .range-label {
            min-width: 0;
            font-size: 0.82rem;
          }

          .textarea {
            min-height: 145px;
          }

          .contact-submit {
            justify-content: stretch;
          }

          .btn-primary {
            width: 100%;
            justify-content: center;
            padding: 0.95rem 1rem;
            font-size: 0.76rem;
            letter-spacing: 0.14em;
          }
        }

        @media (max-width: 380px) {
          .contact-form {
            padding: 1rem;
          }

          .btn-primary {
            font-size: 0.72rem;
            letter-spacing: 0.1em;
          }
        }

      `}</style>
    </section>
  );
}
