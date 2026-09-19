"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HandParticlesCanvas = ({
  leftHandSrc = "/images/leftBump.png",
  rightHandSrc = "/images/rightBump.png",
  colorBg = "#0B1A2C",
  colorDots = "255, 255, 255", // RGB values for dots
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDestroyed = false;
    let particles = [];
    let leftHandPoints = [];
    let rightHandPoints = [];
    let leftAspect = 1;
    let rightAspect = 1;

    // Helper to sample non-transparent pixels from an image with 3D depth details
    const sampleHandImage = (imageSrc) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;
        img.onload = () => {
          const aspect = img.naturalWidth / img.naturalHeight;
          const sampleW = 400;
          const sampleH = Math.round(sampleW / aspect);

          const sampleCanvas = document.createElement("canvas");
          const sampleCtx = sampleCanvas.getContext("2d");
          sampleCanvas.width = sampleW;
          sampleCanvas.height = sampleH;

          sampleCtx.clearRect(0, 0, sampleW, sampleH);
          sampleCtx.drawImage(img, 0, 0, sampleW, sampleH);

          const imgData = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
          const points = [];

          // High density sampling step for detailed 3D structure
          const step = 1.4;
          for (let y = 0; y < sampleH; y += step) {
            for (let x = 0; x < sampleW; x += step) {
              const ix = Math.floor(x);
              const iy = Math.floor(y);
              const idx = (iy * sampleW + ix) * 4;
              const alpha = imgData[idx + 3];
              const r = imgData[idx];
              const g = imgData[idx + 1];
              const b = imgData[idx + 2];
              const brightness = (r + g + b) / 3;

              // Only include pixels with visible content
              if (alpha > 40 && brightness > 30) {
                // 3D depth layer calculated from lighting intensity + micro offset
                const depth = (brightness / 255) * 0.7 + Math.random() * 0.3;
                points.push({
                  normX: x / sampleW,
                  normY: y / sampleH,
                  baseAlpha: Math.min(1.0, Math.max(0.25, (alpha / 255) * (0.5 + depth * 0.5))),
                  depth,
                });
              }
            }
          }
          resolve({ points, aspect });
        };
        img.onerror = () => {
          resolve({ points: [], aspect: 1 });
        };
      });
    };

    // Load both hand images and create particle data
    Promise.all([
      sampleHandImage(leftHandSrc),
      sampleHandImage(rightHandSrc),
    ]).then(([leftData, rightData]) => {
      if (isDestroyed) return;

      leftHandPoints = leftData.points;
      leftAspect = leftData.aspect;
      rightHandPoints = rightData.points;
      rightAspect = rightData.aspect;

      buildParticles();
      startAnimation();
    });

    // Build particle layout based on container size
    const buildParticles = () => {
      if (!container || !canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      particles = [];

      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      // Fully responsive hand height calculation:
      // Ensures wrists reach off-screen edges on all devices while keeping the fists comfortably sized
      let maxHandH;
      if (isMobile) {
        maxHandH = Math.max(width * 0.55, height * 0.32);
      } else if (isTablet) {
        maxHandH = Math.max(width * 0.50, height * 0.45);
      } else {
        // Desktop & Ultrawide
        maxHandH = Math.max(height * 0.75, width * 0.48);
      }

      // Left hand dimensions
      const leftH = maxHandH;
      const leftW = leftH * leftAspect;

      // Right hand dimensions
      const rightH = maxHandH;
      const rightW = rightH * rightAspect;

      // Knuckles meet exactly at the screen center (touchX, touchY)
      const touchX = width * 0.5;
      const touchY = height * 0.5;

      // Exact normalized knuckle tips identified from the particle bounds
      const leftTipNormX = 0.6825;
      const leftTipNormY = 0.5558;
      const rightTipNormX = 0.3150;
      const rightTipNormY = 0.5514;

      // Small touch gap so knuckles just touch without colliding/merging
      const touchGap = isMobile ? 2 : 4;

      const leftCenterX = (touchX - touchGap * 0.5) - (leftTipNormX - 0.5) * leftW;
      const leftCenterY = touchY - (leftTipNormY - 0.5) * leftH;

      const rightCenterX = (touchX + touchGap * 0.5) - (rightTipNormX - 0.5) * rightW;
      const rightCenterY = touchY - (rightTipNormY - 0.5) * rightH;

      // Create Left Hand Particles with 3D depth info
      leftHandPoints.forEach((pt) => {
        const targetX = leftCenterX + (pt.normX - 0.5) * leftW;
        const targetY = leftCenterY + (pt.normY - 0.5) * leftH;

        const baseSize = isMobile ? 1.4 : 2.2;
        const dotSize = baseSize * (0.6 + pt.depth * 0.7);

        particles.push({
          targetX,
          targetY,
          hand: "left",
          baseAlpha: pt.baseAlpha,
          depth: pt.depth,
          phase: Math.random() * Math.PI * 2,
          blinkSpeed: 1.0 + Math.random() * 2.0,
          dotSize,
        });
      });

      // Create Right Hand Particles with 3D depth info
      rightHandPoints.forEach((pt) => {
        const targetX = rightCenterX + (pt.normX - 0.5) * rightW;
        const targetY = rightCenterY + (pt.normY - 0.5) * rightH;

        const baseSize = isMobile ? 1.4 : 2.2;
        const dotSize = baseSize * (0.6 + pt.depth * 0.7);

        particles.push({
          targetX,
          targetY,
          hand: "right",
          baseAlpha: pt.baseAlpha,
          depth: pt.depth,
          phase: Math.random() * Math.PI * 2,
          blinkSpeed: 1.0 + Math.random() * 2.0,
          dotSize,
        });
      });
    };

    let time = 0;
    let scrollProgress = 0;

    // GSAP ScrollTrigger listening to 200vh section
    const trigger = ScrollTrigger.create({
      trigger: ".contact_hero",
      start: "top top",
      end: "bottom bottom",
      endTrigger: containerRef.current,
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });

    const startAnimation = () => {
      const render = () => {
        if (isDestroyed) return;
        time += 0.02;

        const width = container.clientWidth;
        const height = container.clientHeight;

        ctx.clearRect(0, 0, width, height);

        const clampedProgress = Math.min(1, Math.max(0, scrollProgress));
        const leftOffsetX = (1 - clampedProgress) * (-width * 0.55);
        const rightOffsetX = (1 - clampedProgress) * (width * 0.55);

        // Render particles with 3D depth parallax
        const len = particles.length;
        for (let i = 0; i < len; i++) {
          const p = particles[i];
          // 3D parallax multiplier: foreground dots move slightly faster during horizontal travel
          const depthMultiplier = 0.8 + p.depth * 0.4;
          const currentOffsetX = (p.hand === "left" ? leftOffsetX : rightOffsetX) * depthMultiplier;
          const drawX = p.targetX + currentOffsetX;
          const drawY = p.targetY;

          // Particle Dot Blink Effect
          const sinVal = Math.sin(time * p.blinkSpeed + p.phase);
          const cosVal = Math.cos(time * (p.blinkSpeed * 0.7) + p.phase);

          let blinkFactor = 0.35 + 0.65 * ((sinVal + 1) / 2);
          if (sinVal > 0.85 && cosVal > 0.3) {
            blinkFactor = Math.min(1.25, blinkFactor * 1.35);
          }

          const currentAlpha = Math.min(1, p.baseAlpha * blinkFactor);

          // Draw particle dot as perfect circle
          ctx.beginPath();
          ctx.fillStyle = `rgba(${colorDots}, ${currentAlpha.toFixed(2)})`;
          ctx.arc(drawX, drawY, p.dotSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        animFrameRef.current = requestAnimationFrame(render);
      };

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(render);
    };

    const handleResize = () => {
      buildParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isDestroyed = true;
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      trigger.kill();
    };
  }, [leftHandSrc, rightHandSrc, colorBg, colorDots]);

  return (
    <div
      ref={containerRef}
      className="relative w-full  h-screen bg-[#0B1A2C] overflow-hidden flex items-center justify-center pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block opacity-50"
      />
    </div>
  );
};

export default HandParticlesCanvas;
