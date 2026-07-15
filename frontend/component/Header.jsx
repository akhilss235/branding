"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Toggler from "../component/comone/Toggler";

const NAV_ITEMS = [
  { label: "Home", href: "#hero", targetId: "hero" },
  { label: "About", href: "#about", targetId: "about" },
  { label: "Profile", href: "/profile.html" },
  { label: "Work", href: "#work", targetId: "work" },
  // { label: "Frameworks", href: "#frameworks", targetId: "frameworks" },
  // { label: "Speaking", href: "#speaking", targetId: "speaking" },
  { label: "Contact", href: "#contact", targetId: "contact" },
];

const COPY_EMAIL = "Anoop@gmail.com";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].targetId);

  useEffect(() => {
    const tongue = document.querySelector(".tonguebar");
    const topbar = document.querySelector(".topbar");

    const syncHeaderState = () => {
      if (tongue && topbar) {
        if (window.scrollY > 120) {
          tongue.classList.add("show");
          topbar.classList.add("hide");
        } else {
          tongue.classList.remove("show");
          topbar.classList.remove("hide");
        }
      }

      const viewportLine = window.scrollY + window.innerHeight * 0.35;
      let nextSection = NAV_ITEMS[0].targetId;

      NAV_ITEMS.forEach(({ targetId }) => {
        if (!targetId) return;

        const section = document.getElementById(targetId);
        if (section && viewportLine >= section.offsetTop) {
          nextSection = targetId;
        }
      });

      setActiveSection((currentSection) =>
        currentSection === nextSection ? currentSection : nextSection
      );
    };

    window.addEventListener("scroll", syncHeaderState, { passive: true });
    window.addEventListener("resize", syncHeaderState);
    syncHeaderState();

    return () => {
      window.removeEventListener("scroll", syncHeaderState);
      window.removeEventListener("resize", syncHeaderState);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDrawerOpen]);

  const isActiveItem = (item) =>
    Boolean(item.targetId) && activeSection === item.targetId;

  const handleDrawerClose = () => setIsDrawerOpen(false);

  const copyEmail = async () => {
    if (!navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(COPY_EMAIL);
    } catch {
      // Ignore clipboard failures silently.
    }
  };

  return (
    <>
      <div
        id="drawer"
        className={`drawer ${isDrawerOpen ? "open" : ""}`}
        aria-hidden={!isDrawerOpen}
      >
        <div
          className="backdrop"
          data-close
          onClick={handleDrawerClose}
        ></div>

        <div className="panel">
          <div className="drawerHeader">
            <a href="#hero" className="brand-mark" onClick={handleDrawerClose}>
              <div className="iconimg">
                <span>
                  <Image src="/models/icons.png" alt="" width={48} height={48} />
                </span>
              </div>
              <div className="brand-text-main">Anoop Krishna V</div>
            </a>

            <button
              id="closeDrawer"
              type="button"
              onClick={handleDrawerClose}
              aria-label="Close navigation menu"
            >
              x
            </button>
          </div>

          <div className="drawerBody">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={handleDrawerClose}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="ctaMobile">
            <button className="btn outline" type="button" onClick={copyEmail}>
              Copy Email
            </button>
            <a className="btn primary" href="#contact" onClick={handleDrawerClose}>
              Get Started
            </a>
          </div>
        </div>
      </div>

      <header className="mainHeader">
        <div className="topbar">
          <div className="nav">
            <a href="#hero" className="brand-mark">
              <div className="iconimg">
                <span>
                  <Image src="/models/icons.png" alt="" width={48} height={48} />
                </span>
              </div>
              <div className="brand-text-main">Anoop Krishna</div>
            </a>

            <div className="topbar-toggle-wrap">
              <Toggler
                checked={isDrawerOpen}
                onChange={(event) => setIsDrawerOpen(event.target.checked)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* <div className="tonguebar">
        <div className="tongue-inner">
          <a href="#hero" className="brand-mark">
            <div className="iconimg">
              <span>
                <Image src="/models/icons.png" alt="" width={48} height={48} />
              </span>
            </div>
            <div className="brand-text-main">Anoop Krishna</div>
          </a>

          <nav className="navlinks" aria-label="Section shortcuts">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={isActiveItem(item) ? "is-active" : ""}
                aria-current={isActiveItem(item) ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button className="copyemail" type="button" onClick={copyEmail}>
            Copy Email
          </button>
        </div>
      </div> */}

      <style jsx global>{`
        .mainHeader {
          position: fixed;
          left: 0;
          right: 0;
          z-index: 30;
          pointer-events: none;
        }

        .topbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 40;
          padding-top: 0.7rem;
          background: transparent;
          pointer-events: auto;
          transition:
            opacity 0.4s ease,
            transform 0.4s ease;
        }

        .topbar.hide {
          opacity: 0;
          transform: translateY(-30px);
          pointer-events: none;
        }

        .nav {
          max-width: 2400px;
          margin: 0 auto;
          padding: 0.4rem clamp(1rem, 3vw, 2.25rem);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .topbar-toggle-wrap {
          display: none;
          align-items: center;
        }

        .brand-mark {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          color: inherit;
          text-decoration: none;
        }

        .iconimg {
          display: block;
          width: 3rem;
          height: 3rem;
          flex: 0 0 3rem;
        }

        .iconimg img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .brand-text-main {
          font-family: var(--font-montserrat), sans-serif;
          font-size: 1.5rem;
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.02em;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 1px 10px rgba(0, 0, 0, 0.25);
        }

        .navlinks {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 1rem;
        }

        .navlinks a {
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none;
          font-size: 0.86rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: color 0.25s ease;
        }

        .navlinks a:hover,
        .navlinks a.is-active {
          color: #ffffff;
        }

        .btn {
          padding: 14px;
          border-radius: 14px;
          font-size: 15px;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }

        .btn.outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #fff;
        }

        .btn.primary {
          background: #ffffff;
          color: #07111d;
        }

        .tonguebar {
          position: fixed;
          top: 15px;
          left: 0;
          right: 0;
          z-index: 999;
          display: flex;
          justify-content: center;
          opacity: 0;
          transform: translateY(-120%);
          pointer-events: none;
          transition:
            transform 0.45s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.35s ease;
        }

        .tonguebar.show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .tongue-inner {
          width: min(1500px, calc(100% - 42px));
          min-height: 78px;
          padding: 0.9rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .copyemail {
          padding: 0.8rem 1.1rem;
          border-radius: 999px;
          border: none;
          background: #fff;
          color: #07111d;
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .drawer {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: none;
        }

        .drawer.open {
          display: block;
        }

        .backdrop {
          position: absolute;
          inset: 0;
          background: rgba(4, 13, 22, 0.84);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .panel {
          position: fixed;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(7, 22, 35, 0.98), rgba(4, 11, 18, 0.98));
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .drawerHeader {
          padding: 1.25rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        #closeDrawer {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 999px;
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.22);
          font-size: 1rem;
        }

        .drawerBody {
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .drawerBody a {
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #fff;
          text-decoration: none;
          text-transform: uppercase;
        }

        .ctaMobile {
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
        }

        @media (max-width: 1700px) {
          .nav {
            max-width: 2000px;
            padding: 0.3rem clamp(1rem, 2.2vw, 1.75rem);
          }

          .brand-mark {
            gap: 0.45rem;
          }

          .iconimg {
            width: 2.7rem;
            height: 2.7rem;
            flex-basis: 2.7rem;
          }

          .brand-text-main {
            font-size: 1.25rem;
          }

          .tongue-inner {
            width: min(1320px, calc(100% - 54px));
            min-height: 70px;
            padding: 0.75rem 1.2rem;
            gap: 1.1rem;
          }

          .navlinks {
            gap: 0.8rem;
          }

          .navlinks a {
            font-size: 0.78rem;
            letter-spacing: 0.14em;
          }

          .copyemail {
            padding: 0.72rem 1rem;
            font-size: 0.82rem;
          }
        }

        @media (max-width: 1200px) {
          .tongue-inner {
            width: min(100%, calc(100% - 24px));
            padding: 0.85rem 1rem;
            gap: 1rem;
          }

          .navlinks {
            gap: 0.7rem;
          }

          .navlinks a {
            font-size: 0.74rem;
            letter-spacing: 0.12em;
          }

          .copyemail {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .topbar-toggle-wrap {
            display: flex;
          }

          .tonguebar {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .topbar {
            padding-top: 0.55rem;
          }

          .nav {
            padding: 0.35rem 1rem;
          }

          .brand-text-main {
            font-size: 0.95rem;
          }

          .iconimg {
            width: 2.5rem;
            height: 2.5rem;
            flex-basis: 2.5rem;
          }

          .ctaMobile {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
