"use client";
import React, { useEffect, useRef, useState } from 'react';

export default function LogoParticleHeader() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const [dimensions, setDimensions] = useState(null);
  const particlesDataRef = useRef(null);

  // Load logo SVG and sample pixels to extract particle positions
  useEffect(() => {
    const img = new Image();
    img.src = '/logo.svg';
    img.onload = () => {
      const aspect = img.naturalHeight / img.naturalWidth;
      const isMobile = window.innerWidth < 640;
      const displayW = isMobile ? 32 : 40;
      const displayH = Math.round(displayW * aspect);

      // Sample at 4x display resolution for much finer detail
      const sampleScale = 4;
      const sampleW = displayW * sampleScale;
      const sampleH = displayH * sampleScale;

      const sampleCanvas = document.createElement('canvas');
      const sampleCtx = sampleCanvas.getContext('2d');
      sampleCanvas.width = sampleW;
      sampleCanvas.height = sampleH;
      // Draw on transparent background so we can use alpha channel
      sampleCtx.clearRect(0, 0, sampleW, sampleH);
      sampleCtx.drawImage(img, 0, 0, sampleW, sampleH);
      const imgData = sampleCtx.getImageData(0, 0, sampleW, sampleH).data;

      // Use block-based sampling with center-of-mass for sub-pixel accuracy
      const blockSize = 3; // 3px blocks at 4x = ~0.75 display pixels per dot
      const cols = Math.floor(sampleW / blockSize);
      const rows = Math.floor(sampleH / blockSize);
      const points = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let sumAlpha = 0, sumX = 0, sumY = 0, maxAlpha = 0;
          const startY = r * blockSize;
          const startX = c * blockSize;

          // Scan each pixel in this block
          for (let dy = 0; dy < blockSize; dy++) {
            for (let dx = 0; dx < blockSize; dx++) {
              const px = startX + dx;
              const py = startY + dy;
              if (px < sampleW && py < sampleH) {
                const idx = (py * sampleW + px) * 4;
                const alpha = imgData[idx + 3]; // Use alpha channel for SVG
                const brightness = imgData[idx]; // R channel as fallback
                const weight = Math.max(alpha, brightness);
                if (weight > maxAlpha) maxAlpha = weight;
                if (weight > 60) {
                  sumAlpha += weight;
                  sumX += px * weight;
                  sumY += py * weight;
                }
              }
            }
          }

          // Only create a dot if the block has significant content
          if (maxAlpha > 80 && sumAlpha > 0) {
            const avgX = sumX / sumAlpha;
            const avgY = sumY / sumAlpha;
            points.push({
              tx: (avgX / sampleW) * displayW,
              ty: (avgY / sampleH) * displayH,
            });
          }
        }
      }

      particlesDataRef.current = points;
      setDimensions({ w: displayW, h: displayH });
    };
  }, []);

  // Canvas animation loop
  useEffect(() => {
    if (!dimensions || !particlesDataRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = dimensions;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const particles = particlesDataRef.current.map(pt => ({
      x: pt.tx,
      y: pt.ty,
      tx: pt.tx,
      ty: pt.ty,
      vx: 0,
      vy: 0,
    }));

    const dotSize = 1.2;
    const bulgeRadius = Math.max(w, h) * 0.5;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;

      particles.forEach(p => {
        const ease = 0.1;
        const friction = 0.82;

        p.vx = (p.vx + (p.tx - p.x) * ease) * friction;
        p.vy = (p.vy + (p.ty - p.y) * ease) * friction;
        p.x += p.vx;
        p.y += p.vy;

        // Mouse bulge/dome repulsion effect
        if (mouse.x !== -999) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < bulgeRadius && dist > 0.1) {
            const falloff = Math.exp(-(dist * dist) / (bulgeRadius * bulgeRadius * 0.35));
            p.x += (dx / dist) * falloff * 3.5;
            p.y += (dy / dist) * falloff * 3.5;
          }
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.fillRect(
          Math.round(p.x - dotSize / 2),
          Math.round(p.y - dotSize / 2),
          dotSize,
          dotSize
        );
      });

      animRef.current = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };

    const parent = canvas.closest('a') || canvas;
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dimensions]);

  const displayW = dimensions?.w || 40;
  const displayH = dimensions?.h || 40;

  return (
    <div className="relative max-sm:w-8 w-10 shrink-0" style={{ height: displayH }}>
      {dimensions && (
        <canvas ref={canvasRef} className="absolute inset-0" />
      )}
    </div>
  );
}
