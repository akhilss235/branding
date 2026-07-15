"use client";
import { motion } from "framer-motion";
import ScrollReveal from './ScrollReveal';

export default function About() {
  return (
    <div className="container">
      <section className="aboutSection">
        <main className="aboutShell">
          {/* LEFT */}
          <motion.section
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85 }}
            className="leftPanel"
          >
            <div className="identityBlock">
              <h1 className="title">
                <ScrollReveal as="span" textAs="span" baseOpacity={0.1} enableBlur baseRotation={3} blurStrength={4}>
                  Anoop
                </ScrollReveal>
                <ScrollReveal as="span" textAs="span" baseOpacity={0.1} enableBlur baseRotation={3} blurStrength={4}>
                  Krishna
                </ScrollReveal>
              </h1>
              <ScrollReveal as="p" textAs="span" containerClassName="role" baseOpacity={0.1} enableBlur baseRotation={3} blurStrength={4}>
                Web Developer / Designer
              </ScrollReveal>
            </div>

            <div className="emailBox">
              <p>For business inquiries, email me at</p>
              <a href="mailto:kento9941@gmail.com">Anoop@gmail.com</a>
            </div>
          </motion.section>

          {/* DIVIDER */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.05 }}
            className="dividerWrapper"
          >
            <div className="divider" />
          </motion.div>

          {/* RIGHT */}
          <motion.section
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.95, delay: 0.2 }}
            className="rightPanel"
          >
            <div className="about">
              <ScrollReveal baseOpacity={0.1} enableBlur baseRotation={3} blurStrength={4}>
                I am currently in my final year of Bachelor of Information Technology.
              </ScrollReveal>

              <ScrollReveal baseOpacity={0.1} enableBlur baseRotation={3} blurStrength={4}>
                My main focus is web development and creating full-stack projects.
              </ScrollReveal>

              <ScrollReveal baseOpacity={0.1} enableBlur baseRotation={3} blurStrength={4}>
                I enjoy exploring new technologies and experimenting with creative ideas.
              </ScrollReveal>

              <a href="/profile.html">
                <button className="aboutBtn">About Me</button>
              </a>
            </div>
          </motion.section>
        </main>
      </section>
    </div>
  );
}
