"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const FULL_OPEN_CONTENT = {
  title: "Experience & roles",
  label: "Creative direction / brand systems / execution",
  statement:
    "I build brand worlds, launch systems, and production flows that stay clear, elegant, and consistent from concept to final delivery.",
  supporting:
    "Strategy-led thinking with hands-on craft across storytelling, identity, systems, and rollout.",
};

export default function ExperienceSection() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const sectionBackground = `
    linear-gradient(
      90deg,
      rgba(4, 15, 12, 0.92) 0%,
      rgba(4, 15, 12, 0.65) 30%,
      rgba(4, 15, 12, 0.35) 56%,
      rgba(4, 15, 12, 0.9) 100%
    ),
    radial-gradient(circle at 73% 22%, rgba(13, 110, 102, 0.35), transparent 0%),
    radial-gradient(circle at 40% 58%, rgba(13, 110, 102, 0.28), transparent 28%)
  `;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    const ensurePlayback = () => {
      const playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    ensurePlayback();
    video.addEventListener("loadedmetadata", ensurePlayback);
    video.addEventListener("canplay", ensurePlayback);

    return () => {
      video.removeEventListener("loadedmetadata", ensurePlayback);
      video.removeEventListener("canplay", ensurePlayback);
    };
  }, []);

  // Intro fades out sooner
  const introOpacity = useTransform(scrollYProgress, [0, 0.15, 0.28], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.28], [0, -52]);

  // Overlay content reveals in sync with faster frame
  const fullOpenOverlayOpacity = useTransform(
    scrollYProgress,
    [0.42, 0.56, 0.72],
    [0, 0.7, 1]
  );
  const fullOpenOverlayY = useTransform(scrollYProgress, [0.42, 0.62], [36, 0]);
  const dividerOpacity = useTransform(scrollYProgress, [0.44, 0.58], [0, 0.85]);
  const dividerScaleX = useTransform(scrollYProgress, [0.44, 0.62], [0.16, 1]);

  // Cinematic shade and vignette sync with frame expansion
  const cinematicShadeOpacity = useTransform(scrollYProgress, [0.08, 0.55], [0.9, 0.6]);
  const vignetteOpacity = useTransform(scrollYProgress, [0.08, 0.55], [0.7, 0.4]);

  // Frame expands faster — reaches full screen at 0.55 instead of 0.74
  const frameTopDesktop = useTransform(scrollYProgress, [0.08, 0.55], ["15%", "0%"]);
  const frameLeftDesktop = useTransform(scrollYProgress, [0.08, 0.55], ["45%", "0%"]);
  const frameWidthDesktop = useTransform(scrollYProgress, [0.08, 0.55], ["50%", "100%"]);
  const frameHeightDesktop = useTransform(scrollYProgress, [0.08, 0.55], ["70%", "100%"]);

  const frameTopMobile = useTransform(scrollYProgress, [0.08, 0.55], ["46%", "0%"]);
  const frameLeftMobile = useTransform(scrollYProgress, [0.08, 0.55], ["5%", "0%"]);
  const frameWidthMobile = useTransform(scrollYProgress, [0.08, 0.55], ["90%", "100%"]);
  const frameHeightMobile = useTransform(scrollYProgress, [0.08, 0.55], ["48%", "100%"]);

  const frameRadius = useTransform(scrollYProgress, [0.08, 0.55], ["24px", "0px"]);

  const activeFrameTop = isMobile ? frameTopMobile : frameTopDesktop;
  const activeFrameLeft = isMobile ? frameLeftMobile : frameLeftDesktop;
  const activeFrameWidth = isMobile ? frameWidthMobile : frameWidthDesktop;
  const activeFrameHeight = isMobile ? frameHeightMobile : frameHeightDesktop;

  return (
    <section
      ref={containerRef}
      className="relative isolate h-[180vh]"
      style={{ background: sectionBackground }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: sectionBackground, minHeight: "100svh" }}
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <motion.div
            className="absolute left-[-6rem] top-12 h-56 w-56 rounded-full blur-3xl sm:h-72 sm:w-72"
            style={{ opacity: introOpacity }}
          />
          <motion.div
            className="absolute right-[-7rem] top-20 h-72 w-72 rounded-full blur-3xl sm:h-96 sm:w-96"
            style={{ opacity: introOpacity, background: "rgba(223, 213, 198, 0.72)" }}
          />
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-start lg:justify-center px-6 sm:px-10 xl:px-16 pointer-events-none">
          <div className="mx-auto w-full max-w-[1440px]">
            <motion.div
              style={{ opacity: introOpacity, y: introY }}
              className="max-w-[28rem] mt-[12vh] lg:mt-0 pt-2 pointer-events-auto"
            >
              <div className="flex flex-col gap-4">
                <h2 className="text-[clamp(1.8rem,2.5vw,3rem)] font-light leading-[1.1] tracking-[-0.04em] text-[#59524c] uppercase">
                  Experience & roles
                </h2>
                <p className="text-pretty text-[clamp(1.1rem,1.2vw,1.5rem)] font-light leading-[1.4] tracking-[-0.02em] text-[#59524c]">
                  I operate at the intersection of founder-level thinking and hands-on craft.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          style={{
            top: activeFrameTop,
            left: activeFrameLeft,
            width: activeFrameWidth,
            height: activeFrameHeight,
            borderRadius: frameRadius,
          }}
          className="absolute z-20 overflow-hidden pointer-events-auto bg-[#d6cbbb] shadow-[0_28px_80px_rgba(70,52,35,0.16)]"
        >
          <video
            ref={videoRef}
            className="absolute inset-0 block h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Anoop Krishna portrait video"
          >
            <source src="/models/anoop.mp4" type="video/mp4" />
          </video>

          <motion.div
            className="absolute inset-0"
            style={{ opacity: cinematicShadeOpacity }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5, 8, 11, 0.38) 0%, rgba(5, 8, 11, 0.16) 28%, rgba(5, 8, 11, 0.18) 68%, rgba(5, 8, 11, 0.42) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(7, 10, 12, 0.5) 0%, rgba(7, 10, 12, 0.12) 28%, rgba(7, 10, 12, 0.12) 72%, rgba(7, 10, 12, 0.48) 100%)",
              }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            style={{ opacity: vignetteOpacity }}
            aria-hidden="true"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.04), transparent 30%), radial-gradient(circle at 84% 22%, rgba(255, 255, 255, 0.08), transparent 18%)",
              }}
            />
          </motion.div>

          <div className="absolute inset-0 z-30 flex items-center px-6 sm:px-10 xl:px-16 pointer-events-none">
            <div className="mx-auto w-full max-w-[1440px]">
              <motion.div
                style={{ opacity: fullOpenOverlayOpacity, y: fullOpenOverlayY }}
                className="w-full"
              >
                <motion.div
                  style={{ opacity: dividerOpacity, scaleX: dividerScaleX }}
                  className="h-px w-full origin-center bg-white/75 shadow-[0_0_18px_rgba(255,255,255,0.12)]"
                />

                <div className="mt-5 grid gap-6 text-white lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-14">
                  <div className="max-w-[18rem]">
                    <p className="text-[clamp(1.7rem,2.5vw,3rem)] font-light leading-[0.98] tracking-[-0.05em]">
                      {FULL_OPEN_CONTENT.title}
                    </p>
                    <p className="mt-3 text-[0.72rem] uppercase tracking-[0.26em] text-white/68 sm:text-[0.78rem]">
                      {FULL_OPEN_CONTENT.label}
                    </p>
                  </div>

                  <div className="max-w-[34rem] lg:justify-self-end">
                    <p className="text-pretty text-[clamp(1rem,2.6vw,1.50rem)] font-extralight leading-[1.06] tracking-[-0.05em] text-white/96">
                      {FULL_OPEN_CONTENT.statement}
                    </p>
                    <p className="mt-4 max-w-[26rem] text-sm font-light leading-[1.65] text-white/72 sm:text-base">
                      {FULL_OPEN_CONTENT.supporting}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}