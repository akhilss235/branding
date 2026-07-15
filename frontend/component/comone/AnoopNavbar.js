"use client";

import { useEffect, useState } from "react";
import styles from "./AnoopNavbar.module.css";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function AnoopNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = isOpen ? "hidden" : "";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <header className={styles.akNav}>
        {/* <div className={`${styles.akRail} ${styles.akRailTop}`} /> */}

        <div className={styles.akShell}>
  <a href="/" className={styles.akBrand} aria-label="Anoop Krishna home">
            <span className={styles.akBrandRing} aria-hidden="true" />
            <span className={styles.akBrandWordmark}>
              <span>Anoop</span>
              <span>Krishna</span>
            </span>
          </a>
          
          {/* <div className={styles.akStatus}>
            <span className={styles.akStatusGlow} aria-hidden="true" />
            <div className={styles.akStatusCopy}>
              <span className={styles.akStatusLabel}>ON</span>
              <span className={styles.akStatusBars} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
          </div> */}

        

          <div className={styles.akActions}>
            <button
              type="button"
              className={`${styles.akMenuTrigger} ${isOpen ? styles.akMenuTriggerOpen : ""}`}
              onClick={() => setIsOpen((current) => !current)}
              aria-expanded={isOpen}
              aria-controls="ak-nav-drawer"
            >
              <span className={styles.akMenuGrid} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className={styles.akMenuLabel}>Menu</span>
            </button>

            <a className={styles.akContact} href="#contact">
              Contact
            </a>
          </div>
        </div>

        <div
          className={`${styles.akDrawerWrap} ${isOpen ? styles.isOpen : ""}`}
          aria-hidden={!isOpen}
        >
          <button
            type="button"
            className={styles.akBackdrop}
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          />

          <nav
            id="ak-nav-drawer"
            className={styles.akDrawer}
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={styles.akDrawerLink}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
