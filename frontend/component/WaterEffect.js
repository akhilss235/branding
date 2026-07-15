"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function WaterEffect() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let currentSimScale = window.innerWidth < 768 ? 0.4 : 0.6;
    const waveSpeed = 1;
    const damping = 0.98;
    const rippleSize = 20;

    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");
    let imageScrollOffset = 0;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src =
      "";

    const bioLines = [""];

    const drawContent = () => {
      const w = (textCanvas.width = window.innerWidth);
      const h = (textCanvas.height = window.innerHeight);
      textCtx.clearRect(0, 0, w, h);

      let imgWidth = 0;
      let imgHeight = 0;
      let imgX = 0;
      let imgY = 0;

      if (img.complete && img.naturalWidth) {
        imgWidth = Math.min(w * 0.4, 800);
        imgHeight = (img.naturalHeight / img.naturalWidth) * imgWidth;
        imgX = (w - imgWidth) / 1.5 + w * 0.15 + imageScrollOffset * 0.4;
        imgY = h - imgHeight + 20;
        textCtx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
      }

      const centerY = Math.round(h * 0.54);
      const fs = 120;
      textCtx.textAlign = "left";
      textCtx.textBaseline = "middle";

      bioLines.forEach((line, i) => {
        textCtx.font = `300 ${fs}px Arial, sans-serif`;
        const offset = (i - (bioLines.length - 1) / 2) * 151.8;
        const ty = centerY + offset;
        const tx = w * 0.05;
        const metrics = textCtx.measureText(line);
        const textW = Math.ceil(metrics.width);
        const sampleX = Math.max(0, Math.floor(tx - textW / 2));
        const sampleY = Math.max(0, Math.floor(ty - fs / 2));
        const sampleW = Math.min(textW, w - sampleX);
        const sampleH = Math.min(Math.round(fs * 1.0), h - sampleY);

        let fill = "rgb(255, 255, 255)";
        if (img.complete && img.naturalWidth && sampleW > 0 && sampleH > 0) {
          try {
            const imgData = textCtx
              .getImageData(sampleX, sampleY, Math.max(1, sampleW), Math.max(1, sampleH))
              .data;
            let total = 0;
            let count = 0;

            for (let k = 0; k < imgData.length; k += 4) {
              total +=
                0.2126 * imgData[k] +
                0.7152 * imgData[k + 1] +
                0.0722 * imgData[k + 2];
              count += 1;
            }

            const avg = total / Math.max(1, count);
            if (avg > 130) {
              fill = "rgb(239, 81, 67)";
            }
          } catch {
            // Ignore tainted-canvas failures when the image cannot be sampled.
          }
        }

        const stroke = "rgba(0,0,0,0.6)";
        textCtx.lineWidth = Math.max(2, Math.round(fs * 0.06));
        textCtx.strokeStyle = stroke;
        textCtx.miterLimit = 2;
        textCtx.strokeText(line, tx, ty);
        textCtx.fillStyle = fill;
        textCtx.fillText(line, tx, ty);
      });
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, premultipliedAlpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const isWebGL2 =
      (renderer.capabilities && renderer.capabilities.isWebGL2) || false;
    let rtType = THREE.HalfFloatType;
    if (isWebGL2) {
      rtType = THREE.FloatType;
    } else if (THREE.HalfFloatType !== undefined) {
      rtType = THREE.HalfFloatType;
    } else {
      rtType = THREE.UnsignedByteType;
    }

    const resolution = new THREE.Vector2(
      Math.max(1, Math.floor(window.innerWidth * currentSimScale)),
      Math.max(1, Math.floor(window.innerHeight * currentSimScale))
    );

    const renderTargetA = new THREE.WebGLRenderTarget(
      resolution.x,
      resolution.y,
      {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: rtType,
      }
    );
    const renderTargetB = renderTargetA.clone();

    let currentTarget = renderTargetA;
    let previousTarget = renderTargetB;

    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.needsUpdate = true;

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uResolution: { value: new THREE.Vector2(resolution.x, resolution.y) },
        uMouse: { value: new THREE.Vector3(-1, -1, 0) },
        uDelta: { value: waveSpeed },
        uDamping: { value: damping },
        uRippleSize: { value: rippleSize },
        uShockwave: { value: 0.0 },
      },
      vertexShader:
        "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        uniform vec3 uMouse;
        uniform float uDelta;
        uniform float uDamping;
        uniform float uRippleSize;
        uniform float uShockwave;
        varying vec2 vUv;

        void main() {
          vec2 texel = 1.0 / uResolution;
          vec2 coord = vUv;
          vec4 data = texture2D(uTexture, coord);
          float pressure = data.x;
          float velocity = data.y;

          float p_right = texture2D(uTexture, coord + vec2(texel.x, 0.0)).x;
          float p_left  = texture2D(uTexture, coord + vec2(-texel.x, 0.0)).x;
          float p_up    = texture2D(uTexture, coord + vec2(0.0, texel.y)).x;
          float p_down  = texture2D(uTexture, coord + vec2(0.0, -texel.y)).x;
          float p_tr    = texture2D(uTexture, coord + vec2(texel.x, texel.y)).x;
          float p_tl    = texture2D(uTexture, coord + vec2(-texel.x, texel.y)).x;
          float p_br    = texture2D(uTexture, coord + vec2(texel.x, -texel.y)).x;
          float p_bl    = texture2D(uTexture, coord + vec2(-texel.x, -texel.y)).x;

          if (coord.x < texel.x) p_left = p_right;
          if (coord.x > 1.0 - texel.x) p_right = p_left;
          if (coord.y < texel.y) p_down = p_up;
          if (coord.y > 1.0 - texel.y) p_up = p_down;

          float laplacian = (p_right + p_left + p_up + p_down) * 0.2 +
                            (p_tr + p_tl + p_br + p_bl) * 0.05 -
                            pressure;

          velocity += uDelta * laplacian * 2.0;
          pressure += uDelta * velocity;
          pressure = mix(pressure, (p_right + p_left + p_up + p_down) * 0.3, 0.05);
          velocity -= 0.002 * uDelta * pressure;
          velocity *= 1.0 - 0.01 * uDelta;
          pressure *= uDamping;

          if (uMouse.z > 0.5) {
            float dist = distance(coord * uResolution, uMouse.xy);
            float force = exp(-dist * dist / (uRippleSize * uRippleSize * 0.5));
            pressure += force * 1.0;
          }

          if (uShockwave > 0.1) {
            float dist = distance(coord * uResolution, uMouse.xy);
            float shockwaveRadius = uRippleSize * 4.0;
            float shockwaveThickness = 80.0;
            float distFromShockwave = abs(dist - shockwaveRadius);
            if (distFromShockwave < shockwaveThickness) {
              float shockStrength = smoothstep(shockwaveThickness, 0.0, distFromShockwave);
              pressure += pow(shockStrength, 6.0) * 0.4;
            }
          }

          pressure = clamp(pressure, -1.5, 1.5);
          velocity = clamp(velocity, -1.5, 1.5);

          float gradX = (p_right - p_left) / 2.0;
          float gradY = (p_up - p_down) / 2.0;
          gl_FragColor = vec4(pressure, velocity, gradX, gradY);
        }`,
      glslVersion: THREE.GLSL1,
    });

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uContentTexture: { value: textTexture },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uIsMobile: { value: window.innerWidth < 768 },
      },
      transparent: true,
      blending: THREE.NormalBlending,
      vertexShader:
        "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform sampler2D uContentTexture;
        uniform vec2 uResolution;
        uniform bool uIsMobile;
        varying vec2 vUv;

        void main() {
          vec4 data = texture2D(uTexture, vUv);

          vec2 distortion = data.zw * 0.3;
          float waveHeight = data.x;

          float r = texture2D(uContentTexture, vUv + distortion * 0.8).r;
          float g = texture2D(uContentTexture, vUv + distortion * 0.8).g;
          float b = texture2D(uContentTexture, vUv + distortion * 0.8).b;
          float a = texture2D(uContentTexture, vUv + distortion).a;

          vec3 color = vec3(r, g, b);

          vec3 normal = normalize(vec3(-data.z * 4.0, 0.5, -data.w * 4.0));
          vec3 lightDir = normalize(vec3(-2.0, 5.0, 3.0));
          float spec = pow(max(0.0, dot(normal, lightDir)), 800.0);
          color += vec3(1.0, 1.0, 1.0) * spec * 0.2;

          vec3 backLightDir = normalize(vec3(2.0, 5.0, -3.0));
          float backSpec = pow(max(0.0, dot(normal, backLightDir)), 150.0);
          color += vec3(0.8, 0.8, 0.8) * backSpec * 0.001;
          color += vec3(0.2, 0.5, 0.9) * abs(waveHeight) * 0.8;

          if (!uIsMobile) {
            float spec2 = pow(max(0.0, dot(normal, lightDir)), 50.0);
            color += vec3(0.9, 0.95, 1.0) * spec2 * 0.8;

            float caustic = sin(waveHeight * 25.0) * 0.5 + 0.5;
            color += vec3(0.043, 0.110, 0.184) * caustic * max(0.0, waveHeight) * 0.2;
          }

          float waterAlpha = 0.1 + abs(waveHeight) * 0.4 + spec * 0.8 + length(distortion) * 0.5;
          waterAlpha = clamp(waterAlpha, 0.05, 0.8);
          float finalAlpha = max(a, waterAlpha);

          gl_FragColor = vec4(color, finalAlpha);
        }`,
      glslVersion: THREE.GLSL1,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const simMesh = new THREE.Mesh(geometry, simMaterial);
    const displayMesh = new THREE.Mesh(geometry, displayMaterial);

    const mouse = new THREE.Vector2(-1, -1);
    const prevMouse = new THREE.Vector2(-1, -1);
    const prevPrevMouse = new THREE.Vector2(-1, -1);
    let isMouseActive = false;
    let shouldTriggerShockwave = false;
    let shockwaveTime = 0;

    const updateMouseFromWindow = (clientX, clientY) => {
      mouse.x = clientX * currentSimScale;
      mouse.y = (window.innerHeight - clientY) * currentSimScale;
    };

    const onPointerMove = (event) => {
      isMouseActive = true;
      updateMouseFromWindow(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      isMouseActive = false;
    };

    const onTouchStart = (event) => {
      if (!event.touches.length) return;
      event.preventDefault();
      isMouseActive = true;
      const touch = event.touches[0];
      updateMouseFromWindow(touch.clientX, touch.clientY);
    };

    const onTouchMove = (event) => {
      if (!event.touches.length) return;
      event.preventDefault();
      isMouseActive = true;
      const touch = event.touches[0];
      updateMouseFromWindow(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
      isMouseActive = false;
    };

    let isVisible = true;
    let observer = null;

    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0].isIntersecting;
        },
        { threshold: 0.0 }
      );
      observer.observe(mount);
    }

    let lastTime = performance.now();
    let badFrames = 0;
    let rafId = 0;

    const animateWater = (currentTime) => {
      rafId = requestAnimationFrame(animateWater);

      if (!isVisible) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (deltaTime > 33) {
        badFrames += 1;
      } else {
        badFrames = Math.max(0, badFrames - 0.5);
      }

      if (badFrames > 20 && currentSimScale > 0.2) {
        currentSimScale -= 0.1;
        badFrames = 0;
        onResize();
      }

      const mouseMoved =
        Math.abs(mouse.x - prevMouse.x) > 0.5 || Math.abs(mouse.y - prevMouse.y) > 0.5;
      if (isMouseActive) {
        const dx = mouse.x - prevMouse.x;
        const dy = mouse.y - prevMouse.y;
        const prevDx = prevMouse.x - prevPrevMouse.x;
        const prevDy = prevMouse.y - prevPrevMouse.y;
        const movement = Math.sqrt(dx * dx + dy * dy);
        const prevMovement = Math.sqrt(prevDx * prevDx + prevDy * prevDy);

        if (prevMovement > 2 && movement < 1) {
          shouldTriggerShockwave = true;
          shockwaveTime = 0;
        }

        if (movement > 1 && prevMovement > 1) {
          const dot = dx * prevDx + dy * prevDy;
          const denom = Math.max(0.0001, movement * prevMovement);
          const angle = Math.acos(Math.min(1, Math.max(-1, dot / denom)));
          if (angle > Math.PI / 3) {
            shouldTriggerShockwave = true;
            shockwaveTime = 0;
          }
        }
      }

      if (shockwaveTime < 10) shockwaveTime += 1;

      simMaterial.uniforms.uTexture.value = previousTarget.texture;
      simMaterial.uniforms.uMouse.value.set(
        mouse.x,
        mouse.y,
        isMouseActive && mouseMoved ? 1 : 0
      );
      simMaterial.uniforms.uDelta.value = waveSpeed;
      simMaterial.uniforms.uDamping.value = damping;
      simMaterial.uniforms.uRippleSize.value = rippleSize;
      simMaterial.uniforms.uShockwave.value =
        shouldTriggerShockwave && shockwaveTime < 2 ? 1.0 : 0.0;

      renderer.setRenderTarget(currentTarget);
      scene.add(simMesh);
      renderer.render(scene, camera);
      scene.remove(simMesh);

      displayMaterial.uniforms.uTexture.value = currentTarget.texture;
      displayMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      renderer.setRenderTarget(null);
      scene.add(displayMesh);
      renderer.render(scene, camera);
      scene.remove(displayMesh);

      [currentTarget, previousTarget] = [previousTarget, currentTarget];

      prevPrevMouse.copy(prevMouse);
      prevMouse.copy(mouse);

      if (shockwaveTime > 3) {
        shouldTriggerShockwave = false;
      }
    };

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      displayMaterial.uniforms.uIsMobile.value = w < 768;

      resolution.set(
        Math.max(1, Math.floor(w * currentSimScale)),
        Math.max(1, Math.floor(h * currentSimScale))
      );
      renderTargetA.setSize(resolution.x, resolution.y);
      renderTargetB.setSize(resolution.x, resolution.y);
      simMaterial.uniforms.uResolution.value.set(resolution.x, resolution.y);

      textCanvas.width = w;
      textCanvas.height = h;
      drawContent();
      textTexture.needsUpdate = true;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    window.addEventListener("resize", onResize);

      renderer.domElement.style.position = "fixed";
      renderer.domElement.style.inset = "0";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.zIndex = "0";
    mount.appendChild(renderer.domElement);

    img.onload = () => {
      drawContent();
      textTexture.needsUpdate = true;
    };
    img.onerror = () => {
      drawContent();
      textTexture.needsUpdate = true;
    };

    const run = (time) => {
      lastTime = time;
      animateWater(time);
    };
    rafId = requestAnimationFrame(run);
    drawContent();
    textTexture.needsUpdate = true;

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      scene.remove(simMesh);
      scene.remove(displayMesh);
      geometry.dispose();
      simMaterial.dispose();
      displayMaterial.dispose();
      renderTargetA.dispose();
      renderTargetB.dispose();
      textTexture.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
        style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
