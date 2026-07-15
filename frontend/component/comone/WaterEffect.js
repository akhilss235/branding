'use client';

import { useEffect, useRef } from 'react';

const scriptCache = new Map();

export default function WaterEffect() {
  const anchorRef = useRef(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    const section = anchor?.parentElement;

    if (!section) {
      return undefined;
    }

    let isMounted = true;
    let frameId = null;
    let lastDropAt = 0;
    let rippleApi = null;

    const queueRipple = (clientX, clientY, radius = 32, strength = 0.01) => {
      if (!rippleApi) {
        return;
      }

      const now = performance.now();
      if (now - lastDropAt < 45) {
        return;
      }

      lastDropAt = now;

      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
          return;
        }

        try {
          rippleApi.ripples('drop', x, y, radius, strength);
        } catch {}
      });
    };

    const handlePointerMove = (event) => {
      queueRipple(event.clientX, event.clientY);
    };

    const handlePointerDown = (event) => {
      queueRipple(event.clientX, event.clientY, 34, 0.09);
    };

    async function initRipples() {
      try {
        if (!window.jQuery) {
          await loadScript('https://code.jquery.com/jquery-3.6.0.min.js');
        }

        if (!window.jQuery?.fn?.ripples) {
          await loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js'
          );
        }

        if (!isMounted || !window.jQuery?.fn?.ripples) {
          return;
        }

        rippleApi = window.jQuery(section);
        rippleApi.ripples({
          resolution: 556,
          perturbance: 0.01,
        });

        section.addEventListener('pointermove', handlePointerMove, { passive: true });
        section.addEventListener('pointerdown', handlePointerDown, { passive: true });
      } catch (error) {
        console.error('Failed to initialize water effect:', error);
      }
    }

    initRipples();

    return () => {
      isMounted = false;
      section.removeEventListener('pointermove', handlePointerMove);
      section.removeEventListener('pointerdown', handlePointerDown);

      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      if (rippleApi) {
        try {
          rippleApi.ripples('destroy');
        } catch {}
      }
    };
  }, []);

  return <span ref={anchorRef} aria-hidden="true" style={{ display: 'none' }} />;
}

function loadScript(src) {
  if (scriptCache.has(src)) {
    return scriptCache.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing) {
      if (
        existing.dataset.loaded === 'true' ||
        existing.readyState === 'complete' ||
        existing.readyState === 'loaded'
      ) {
        resolve();
        return;
      }

      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });

  scriptCache.set(src, promise);
  return promise;
}
