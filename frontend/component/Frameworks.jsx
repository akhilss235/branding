"use client";

export default function Frameworks() {
  return  (
    <section className="py-5 py-lg-6">
      <div className="container">

        {/* Header */}
        <div className="col-lg-7">


          <h2 className="fw-semibold display-6">
            Systems I build with
          </h2>

          <p className="text-white-50 mt-2">
            Reusable frameworks that reduce decision fatigue, align teams,
            and maintain quality as brands scale.
          </p>
        </div>

        {/* Cards */}
        <div className="row g-4 mt-4">

          {/* Card 1 */}
          <div className="col-lg-4">
            <article className="glassframeworks p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-semibold mb-0">The Depth Map</h5>
                <span className="mono small px-2 py-1 border border-white-10 rounded text-white-50">
                  D1
                </span>
              </div>

              <p className="text-white-50 small mt-3">
                A diagnostic system that converts scattered inputs into
                a single strategic map ranked by leverage.
              </p>

              <div className="row g-2 mt-3 small text-white-50">
                <div className="col-6"><div className="glassframeworks-soft p-3">Audit → priorities</div></div>
                <div className="col-6"><div className="glassframeworks-soft p-3">Gaps → actions</div></div>
                <div className="col-6"><div className="glassframeworks-soft p-3">Risks → mitigation</div></div>
                <div className="col-6"><div className="glassframeworks-soft p-3">Cadence → momentum</div></div>
              </div>
            </article>
          </div>

          {/* Card 2 */}
          <div className="col-lg-4">
            <article className="glassframeworks p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-semibold mb-0">Signal → Story</h5>
                <span className="mono small px-2 py-1 border border-white-10 rounded text-white-50">
                  S2
                </span>
              </div>

              <p className="text-white-50 small mt-3">
                Turns raw expertise into a narrative engine with pillars,
                proof, and repeatable formats that compound.
              </p>

              <ul className="list-unstyled small text-white-50 mt-3 mb-0">
                <li className="d-flex gap-2"><span className="text-turq">•</span>3–5 core pillars</li>
                <li className="d-flex gap-2"><span className="text-turq">•</span>Proof & example library</li>
                <li className="d-flex gap-2"><span className="text-turq">•</span>Editorial pipeline</li>
              </ul>
            </article>
          </div>

          {/* Card 3 */}
          <div className="col-lg-4">
            <article className="glassframeworks p-4 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-semibold mb-0">Creative Ops Kit</h5>
                <span className="mono small px-2 py-1 border border-white-10 rounded text-white-50">
                  C0
                </span>
              </div>

              <p className="text-white-50 small mt-3">
                A lightweight operating system that keeps creative delivery
                calm even under pressure.
              </p>

              <div className="d-flex flex-wrap gap-2 mt-3 small">
                <span className="glassframeworks-soft px-3 py-2">Brief templates</span>
                <span className="glassframeworks-soft px-3 py-2">Checklists</span>
                <span className="glassframeworks-soft px-3 py-2">Handoffs</span>
                <span className="glassframeworks-soft px-3 py-2">Versioning</span>
              </div>
            </article>
          </div>

        </div>

        {/* CTA */}
        <div className="glassframeworks p-4 mt-5 d-flex flex-column flex-lg-row gap-4 align-items-start align-items-lg-center justify-content-between">
          <div>
            <h6 className="fw-semibold mb-1">Want a tailored framework?</h6>
            <p className="text-white-50 small mb-0">
              I’ll convert your context into a depth map and a 30-day system blueprint.
            </p>
          </div>

          <div className="d-flex gap-3">
            <a href="#contact" className="btn bg-turq text-dark fw-semibold px-4 py-2 rounded-4">
              Request Blueprint
            </a>
            <a href="#work" className="btn btn-outline-light px-4 py-2 rounded-4">
              View Work
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
