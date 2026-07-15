"use client";

import { useEffect } from "react";

export default function DepthHUD({ maxDepth = 60 }) {
  useEffect(() => {
    const root = document.documentElement;
    const depthValue = document.getElementById("depth-value");
    const depthFill = document.getElementById("depth-bar-fill");

    if (!depthValue || !depthFill) return;

    function updateDepth() {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop;

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      const clamped = Math.min(Math.max(progress, 0), 1);

      root.style.setProperty("--scroll-progress", clamped);

      const depth = Math.round(clamped * maxDepth);

      depthValue.textContent = `${depth}m`;
      depthFill.style.transform = `scaleY(${clamped})`;
    }

    window.addEventListener("scroll", updateDepth, { passive: true });
    window.addEventListener("resize", updateDepth);

    updateDepth();

    return () => {
      window.removeEventListener("scroll", updateDepth);
      window.removeEventListener("resize", updateDepth);
    };
  }, [maxDepth]);

  return (
    <div className="depthHud" >
      <div className='depthMetric'>
        <span>Depth</span>
        <span id="depth-value" className='depthValue'>0m</span>
      </div>

      <div className='depthBar'>
        <div
          id="depth-bar-fill"
          className='depthBarFill'
        />
      </div>
    </div>
  );
}
