"use client";

import { useEffect, useRef } from "react";

export default function DepthMeter() {
  const fillRef = useRef(null);
  const pinRef = useRef(null);
  const rafRef = useRef(null);

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const getScrollProgress = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight =
      (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;

    return clamp(scrollHeight > 0 ? scrollTop / scrollHeight : 0, 0, 1);
  };

  const updateDepthMeter = () => {
    const percent = Math.round(getScrollProgress() * 100);

    if (fillRef.current && pinRef.current) {
      fillRef.current.style.height = `${percent}%`;
      pinRef.current.style.top = `calc(${percent}% - 15px)`;
    }

    rafRef.current = requestAnimationFrame(updateDepthMeter);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateDepthMeter);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="depthmeter" aria-hidden="true">
      <div className="track">
        <div ref={fillRef} className="fill" />
        <div ref={pinRef} className="pin" />
      </div>
    </div>
  );
}
