"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";

const SVG_NS = "http://www.w3.org/2000/svg";
const SCROLL_SPEED_MULTIPLIER = 1.58;
const ROAD_MARGIN_RATIO = { mobile: 0.08, desktop: 0.05 };
const ROAD_MARGIN_LIMITS = { min: 18, max: 72 };
const MODEL_ROTATION = { x: 0.12, y: 0, z: 0 };
const MODEL_SCALE = 2.2;
const MODEL_OFFSET = { x: 0, y: -0.95, z: 0 };
const CAMERA_POSITION = { x: 0, y: 1.1, z: 7.5 };
const MODEL_TURN_OFFSET = 0;
const MODEL_CAMERA_ROTATION_FACTOR = { x: 0.16, y: 0.7 };
const MODEL_DIRECTION_YAW = {
  right: THREE.MathUtils.degToRad(140),
  left: THREE.MathUtils.degToRad(149),
};
const MODEL_IDLE_DIRECTION_YAW = THREE.MathUtils.degToRad(0);
const MODEL_DIRECTION_CAMERA_YAW_FACTOR = {
  right: 1.1,
  left: 1.1,
};
const MODEL_PATH_BANK_OFFSET = {
  right: THREE.MathUtils.degToRad(10),
  left: THREE.MathUtils.degToRad(10),
};
const START_PATH_PROGRESS = 0;
const END_PATH_PROGRESS = 0.982;
const STANDING_SCROLL_THRESHOLD = 0.315;
const HERO_START_X_RATIO = 0.9;
const HERO_START_Y_RATIO = 0.34;
const WATER_IDLE_ANGLE = 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

