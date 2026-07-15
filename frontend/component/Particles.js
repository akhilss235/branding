"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Particles() {
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

    // Particles
    const particleCount = prefersReducedMotion ? 400 : 1100;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++){
      positions[i*3] = (Math.random()*2-1) * 12;
      positions[i*3+1] = (Math.random()*2-1) * 8 + 1.2;
      positions[i*3+2] = (Math.random()*2-1) * 16 - 2;
      speeds[i] = 0.003 + Math.random() * 0.012;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x8ef7ee,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

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

      // Particles
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++){
        const idx = i*3+1;
        pos[idx] += speeds[i] * (0.45 + p*0.85);
        pos[i*3] += Math.sin((t*0.00035) + i) * 0.00045;

        if (pos[idx] > 7.2){
          pos[idx] = -4.5;
          pos[i*3] = (Math.random()*2-1) * 12;
          pos[i*3+2] = (Math.random()*2-1) * 16 - 2;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateBodyTint);
      cancelAnimationFrame(animationFrameId);
      pGeo.dispose();
      pMat.dispose();
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
