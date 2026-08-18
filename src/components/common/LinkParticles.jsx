"use client";
import React, { useEffect, useRef, useMemo } from 'react';

export default function LinkParticles({ shape, active, hovered, size = 24, color = "255, 255, 255" }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const isHoveredRef = useRef(false);
  const mouseRef = useRef({ x: -999, y: -999 });

  const colorRef = useRef(color);

  useEffect(() => {
    isHoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  // Pre-process shape: normalize coordinates to canvas space
  const normalizedPoints = useMemo(() => {
    if (!shape || shape.length === 0) return [];

    const minX = Math.min(...shape.map(p => p[0]));
    const maxX = Math.max(...shape.map(p => p[0]));
    const minY = Math.min(...shape.map(p => p[1]));
    const maxY = Math.max(...shape.map(p => p[1]));

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const range = Math.max(rangeX, rangeY);

    const padding = 2;
    const fitSize = size - padding * 2;

    return shape.map(p => ({
      tx: padding + ((p[0] - cx) / range + 0.5) * fitSize,
      ty: padding + ((p[1] - cy) / range + 0.5) * fitSize,
    }));
  }, [shape, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || normalizedPoints.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;

    // Each particle tracks its current position with velocity for spring physics
    const particles = normalizedPoints.map(pt => ({
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      tx: pt.tx,
      ty: pt.ty,
    }));

    const dotSize = 1.5; // Single square dot size in pixels
    const bulgeRadius = size * 0.45; // Radius of the mouse bulge dome effect

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      const showShape = active || isHoveredRef.current;
      const mouse = mouseRef.current;

      particles.forEach((p, i) => {
        // Target: shape position or collapsed center
        let targetX = showShape ? p.tx : centerX;
        let targetY = showShape ? p.ty : centerY;

        // Spring physics
        const ease = showShape ? 0.12 : 0.15;
        const friction = showShape ? 0.82 : 0.78;

        p.vx = (p.vx + (targetX - p.x) * ease) * friction;
        p.vy = (p.vy + (targetY - p.y) * ease) * friction;
        p.x += p.vx;
        p.y += p.vy;

        // ── Mouse bulge/dome repulsion (only when shape is visible) ──
        if (showShape && mouse.x !== -999) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < bulgeRadius && dist > 0.1) {
            // Gaussian-like smooth dome falloff (matches original WebGPU shader behaviour)
            const falloff = Math.exp(-(dist * dist) / (bulgeRadius * bulgeRadius * 0.35));
            const pushStrength = falloff * 3.5;
            p.x += (dx / dist) * pushStrength;
            p.y += (dy / dist) * pushStrength;
          }
        }

        // Calculate distance from center to fade out overlapping dots when collapsed
        const distFromCenter = Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2);

        let opacity;
        if (showShape) {
          opacity = 0.95;
        } else {
          if (i === 0) {
            opacity = 0.85;
          } else {
            opacity = Math.min(1, distFromCenter / 3) * 0.7;
            if (opacity < 0.03) opacity = 0;
          }
        }

        if (opacity > 0.01) {
          ctx.fillStyle = `rgba(${colorRef.current}, ${opacity})`;
          ctx.fillRect(
            Math.round(p.x - dotSize / 2),
            Math.round(p.y - dotSize / 2),
            dotSize,
            dotSize
          );
        }
      });

      animRef.current = requestAnimationFrame(render);
    };

    render();

    // ── Mouse tracking on the canvas and its parent link/button ──
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };

    const parentLink = canvas.closest('a') || canvas.closest('button') || canvas;
    parentLink.addEventListener('mousemove', handleMouseMove);
    parentLink.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      parentLink.removeEventListener('mousemove', handleMouseMove);
      parentLink.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [normalizedPoints, active, size]);

  return (
    <div className="flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
