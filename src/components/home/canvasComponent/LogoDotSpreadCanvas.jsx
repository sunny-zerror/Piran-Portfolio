"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LogoDotSpreadCanvas = ({
  colorBg = "#0B1A2C",
  colorDots = "#e3e2dc",
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const animFrameRef = useRef(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];

    // Fast inline helpers
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (val, min, max) => (val < min ? min : val > max ? max : val);
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const buildParticles = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      width = rect.width || container.clientWidth;
      height = rect.height || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Single central origin point
      const cx = width / 2;
      const cy = height / 2;

      // Wider spacing = fewer particles = smoother 60fps
      const spacing = Math.max(28, Math.min(width, height) / 24);
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      // Max distance to corners
      let maxDist = 0;
      [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: 0, y: height },
        { x: width, y: height },
      ].forEach((corner) => {
        const d = Math.hypot(corner.x - cx, corner.y - cy);
        if (d > maxDist) maxDist = d;
      });

      particles = [];
      let index = 0;

      for (let r = 0; r < rows; r++) {
        const rowShift = (r % 2 === 0 ? 0 : 0.5) * spacing;
        for (let c = 0; c < cols; c++) {
          const jitterX = (Math.random() - 0.5) * spacing * 0.4;
          const jitterY = (Math.random() - 0.5) * spacing * 0.4;
          const targetX = (c - 0.5) * spacing + rowShift + jitterX;
          const targetY = (r - 0.5) * spacing + jitterY;

          const dx = targetX - cx;
          const dy = targetY - cy;
          const dist = Math.hypot(dx, dy);
          const normDist = dist / (maxDist || 1);

          const len = dist || 1;
          const nx = -dy / len;
          const ny = dx / len;

          const curlSign = (index % 2 === 0 ? 1 : -1) * (0.4 + Math.random() * 0.6);
          const delayOffset = (Math.random() - 0.5) * 0.08;
          const clarityBallRadius = Math.max(1.5, Math.min(2.8, spacing * 0.22));
          const blendRadius = spacing * 0.9;

          particles.push({
            originX: cx,
            originY: cy,
            deltaX: dx,
            deltaY: dy,
            nx,
            ny,
            curlSign,
            clarityBallRadius,
            blendRadius,
            startP: clamp(normDist * 0.55 + delayOffset, 0, 0.7),
          });
          index++;
        }
      }
    };

    buildParticles();

    const handleResize = () => {
      buildParticles();
      requestRender();
    };
    window.addEventListener("resize", handleResize);

    let currentP = 0;

    const render = () => {
      const targetP = progressRef.current;
      const diff = targetP - currentP;

      // Responsive, fast lerp to eliminate scroll input lag
      if (Math.abs(diff) > 0.0001) {
        currentP = currentP + diff * 0.45;
        isAnimatingRef.current = true;
      } else {
        currentP = targetP;
        isAnimatingRef.current = false;
      }

      // Clear background once
      ctx.fillStyle = colorBg;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = colorDots;

      const mergeFactor = easeInOutCubic(clamp((currentP - 0.58) / 0.42, 0, 1));

      // BATCH ALL PARTICLES INTO A SINGLE CANVAS PATH
      ctx.beginPath();

      const numParticles = particles.length;
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        const startP = p.startP;

        if (currentP <= startP) continue;

        const rawLocalP = (currentP - startP) / 0.35;
        const clampedP = rawLocalP > 1 ? 1 : rawLocalP;

        // Fast inline easeOutCubic
        const invP = 1 - clampedP;
        const localP = 1 - invP * invP * invP;

        const baseLerpX = p.originX + p.deltaX * localP;
        const baseLerpY = p.originY + p.deltaY * localP;

        // Toned down arc motion (8px max arc offset)
        const arc = Math.sin(clampedP * Math.PI) * 8 * p.curlSign;
        const x = baseLerpX + p.nx * arc;
        const y = baseLerpY + p.ny * arc;

        const baseRadius = p.clarityBallRadius * localP;
        const finalRadius = baseRadius + mergeFactor * (p.blendRadius - baseRadius);

        if (finalRadius > 0.1) {
          ctx.moveTo(x + finalRadius, y);
          ctx.arc(x, y, finalRadius, 0, Math.PI * 2);
        }
      }

      ctx.fill();

      // Wakes render loop only when animating / scrolling
      if (isAnimatingRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        animFrameRef.current = null;
      }
    };

    const requestRender = () => {
      if (!animFrameRef.current) {
        isAnimatingRef.current = true;
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    // GSAP ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        requestRender();
      },
    });

    requestRender();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      trigger.kill();
    };
  }, [colorBg, colorDots]);

  useGSAP(() => {
    const ttl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        // markers: true,
        scrub: true,
      },
    })
    ttl.to(".meet_txt h2", {
      x: (index, target) => {
        const parent = target.parentElement;
        const style = getComputedStyle(parent);
        const pl = parseFloat(style.paddingLeft) || 0;
        const pr = parseFloat(style.paddingRight) || 0;
        const contentWidth = parent.clientWidth - pl - pr;
        return -(contentWidth - target.offsetWidth) / 2;
      },
    }, 0)
      .to(".meet_txt h2", {
        color: "#0B1A2C",
      }, 0)
      .to(".par_res_hed", {
        opacity: 70,
      }, 0)
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[200vh]   z-99 bg-[#0B1A2C]"
    >
      <div className="w-full h-screen sticky top-0 flex-col center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none block"
        />
        <div className=" sticky! top-1/2 -translate-y-1/2 w-full  container h-fit!  meet_txt  flex flex-col items-center leading-none ">
          <h2 className="text-white">Where I</h2>
          <h2 className="text-white">Come In.</h2>
          <div className="w-full pr-4 md:pr-10 absolute max-sm:space-y-2 md:grid grid-cols-6">
            <div className=' col-span-4 '></div>
            <p className='opacity-0 par_res_hed leading-tight col-span-2 text-lg'>Founders rarely call about strategy. They call because something feels misaligned drift, friction, growth that costs more than it returns. The problem is rarely effort. It's position. The brand never had one to organise around. Finding it is where I come in.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoDotSpreadCanvas;
