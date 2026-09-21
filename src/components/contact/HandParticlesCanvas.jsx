"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HandParticlesCanvas = ({
  leftHandSrc = "/images/leftFinger.png",
  rightHandSrc = "/images/rightFinger.png",
  colorBg = "#0B1A2C",
  colorDots = "255, 255, 255", // RGB values for dots
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mousePos = useRef({ x: 9999, y: 9999 });
  const currentMousePos = useRef({ x: 9999, y: 9999 });
  const hoverStrength = useRef(0.0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mousePos.current.x = e.clientX - rect.left;
        mousePos.current.y = e.clientY - rect.top;
      } else {
        mousePos.current.x = 9999;
        mousePos.current.y = 9999;
      }
    };

    const onLeave = () => {
      mousePos.current.x = 9999;
      mousePos.current.y = 9999;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    let isDestroyed = false;
    let particles = [];
    let leftHandPoints = [];
    let rightHandPoints = [];
    let leftAspect = 1;
    let rightAspect = 1;

    // Helper to sample non-transparent pixels from an image with 3D depth & boundary details
    const sampleHandImage = (imageSrc) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;
        img.onload = () => {
          const aspect = img.naturalWidth / img.naturalHeight;
          const sampleW = 500;
          const sampleH = Math.round(sampleW / aspect);

          const sampleCanvas = document.createElement("canvas");
          const sampleCtx = sampleCanvas.getContext("2d");
          sampleCanvas.width = sampleW;
          sampleCanvas.height = sampleH;

          sampleCtx.clearRect(0, 0, sampleW, sampleH);
          sampleCtx.drawImage(img, 0, 0, sampleW, sampleH);

          const imgData = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;

          const step = 3;
          const colsCount = Math.ceil(sampleW / step);
          const rowsCount = Math.ceil(sampleH / step);
          const blocks = [];

          for (let r = 0; r < rowsCount; r++) {
            blocks[r] = [];
            for (let c = 0; c < colsCount; c++) {
              const ix = Math.floor(c * step);
              const iy = Math.floor(r * step);
              if (ix < sampleW && iy < sampleH) {
                const idx = (iy * sampleW + ix) * 4;
                const alpha = imgData[idx + 3];
                const red = imgData[idx];
                const green = imgData[idx + 1];
                const blue = imgData[idx + 2];
                const brightness = (red + green + blue) / 3;

                if (alpha > 40 && brightness > 30) {
                  const depth = (brightness / 255) * 0.7 + Math.random() * 0.3;
                  blocks[r][c] = {
                    x: ix,
                    y: iy,
                    normX: ix / sampleW,
                    normY: iy / sampleH,
                    baseAlpha: Math.min(1.0, Math.max(0.25, (alpha / 255) * (0.5 + depth * 0.5))),
                    depth,
                  };
                } else {
                  blocks[r][c] = null;
                }
              } else {
                blocks[r][c] = null;
              }
            }
          }

          const points = [];
          const boundaryPoints = [];

          for (let r = 0; r < rowsCount; r++) {
            for (let c = 0; c < colsCount; c++) {
              const pt = blocks[r][c];
              if (pt) {
                let isBoundary = false;
                for (let dr = -1; dr <= 1; dr++) {
                  for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr < 0 || nr >= rowsCount || nc < 0 || nc >= colsCount || !blocks[nr][nc]) {
                      isBoundary = true;
                    }
                  }
                }
                pt.isBoundary = isBoundary;
                points.push(pt);
                if (isBoundary) boundaryPoints.push(pt);
              }
            }
          }

          let maxDist = 0;
          points.forEach((p) => {
            if (p.isBoundary) {
              p.edgeDist = 0;
            } else {
              let minDist = Infinity;
              boundaryPoints.forEach((bp) => {
                const dx = p.x - bp.x;
                const dy = p.y - bp.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < minDist) minDist = d;
              });
              p.edgeDist = minDist;
              if (minDist > maxDist) maxDist = minDist;
            }
          });

          points.forEach((p) => {
            p.normalizedEdge = maxDist > 0 ? (p.isBoundary ? 1.0 : 1.0 - (p.edgeDist / maxDist)) : 1.0;
          });

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
      let maxHandH;
      if (isMobile) {
        maxHandH = Math.max(width * 0.55, height * 0.32);
      } else if (isTablet) {
        maxHandH = Math.max(width * 0.50, height * 0.45);
      } else {
        maxHandH = Math.max(height * 0.80, width * 0.60);
      }

      // Left hand dimensions
      const leftH = maxHandH;
      const leftW = leftH * leftAspect;

      // Right hand dimensions
      const rightH = maxHandH;
      const rightW = rightH * rightAspect;

      // Knuckles / Finger tips meet exactly at the screen center (touchX, touchY)
      const touchX = width * 0.5;
      const touchY = height * 0.5;

      // Dynamically detect exact index finger tip X coordinates from sampled particle points
      let leftTipNormX = 0;
      if (leftHandPoints.length > 0) {
        leftHandPoints.forEach((pt) => {
          if (pt.normX > leftTipNormX) leftTipNormX = pt.normX;
        });
      }

      let rightTipNormX = 1.0;
      if (rightHandPoints.length > 0) {
        rightHandPoints.forEach((pt) => {
          if (pt.normX < rightTipNormX) rightTipNormX = pt.normX;
        });
      }

      // Seamless touch (-2px touchGap) horizontally, and perfect vertical centering at touchY
      const touchGap = -2;

      const leftCenterX = (touchX - touchGap * 0.5) - (leftTipNormX - 0.5) * leftW;
      const leftCenterY = touchY;

      const rightCenterX = (touchX + touchGap * 0.5) - (rightTipNormX - 0.5) * rightW;
      const rightCenterY = touchY;

      // Create Left Hand Particles with exact LogoParticlesNew size curve
      leftHandPoints.forEach((pt) => {
        const targetX = leftCenterX + (pt.normX - 0.5) * leftW;
        const targetY = leftCenterY + (pt.normY - 0.5) * leftH;

        const sizeCurve = Math.pow(pt.normalizedEdge, 2.5);
        const logoTargetSize = 1.2 + (4.5 - 1.2) * sizeCurve;

        particles.push({
          targetX,
          targetY,
          hand: "left",
          baseAlpha: pt.baseAlpha,
          depth: pt.depth,
          normX: pt.normX,
          normY: pt.normY,
          logoTargetSize,
        });
      });

      // Create Right Hand Particles with exact LogoParticlesNew size curve
      rightHandPoints.forEach((pt) => {
        const targetX = rightCenterX + (pt.normX - 0.5) * rightW;
        const targetY = rightCenterY + (pt.normY - 0.5) * rightH;

        const sizeCurve = Math.pow(pt.normalizedEdge, 2.5);
        const logoTargetSize = 1.2 + (4.5 - 1.2) * sizeCurve;

        particles.push({
          targetX,
          targetY,
          hand: "right",
          baseAlpha: pt.baseAlpha,
          depth: pt.depth,
          normX: pt.normX,
          normY: pt.normY,
          logoTargetSize,
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

        const isMobileSize = width < 768;
        const screenResolutionScale = height / 1000.0;
        const uSizeScale = (isMobileSize ? 0.65 : 0.6) * screenResolutionScale;

        const isHovering = mousePos.current.x !== 9999;
        hoverStrength.current += ((isHovering ? 1.0 : 0.0) - hoverStrength.current) * 0.12;

        if (isHovering) {
          if (currentMousePos.current.x === 9999) {
            currentMousePos.current.x = mousePos.current.x;
            currentMousePos.current.y = mousePos.current.y;
          } else {
            currentMousePos.current.x += (mousePos.current.x - currentMousePos.current.x) * 0.2;
            currentMousePos.current.y += (mousePos.current.y - currentMousePos.current.y) * 0.2;
          }
        }

        const bulgeRadius = height * 0.1375;
        const pushDistance = height * 0.06875;
        const glowRadius = height * 0.1625;

        // Render particles with 3D depth parallax & LogoParticlesNew sparkle + bulge animation
        const len = particles.length;
        for (let i = 0; i < len; i++) {
          const p = particles[i];
          // 3D parallax multiplier: foreground dots move slightly faster during horizontal travel
          const depthMultiplier = 0.8 + p.depth * 0.4;
          const currentOffsetX = (p.hand === "left" ? leftOffsetX : rightOffsetX) * depthMultiplier;
          const baseDrawX = p.targetX + currentOffsetX;
          const baseDrawY = p.targetY;

          let drawX = baseDrawX;
          let drawY = baseDrawY;
          let extraGlow = 0.0;

          if (hoverStrength.current > 0.001 && currentMousePos.current.x !== 9999) {
            const dx = baseDrawX - currentMousePos.current.x;
            const dy = baseDrawY - currentMousePos.current.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            const falloff = Math.exp(-(d * d) / (bulgeRadius * bulgeRadius));
            if (falloff > 0.001) {
              const dirX = dx / (d + 0.0001);
              const dirY = dy / (d + 0.0001);
              const push = falloff * pushDistance * hoverStrength.current;
              drawX += dirX * push;
              drawY += dirY * push;
            }

            if (d < glowRadius) {
              extraGlow = (1.0 - d / glowRadius) * hoverStrength.current;
            }
          }

          // Sparkle animation math exact to LogoParticlesNew:
          const posX = p.normX * 5.0 + (p.hand === "right" ? 10.0 : 0.0);
          const posY = p.normY * 5.0;

          const logoSparkleFreq = 2.5 + Math.sin(posX * 35.0 + posY * 45.0) * 1.5;
          const logoSparklePhase = posX * 25.0 + posY * 35.0 + time * 0.4;
          const logoSparkle = Math.sin(time * logoSparkleFreq + logoSparklePhase) * 0.5 + 0.5;
          const logoTwinkle = Math.pow(logoSparkle, 3.0) * 1.6;

          const targetGlow = logoTwinkle * 1.2 + extraGlow;
          const currentAlpha = Math.min(1.0, Math.max(0.0, p.baseAlpha + logoTwinkle * 0.5 + extraGlow * 0.3));
          const targetSz = p.logoTargetSize + targetGlow * 2.0 + logoTwinkle * 1.2;
          const pointDiameter = targetSz * uSizeScale;

          // Draw particle dot as perfect circle
          ctx.beginPath();
          ctx.fillStyle = `rgba(${colorDots}, ${currentAlpha.toFixed(2)})`;
          ctx.arc(drawX, drawY, Math.max(0.1, pointDiameter / 2), 0, Math.PI * 2);
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
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      trigger.kill();
    };
  }, [leftHandSrc, rightHandSrc, colorBg, colorDots]);

  return (
    <div
      ref={containerRef}
      className="relative w-full  h-screen bg-[#0B1A2C] overflow-hidden flex items-center justify-center "
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};

export default HandParticlesCanvas;
