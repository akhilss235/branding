"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Bubbles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    function getScrollProgress(){
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      return scrollHeight <= 0 ? 0 : clamp(scrollTop / scrollHeight, 0, 1);
    }

    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true, 
      powerPreference: "high-performance" 
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
    camera.position.set(0, 1.2, 7.5);

    // Bubble stream
    const bubbleCount = prefersReducedMotion ? 60 : 140;
    const bGeo = new THREE.BufferGeometry();
    const bPos = new Float32Array(bubbleCount * 3);
    const bSeed = new Float32Array(bubbleCount);

    for (let i=0; i<bubbleCount; i++){
      bPos[i*3] = -1.35 + 0.05 + (Math.random()*2-1)*0.08;
      bPos[i*3+1] = 1.45 + 0.7 + Math.random()*2.0;
      bPos[i*3+2] = 1.2 + 0.2 + (Math.random()*2-1)*0.10;
      bSeed[i] = Math.random()*1000;
    }

    bGeo.setAttribute("position", new THREE.BufferAttribute(bPos, 3));

    const bMat = new THREE.PointsMaterial({
      color: 0xdefefe,
      size: 0.055,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const bubbles = new THREE.Points(bGeo, bMat);
    scene.add(bubbles);

    // Resize listener
    function onResize(){
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize);

    // Tint Background
    function updateBodyTint(){
      const p = getScrollProgress();

      // keep it simple:
      document.body.style.background = `
        radial-gradient(1200px 800px at 50% 0%, rgba(47,230,214,${(0.10 - p*0.03).toFixed(3)}), transparent 60%),
        radial-gradient(900px 700px at 70% ${Math.round(10 + p*60)}%, rgba(201,162,77,${(0.05 + p*0.05).toFixed(3)}), transparent 62%),
        linear-gradient(180deg, #000 0%, #031411 18%, #061f1b 45%, #05231f 65%, #021311 100%)
      `;
    }

    window.addEventListener("scroll", updateBodyTint, { passive:true });
    updateBodyTint();

    // Animation loop
    let t0 = performance.now();
    let animationFrameId;

    function animate(){
      const t = performance.now();
      t0 = t;

      const p = getScrollProgress();

      // Camera drift
      camera.position.x = Math.sin(t * 0.00025) * 0.25;
      camera.position.y = 1.25 + Math.sin(t * 0.00018) * 0.14;

      // Bubbles
      const bp = bGeo.attributes.position.array;
      for (let i=0; i<bubbleCount; i++){
        const i3 = i*3;
        bp[i3+1] += (0.02 + p*0.016) + (prefersReducedMotion ? 0 : Math.sin((t*0.001) + bSeed[i]) * 0.002);
        bp[i3] += (prefersReducedMotion ? 0 : Math.sin((t*0.0014) + bSeed[i]) * 0.003);
        bp[i3+2] += (prefersReducedMotion ? 0 : Math.cos((t*0.0012) + bSeed[i]) * 0.002);

        if (bp[i3+1] > 7.5){
          bp[i3] = -1.35 + 0.05 + (Math.random()*2-1)*0.09;
          bp[i3+1] = 1.45 + 0.72 + Math.random()*0.4;
          bp[i3+2] = 1.2 + 0.22 + (Math.random()*2-1)*0.12;
          bSeed[i] = Math.random()*1000;
        }
      }
      bGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateBodyTint);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      // Reset background tint on unmount
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
