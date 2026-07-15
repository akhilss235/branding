"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const OFFSCREEN = -9999;

export default function Hover({
  enabled = true,
  scopeRef,
  src,
  className = "",
  desktopPosition = { x: 50, y: 50 },
  mobilePosition = { x: 50, y: 50 },
  mobileBreakpoint = 640,
  desktopScale = 1,
  mobileScale = 1,
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const mount = mountRef.current;
    const scope = scopeRef?.current ?? mount?.parentElement;

    if (!mount || !scope) {
      return undefined;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (reduceMotion || coarsePointer) {
      return undefined;
    }

    let currentSimScale = window.innerWidth < 768 ? 0.38 : 0.54;
    const waveSpeed = 1;
    const damping = 0.985;
    const rippleSize = 26;

    const contentCanvas = document.createElement("canvas");
    const contentCtx = contentCanvas.getContext("2d");

    if (!contentCtx) {
      return undefined;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const resolution = new THREE.Vector2(1, 1);
    const renderTargetOptions = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type:
        renderer.capabilities?.isWebGL2 || THREE.HalfFloatType === undefined
          ? THREE.FloatType
          : THREE.HalfFloatType,
    };

    const renderTargetA = new THREE.WebGLRenderTarget(1, 1, renderTargetOptions);
    const renderTargetB = renderTargetA.clone();
    let currentTarget = renderTargetA;
    let previousTarget = renderTargetB;

    const contentTexture = new THREE.CanvasTexture(contentCanvas);
    contentTexture.premultiplyAlpha = true;
    contentTexture.needsUpdate = true;

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uResolution: { value: resolution.clone() },
        uMouse: { value: new THREE.Vector3(OFFSCREEN, OFFSCREEN, 0) },
        uDelta: { value: waveSpeed },
        uDamping: { value: damping },
        uRippleSize: { value: rippleSize },
        uShockwave: { value: 0 },
      },
      vertexShader:
        "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `
        uniform sampler2D uTexture; uniform vec2 uResolution; uniform vec3 uMouse;
        uniform float uDelta; uniform float uDamping; uniform float uRippleSize; uniform float uShockwave;
        varying vec2 vUv;
        void main() {
          vec2 texel = 1.0 / uResolution;
          vec2 coord = vUv;
          vec4 data = texture2D(uTexture, coord);
          float pressure = data.x;
          float velocity = data.y;
          float pR = texture2D(uTexture, coord + vec2(texel.x, 0.0)).x;
          float pL = texture2D(uTexture, coord - vec2(texel.x, 0.0)).x;
          float pU = texture2D(uTexture, coord + vec2(0.0, texel.y)).x;
          float pD = texture2D(uTexture, coord - vec2(0.0, texel.y)).x;
          float pTR = texture2D(uTexture, coord + texel).x;
          float pTL = texture2D(uTexture, coord + vec2(-texel.x, texel.y)).x;
          float pBR = texture2D(uTexture, coord + vec2(texel.x, -texel.y)).x;
          float pBL = texture2D(uTexture, coord - texel).x;
          float laplacian = (pR + pL + pU + pD) * 0.2 + (pTR + pTL + pBR + pBL) * 0.05 - pressure;
          velocity += uDelta * laplacian * 2.0;
          pressure += uDelta * velocity;
          pressure = mix(pressure, (pR + pL + pU + pD) * 0.3, 0.05);
          velocity -= 0.002 * uDelta * pressure;
          velocity *= 1.0 - 0.01 * uDelta;
          pressure *= uDamping;
          if (uMouse.z > 0.001) {
            float dist = distance(coord * uResolution, uMouse.xy);
            float ripple = exp(-dist * dist / (uRippleSize * uRippleSize * 0.5));
            pressure += ripple * (0.16 + uMouse.z * 0.78);
          }
          if (uShockwave > 0.1) {
            float dist = distance(coord * uResolution, uMouse.xy);
            float band = abs(dist - uRippleSize * 4.0);
            float shock = smoothstep(80.0, 0.0, band);
            pressure += pow(shock, 6.0) * 0.28 * uShockwave;
          }
          pressure = clamp(pressure, -1.5, 1.5);
          velocity = clamp(velocity, -1.5, 1.5);
          float gradX = (pR - pL) * 0.5;
          float gradY = (pU - pD) * 0.5;
          gl_FragColor = vec4(pressure, velocity, gradX, gradY);
        }
      `,
      glslVersion: THREE.GLSL1,
    });

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uContentTexture: { value: contentTexture },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uPointerUv: { value: new THREE.Vector2(0.5, 0.5) },
        uPointerActive: { value: 0 },
      },
      transparent: true,
      blending: THREE.NormalBlending,
      vertexShader:
        "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `
        uniform sampler2D uTexture; uniform sampler2D uContentTexture; uniform vec2 uResolution;
        uniform vec2 uPointerUv; uniform float uPointerActive; varying vec2 vUv;
        void main() {
          vec4 water = texture2D(uTexture, vUv);
          float pressure = water.x;
          vec2 flow = water.zw;
          vec2 delta = vUv - uPointerUv;
          delta.x *= uResolution.x / max(uResolution.y, 1.0);
          float distanceToPointer = length(delta);
          float turbulence = clamp(abs(pressure) * 0.9 + length(flow) * 4.5, 0.0, 0.22);
          float radius = 0.18 + turbulence;
          float reveal = (1.0 - smoothstep(radius - 0.045, radius + 0.08, distanceToPointer)) * uPointerActive;
          if (reveal < 0.001) {
            discard;
          }
          vec2 direction = normalize(delta + vec2(0.0001, 0.0001));
          vec2 distortedUv = clamp(
            vUv + flow * 0.045 - direction * pressure * 0.018,
            vec2(0.0),
            vec2(1.0)
          );
          vec4 content = texture2D(uContentTexture, distortedUv);
          float subjectAlpha = smoothstep(0.01, 0.08, content.a);
          float rim = smoothstep(radius - 0.07, radius - 0.01, distanceToPointer);
          rim *= 1.0 - smoothstep(radius - 0.01, radius + 0.05, distanceToPointer);
          rim *= subjectAlpha;
          float veilAlpha = reveal * (0.9 + turbulence * 0.35);
          float subjectRevealAlpha = subjectAlpha * reveal;
          float alpha = max(subjectRevealAlpha, veilAlpha);
          vec3 veilColor =
            vec3(0.015, 0.07, 0.065) +
            vec3(0.02, 0.08, 0.09) * turbulence +
            vec3(1.0) * rim * 0.05;
          vec3 color =
            mix(veilColor, content.rgb, subjectAlpha) +
            vec3(0.08, 0.16, 0.18) * turbulence * 1.6 +
            vec3(1.0) * rim * turbulence * 0.18;
          gl_FragColor = vec4(color * alpha, alpha);
        }
      `,
      glslVersion: THREE.GLSL1,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const simMesh = new THREE.Mesh(geometry, simMaterial);
    const displayMesh = new THREE.Mesh(geometry, displayMaterial);
    const mouse = new THREE.Vector2(OFFSCREEN, OFFSCREEN);
    const mouseTarget = new THREE.Vector2(OFFSCREEN, OFFSCREEN);
    const prevMouse = new THREE.Vector2(OFFSCREEN, OFFSCREEN);
    const prevPrevMouse = new THREE.Vector2(OFFSCREEN, OFFSCREEN);
    const pointerUv = new THREE.Vector2(0.5, 0.5);
    const pointerTargetUv = new THREE.Vector2(0.5, 0.5);
    const lastClientPoint = new THREE.Vector2(0, 0);
    let isPointerInside = false;
    let pointerStrength = 0;
    let pointerStrengthTarget = 0;
    let shouldTriggerShockwave = false;
    let shockwaveTime = 0;
    let lastShockwaveAt = 0;
    let isVisible = true;
    let rafId = 0;

    const getPosition = () =>
      window.innerWidth <= mobileBreakpoint ? mobilePosition : desktopPosition;

    const getScaleMultiplier = () =>
      window.innerWidth <= mobileBreakpoint ? mobileScale : desktopScale;

    const drawContent = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      const { x, y } = getPosition();
      const scaleMultiplier = getScaleMultiplier();

      contentCanvas.width = width;
      contentCanvas.height = height;
      contentCtx.clearRect(0, 0, width, height);

      if (!img.complete || !img.naturalWidth) {
        return;
      }

      const scale =
        Math.max(width / img.naturalWidth, height / img.naturalHeight) *
        Math.max(scaleMultiplier, 0.01);
      const drawWidth = img.naturalWidth * scale;
      const drawHeight = img.naturalHeight * scale;
      const drawX = (width - drawWidth) * (x / 100);
      const drawY = (height - drawHeight) * (y / 100);

      contentCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      contentTexture.needsUpdate = true;
    };

    const resizeTargets = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      currentSimScale = window.innerWidth < 768 ? 0.38 : 0.54;
      renderer.setSize(width, height, false);
      resolution.set(Math.max(1, Math.floor(width * currentSimScale)), Math.max(1, Math.floor(height * currentSimScale)));
      renderTargetA.setSize(resolution.x, resolution.y);
      renderTargetB.setSize(resolution.x, resolution.y);
      simMaterial.uniforms.uResolution.value.copy(resolution);
      displayMaterial.uniforms.uResolution.value.set(width, height);
      drawContent();

      if (isPointerInside) {
        updatePointer(lastClientPoint.x, lastClientPoint.y);
      }
    };

    const updatePointer = (clientX, clientY) => {
      const rect = mount.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        isPointerInside = false;
        pointerStrengthTarget = 0;
        return;
      }

      lastClientPoint.set(clientX, clientY);
      isPointerInside = true;
      pointerStrengthTarget = 1;

      const nextMouseX = (x / rect.width) * resolution.x;
      const nextMouseY = ((rect.height - y) / rect.height) * resolution.y;
      const nextPointerX = x / rect.width;
      const nextPointerY = 1 - y / rect.height;

      if (mouse.x === OFFSCREEN || mouse.y === OFFSCREEN) {
        mouse.set(nextMouseX, nextMouseY);
        prevMouse.set(nextMouseX, nextMouseY);
        prevPrevMouse.set(nextMouseX, nextMouseY);
      }

      mouseTarget.set(nextMouseX, nextMouseY);
      pointerTargetUv.set(nextPointerX, nextPointerY);

      if (pointerStrength === 0) {
        pointerUv.set(nextPointerX, nextPointerY);
      }
    };

    const onPointerMove = (event) => updatePointer(event.clientX, event.clientY);
    const onPointerDown = (event) => {
      updatePointer(event.clientX, event.clientY);
      if (isPointerInside) {
        shouldTriggerShockwave = true;
        shockwaveTime = 0;
        lastShockwaveAt = performance.now();
      }
    };
    const onPointerLeave = () => {
      isPointerInside = false;
      pointerStrengthTarget = 0;
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver((entries) => {
            isVisible = entries[0]?.isIntersecting ?? true;
          });

    observer?.observe(mount);

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      if (!isVisible) {
        return;
      }

      if (mouseTarget.x !== OFFSCREEN && mouseTarget.y !== OFFSCREEN) {
        mouse.lerp(mouseTarget, isPointerInside ? 0.24 : 0.14);
      }
      pointerUv.lerp(pointerTargetUv, isPointerInside ? 0.22 : 0.12);
      pointerStrength += (pointerStrengthTarget - pointerStrength) * (isPointerInside ? 0.24 : 0.12);

      const dx = mouse.x - prevMouse.x;
      const dy = mouse.y - prevMouse.y;
      const movement = Math.hypot(dx, dy);
      const moved = movement > 0.14;

      if (isPointerInside) {
        const prevDx = prevMouse.x - prevPrevMouse.x;
        const prevDy = prevMouse.y - prevPrevMouse.y;
        const prevMovement = Math.hypot(prevDx, prevDy);
        const turningSharp =
          movement > 0.55 &&
          prevMovement > 0.55 &&
          Math.acos(
            Math.min(
              1,
              Math.max(-1, (dx * prevDx + dy * prevDy) / Math.max(0.0001, movement * prevMovement)),
            ),
          ) >
            Math.PI / 2.6;

        if (
          ((prevMovement > 1.4 && movement < 0.45) || turningSharp) &&
          performance.now() - lastShockwaveAt > 180
        ) {
          shouldTriggerShockwave = true;
          shockwaveTime = 0;
          lastShockwaveAt = performance.now();
        }
      }

      if (shockwaveTime < 10) {
        shockwaveTime += 1;
      }

      const pointerForce = isPointerInside && moved ? Math.min(1.05, 0.1 + movement * 0.11) : 0;

      simMaterial.uniforms.uTexture.value = previousTarget.texture;
      simMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y, pointerForce);
      simMaterial.uniforms.uShockwave.value = shouldTriggerShockwave && shockwaveTime < 2 ? 1 : 0;

      renderer.setRenderTarget(currentTarget);
      scene.add(simMesh);
      renderer.render(scene, camera);
      scene.remove(simMesh);

      displayMaterial.uniforms.uTexture.value = currentTarget.texture;
      displayMaterial.uniforms.uPointerUv.value.copy(pointerUv);
      displayMaterial.uniforms.uPointerActive.value = pointerStrength;
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

    mount.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.opacity = "0.98";
    renderer.domElement.style.filter = "blur(0.15px)";

    img.onload = () => drawContent();
    img.onerror = () => drawContent();
    resizeTargets();
    rafId = requestAnimationFrame(animate);

    scope.addEventListener("pointermove", onPointerMove, { passive: true });
    scope.addEventListener("pointerdown", onPointerDown, { passive: true });
    scope.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resizeTargets);

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      scope.removeEventListener("pointermove", onPointerMove);
      scope.removeEventListener("pointerdown", onPointerDown);
      scope.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resizeTargets);
      scene.remove(simMesh);
      scene.remove(displayMesh);
      geometry.dispose();
      simMaterial.dispose();
      displayMaterial.dispose();
      renderTargetA.dispose();
      renderTargetB.dispose();
      contentTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [
    enabled,
    scopeRef,
    src,
    desktopPosition,
    mobilePosition,
    mobileBreakpoint,
    desktopScale,
    mobileScale,
  ]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
