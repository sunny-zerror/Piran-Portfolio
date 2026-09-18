"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HandParticlesCanvas = ({
  leftHandSrc = "/images/left_hand.png",
  rightHandSrc = "/images/right_hand.png",
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

    // Helper to sample non-transparent pixels from an image
    const sampleHandImage = (imageSrc) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;
        img.onload = () => {
          const aspect = img.naturalWidth / img.naturalHeight;
          const sampleW = 150;
          const sampleH = Math.round(sampleW / aspect);

          const sampleCanvas = document.createElement("canvas");
          const sampleCtx = sampleCanvas.getContext("2d");
          sampleCanvas.width = sampleW;
          sampleCanvas.height = sampleH;

          sampleCtx.clearRect(0, 0, sampleW, sampleH);
          sampleCtx.drawImage(img, 0, 0, sampleW, sampleH);

          const imgData = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;
          const points = [];

          // Grid step sampling for particle dots
          const step = 2;
          for (let y = 0; y < sampleH; y += step) {
            for (let x = 0; x < sampleW; x += step) {
              const idx = (y * sampleW + x) * 4;
              const alpha = imgData[idx + 3];
              const r = imgData[idx];
              const g = imgData[idx + 1];
              const b = imgData[idx + 2];
              const brightness = (r + g + b) / 3;

              // Only include pixels with visible content
              if (alpha > 40 && brightness > 20) {
                points.push({
                  normX: x / sampleW,
                  normY: y / sampleH,
                  baseAlpha: Math.min(1.0, Math.max(0.3, alpha / 255)),
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
      // Increased hand height to completely cover the screen without extra padding
      const maxHandH = isMobile
        ? Math.max(height * 1.08, width * 0.85)
        : Math.max(height * 1.18, width * 0.52);

      // Left hand dimensions
      const leftH = maxHandH;
      const leftW = leftH * leftAspect;

      // Right hand dimensions
      const rightH = maxHandH;
      const rightW = rightH * rightAspect;

      // Positioning left and right hands flush with screen edges
      let leftCenterX, leftCenterY, rightCenterX, rightCenterY;

      if (isMobile) {
        leftCenterX = leftW * 0.42;
        leftCenterY = height * 0.48;
        rightCenterX = width - rightW * 0.42;
        rightCenterY = height * 0.52;
      } else {
        // Desktop: Flush against left and right edges to cover all side padding
        leftCenterX = leftW * 0.45;
        leftCenterY = height * 0.5;
        rightCenterX = width - rightW * 0.45;
        rightCenterY = height * 0.5;
      }

      // Create Left Hand Particles
      leftHandPoints.forEach((pt) => {
        const targetX = leftCenterX + (pt.normX - 0.5) * leftW;
        const targetY = leftCenterY + (pt.normY - 0.5) * leftH;

        particles.push({
          targetX,
          targetY,
          hand: "left",
          baseAlpha: pt.baseAlpha,
          phase: Math.random() * Math.PI * 2,
          blinkSpeed: 1.2 + Math.random() * 2.5,
          dotSize: isMobile ? 1.85 : 3,
        });
      });

      // Create Right Hand Particles
      rightHandPoints.forEach((pt) => {
        const targetX = rightCenterX + (pt.normX - 0.5) * rightW;
        const targetY = rightCenterY + (pt.normY - 0.5) * rightH;

        particles.push({
          targetX,
          targetY,
          hand: "right",
          baseAlpha: pt.baseAlpha,
          phase: Math.random() * Math.PI * 2,
          blinkSpeed: 1.2 + Math.random() * 2.5,
          dotSize: isMobile ? 1.85 : 3,
        });
      });
    };

    let time = 0;
    let scrollProgress = 0;

    // GSAP ScrollTrigger listening to 200vh section
    const trigger = ScrollTrigger.create({
      trigger: container.closest("section") || container,
      start: "top top",
      end: "bottom bottom",
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

        // Calculate horizontal offset based on scroll progress (animating from -50% / +50% width to 0)
        const leftOffsetX = (1 - scrollProgress) * (-width * 0.35);
        const rightOffsetX = (1 - scrollProgress) * (width * 0.35);

        // Render each particle dot with horizontal scroll offset
        const len = particles.length;
        for (let i = 0; i < len; i++) {
          const p = particles[i];
          const currentOffsetX = p.hand === "left" ? leftOffsetX : rightOffsetX;
          const drawX = p.targetX + currentOffsetX;
          const drawY = p.targetY;

          // Particle Dot Blink Effect
          const sinVal = Math.sin(time * p.blinkSpeed + p.phase);
          const cosVal = Math.cos(time * (p.blinkSpeed * 0.7) + p.phase);
          
          let blinkFactor = 0.3 + 0.7 * ((sinVal + 1) / 2);
          if (sinVal > 0.85 && cosVal > 0.3) {
            blinkFactor = Math.min(1.2, blinkFactor * 1.4);
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
      className="relative w-full  h-screen  overflow-hidden flex items-center justify-center pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};

export default HandParticlesCanvas;