function buildRoadPath(points) {
  if (points.length < 2) {
    return "";
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midY = (current.y + next.y) / 2;
    d += ` C ${current.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
  }

  return d;
}

export default function Diver() {
  const sceneRef = useRef(null);
  const svgRef = useRef(null);
  const glowRef = useRef(null);
  const canvasRef = useRef(null);
  const updateFrameRef = useRef(0);
  const renderFrameRef = useRef(0);
  const mixersRef = useRef([]);
  const driverGroupRef = useRef(null);
  const modelAnchorRef = useRef(null);
  const pathDirectionRef = useRef("right");
  const progressRef = useRef(0);

  useEffect(() => {
    const scene = sceneRef.current;
    const svg = svgRef.current;
    const glow = glowRef.current;
    const canvas = canvasRef.current;
    if (!scene || !svg || !glow || !canvas) {
      return undefined;
    }

    let livePath = null;
    const threeScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    camera.position.set(
      CAMERA_POSITION.x,
      CAMERA_POSITION.y,
      CAMERA_POSITION.z
    );
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    threeScene.add(new THREE.HemisphereLight(0x7fdfff, 0x021321, 0.85));
    threeScene.add(new THREE.AmbientLight(0x062436, 0.3));

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(3, 5, 4);
    threeScene.add(dirLight);

    const driverGroup = new THREE.Group();
    const modelAnchor = new THREE.Group();
    modelAnchor.position.set(MODEL_OFFSET.x, MODEL_OFFSET.y, MODEL_OFFSET.z);
    modelAnchor.rotation.set(
      MODEL_ROTATION.x,
      MODEL_ROTATION.y,
      MODEL_ROTATION.z
    );
    driverGroup.add(modelAnchor);
    driverGroupRef.current = driverGroup;
    modelAnchorRef.current = modelAnchor;
    threeScene.add(driverGroup);

    const updateModelRotationFromCamera = () => {
      const activeDriver = driverGroupRef.current;
      const activeModelAnchor = modelAnchorRef.current;
      if (!activeDriver || !activeModelAnchor) {
        return;
      }

      // Convert the camera into the diver's local space so we can derive
      // a stable pitch/yaw offset while keeping the road-following roll intact.
      const localCameraPosition = activeDriver.worldToLocal(
        camera.position.clone()
      );
      const yaw = Math.atan2(localCameraPosition.x, localCameraPosition.z);
      const planarDistance = Math.hypot(
        localCameraPosition.x,
        localCameraPosition.z
      );
      const pitch = Math.atan2(localCameraPosition.y, planarDistance);
      const directionYaw =
        progressRef.current <= STANDING_SCROLL_THRESHOLD
          ? MODEL_IDLE_DIRECTION_YAW
          : pathDirectionRef.current === "left"
          ? MODEL_DIRECTION_YAW.left
          : MODEL_DIRECTION_YAW.right;
      const directionCameraYawFactor =
        pathDirectionRef.current === "left"
          ? MODEL_DIRECTION_CAMERA_YAW_FACTOR.left
          : MODEL_DIRECTION_CAMERA_YAW_FACTOR.right;

      activeModelAnchor.rotation.set(
        MODEL_ROTATION.x + pitch * MODEL_CAMERA_ROTATION_FACTOR.x,
        MODEL_ROTATION.y +
          directionYaw +
          yaw *
            MODEL_CAMERA_ROTATION_FACTOR.y *
            directionCameraYawFactor,
        MODEL_ROTATION.z
      );
    };

    const resizeRenderer = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
    };

    const loader = new GLTFLoader();
    loader.load("/models/Untitled.glb", (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(MODEL_SCALE);

      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      model.position.sub(center);

      model.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = 1;
          child.frustumCulled = false;
        }
      });

      modelAnchor.add(model);

      if (gltf.animations?.length) {
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
        mixersRef.current.push(mixer);
      }
    });

    const buildPath = () => {
      const main = scene.parentElement;
      if (!main) {
        return;
      }

      const sections = Array.from(
        main.querySelectorAll("[data-road-stop]")
      );

      if (!sections.length) {
        svg.innerHTML = "";
        livePath = null;
        return;
      }

      const mainRect = main.getBoundingClientRect();
      const mainTop = mainRect.top + window.scrollY;
      const width = main.clientWidth;
      const height = main.scrollHeight;
      const isMobile = window.innerWidth < 768;
      const margin = clamp(
        width * (isMobile ? ROAD_MARGIN_RATIO.mobile : ROAD_MARGIN_RATIO.desktop),
        ROAD_MARGIN_LIMITS.min,
        ROAD_MARGIN_LIMITS.max
      );
      const leftX = margin;
      const rightX = width - margin;
      const centerX = width / 2;
      const topSafeOffset = isMobile ? 110 : 138;

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("width", `${width}`);
      svg.setAttribute("height", `${height}`);
      svg.innerHTML = "";

      const stops = sections.map((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY - mainTop;
        const sectionMid = sectionTop + rect.height / 2;
        const side = section.getAttribute("data-road-side");

        if (isMobile || side === "center") {
          return { x: centerX, y: sectionMid };
        }

        if (side === "left") {
          return { x: leftX, y: sectionMid };
        }

        if (side === "right") {
          return { x: rightX, y: sectionMid };
        }

        return {
          x: index % 2 === 0 ? rightX : leftX,
          y: sectionMid,
        };
      });

      const startY = clamp(
        window.innerHeight * HERO_START_Y_RATIO,
        topSafeOffset,
        Math.max(topSafeOffset, stops[0].y - window.innerHeight * 0.04)
      );
      const endY = clamp(
        stops[stops.length - 1].y + window.innerHeight * 0.2,
        stops[stops.length - 1].y + 80,
        height - 80
      );
      const startX = isMobile ? centerX : width * HERO_START_X_RATIO;

      const points = [
        { x: startX, y: startY },
        ...stops,
        { x: centerX, y: endY },
      ];

      const d = buildRoadPath(points);

      const roadShadow = document.createElementNS(SVG_NS, "path");
      roadShadow.setAttribute("d", d);
      roadShadow.setAttribute("stroke", "rgba(0, 0, 0, 0.28)");
      roadShadow.setAttribute("stroke-width", isMobile ? "138" : "212");
      roadShadow.setAttribute("fill", "none");
      roadShadow.setAttribute("stroke-linecap", "round");
      roadShadow.setAttribute("stroke-linejoin", "round");
      svg.appendChild(roadShadow);

      const road = document.createElementNS(SVG_NS, "path");
      road.setAttribute("d", d);
      road.setAttribute("stroke", "rgba(19, 27, 39, 0.94)");
      road.setAttribute("stroke-width", isMobile ? "118" : "182");
      road.setAttribute("fill", "none");
      road.setAttribute("stroke-linecap", "round");
      road.setAttribute("stroke-linejoin", "round");
      svg.appendChild(road);

      const centerLine = document.createElementNS(SVG_NS, "path");
      centerLine.setAttribute("d", d);
      centerLine.setAttribute("stroke", "rgba(245, 200, 66, 0.95)");
      centerLine.setAttribute("stroke-width", isMobile ? "9.5" : "13");
      centerLine.setAttribute("fill", "none");
      centerLine.setAttribute("stroke-linecap", "round");
      centerLine.setAttribute("stroke-dasharray", isMobile ? "46 30" : "74 46");
      svg.appendChild(centerLine);

      livePath = document.createElementNS(SVG_NS, "path");
      livePath.setAttribute("d", d);
      livePath.setAttribute("fill", "none");
      livePath.style.visibility = "hidden";
      svg.appendChild(livePath);
    };

    const updateCar = () => {
      if (!livePath) {
        return;
      }

      const main = scene.parentElement;
      if (!main) {
        return;
      }

      const mainRect = main.getBoundingClientRect();
      const maxScroll = Math.max(main.scrollHeight - window.innerHeight, 1);
      const scrollStart = mainRect.top + window.scrollY;
      const scrollTop = clamp(window.scrollY - scrollStart, 0, maxScroll);
      const progress = clamp(scrollTop / maxScroll, 0, 1);
      progressRef.current = progress;
      const acceleratedProgress = clamp(progress * SCROLL_SPEED_MULTIPLIER, 0, 1);
      const introProgress = clamp(
        progress / Math.max(STANDING_SCROLL_THRESHOLD, 0.001),
        0,
        1
      );
      const introEase = easeOutCubic(introProgress);
      // Path moving: scroll progress is remapped here to control how fast the model travels.
      const pathProgress = THREE.MathUtils.lerp(
        START_PATH_PROGRESS,
        END_PATH_PROGRESS,
        acceleratedProgress
      );

      const totalLength = livePath.getTotalLength();
      const pathPoint = totalLength * pathProgress;
      const point = livePath.getPointAtLength(pathPoint);
      const behind = livePath.getPointAtLength(Math.max(pathPoint - 16, 0));
      const ahead = livePath.getPointAtLength(
        Math.min(pathPoint + 16, totalLength)
      );
      const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x);
      pathDirectionRef.current = ahead.x >= behind.x ? "right" : "left";
      const bankOffset =
        pathDirectionRef.current === "left"
          ? MODEL_PATH_BANK_OFFSET.left
          : MODEL_PATH_BANK_OFFSET.right;

      const introPathPoint = livePath.getPointAtLength(
        totalLength * acceleratedProgress * introEase
      );
      const targetPoint =
        progress <= STANDING_SCROLL_THRESHOLD ? introPathPoint : point;
      const targetAngle =
        progress <= STANDING_SCROLL_THRESHOLD
          ? THREE.MathUtils.lerp(
              WATER_IDLE_ANGLE,
              angle + bankOffset,
              introEase
            )
          : angle + bankOffset;

      const screenX = mainRect.left + targetPoint.x;
      const screenY = mainRect.top + targetPoint.y;

      const activeDriver = driverGroupRef.current;
      if (activeDriver) {
        const normalizedX = (screenX / window.innerWidth) * 2 - 1;
        const normalizedY = -(screenY / window.innerHeight) * 2 + 1;
        const worldPoint = new THREE.Vector3(normalizedX, normalizedY, 0.5);
        worldPoint.unproject(camera);

        const direction = worldPoint.sub(camera.position).normalize();
        const distance = -camera.position.z / direction.z;
        const projectedPoint = camera.position
          .clone()
          .add(direction.multiplyScalar(distance));

        activeDriver.position.set(projectedPoint.x, projectedPoint.y, 0);

        // Hold a neutral standing pose until scrolling starts, then follow the road angle.
        activeDriver.rotation.z = targetAngle + MODEL_TURN_OFFSET;
      }

      updateModelRotationFromCamera();

      glow.style.left = `${screenX}px`;
      glow.style.top = `${screenY}px`;
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(updateFrameRef.current);
      updateFrameRef.current = requestAnimationFrame(() => {
        buildPath();
        updateCar();
      });
    };

    scheduleUpdate();
    resizeRenderer();

    let previousTime = performance.now();
    const animate = () => {
      renderFrameRef.current = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const deltaSeconds = Math.min((currentTime - previousTime) / 1000, 0.05);
      previousTime = currentTime;

      mixersRef.current.forEach((mixer) => mixer.update(deltaSeconds));
      updateModelRotationFromCamera();
      renderer.render(threeScene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
      scheduleUpdate();
    });

    resizeObserver.observe(document.body);

    window.addEventListener("resize", resizeRenderer);
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", updateCar, { passive: true });

    return () => {
      cancelAnimationFrame(updateFrameRef.current);
      cancelAnimationFrame(renderFrameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resizeRenderer);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", updateCar);
      mixersRef.current = [];
      driverGroupRef.current = null;
      modelAnchorRef.current = null;
      pathDirectionRef.current = "right";
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div
        ref={sceneRef}
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden="true"
      >
        <svg ref={svgRef} className="absolute inset-0 h-full w-full" />
      </div>

      <div
        ref={glowRef}
        className="pointer-events-none fixed z-[8] h-36 w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(245, 200, 66, 0.22), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9] h-full w-full"
        aria-hidden="true"
      />
    </>
  );
}
