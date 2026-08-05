"use client";

import React, { useRef, useEffect } from "react";
import { Link } from "next-view-transitions";
import gsap from "gsap";

export default function NotFound() {
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const wordsRef = useRef([]);

  const text = "This page never had a position to organise around.";
  const words = text.split(" ");

  useEffect(() => {
    if (!containerRef.current || !buttonRef.current) return;

    // Initialize scatter properties with more extreme bounds for a "drifting in space" feel
    const scatterData = words.map(() => ({
      x: (Math.random() - 0.5) * 1000, 
      y: (Math.random() - 0.5) * 800, 
      rotation: (Math.random() - 0.5) * 180,
      z: (Math.random() - 0.5) * 500,
      driftSpeed: 0.5 + Math.random() * 1.5,
      driftOffset: Math.random() * Math.PI * 2
    }));

    // Start words scattered
    wordsRef.current.forEach((word, i) => {
      if (word) {
        gsap.set(word, {
          x: scatterData[i].x,
          y: scatterData[i].y,
          rotation: scatterData[i].rotation,
          z: scatterData[i].z,
          opacity: 0,
        });
        
        gsap.to(word, {
          opacity: 1,
          duration: 2,
          delay: 0.1 * i,
          ease: "power2.out"
        });
      }
    });

    let targetProgress = 0; // 0 = scattered, 1 = snapped to position
    let currentProgress = 0;

    const handleMouseMove = (e) => {
      const rect = buttonRef.current.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;
      
      const maxDistance = 700; // Trigger distance
      const distance = Math.hypot(e.clientX - btnX, e.clientY - btnY);
      
      // Calculate how close cursor is to the button
      let proximity = 1 - Math.min(distance / maxDistance, 1);
      
      // If very close, snap completely
      if (proximity > 0.85) {
        targetProgress = 1;
      } else {
        targetProgress = proximity;
      }
    };
    
    // Ensures words snap into place if hovering directly
    const handleMouseEnter = () => { targetProgress = 1; };
    
    buttonRef.current.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;
    // Ticker for continuous drifting and interpolation
    const onTick = () => {
      time += 0.015;
      
      // Smoothly interpolate currentProgress to targetProgress
      currentProgress += (targetProgress - currentProgress) * 0.07;
      
      wordsRef.current.forEach((word, i) => {
        if (!word) return;
        
        // Calculate drift using sine/cosine for fluid movement
        const driftX = Math.sin(time * scatterData[i].driftSpeed + scatterData[i].driftOffset) * 150;
        const driftY = Math.cos(time * scatterData[i].driftSpeed * 0.8 + scatterData[i].driftOffset) * 150;
        const driftRot = Math.sin(time * scatterData[i].driftSpeed * 1.2 + scatterData[i].driftOffset) * 45;
        
        const scatteredX = scatterData[i].x + driftX;
        const scatteredY = scatterData[i].y + driftY;
        const scatteredRot = scatterData[i].rotation + driftRot;
        
        // LERP between scattered+drifting state and the origin (0, 0, 0)
        const finalX = scatteredX * (1 - currentProgress);
        const finalY = scatteredY * (1 - currentProgress);
        const finalRot = scatteredRot * (1 - currentProgress);
        const finalZ = scatterData[i].z * (1 - currentProgress);
        
        gsap.set(word, {
          x: finalX,
          y: finalY,
          rotation: finalRot,
          z: finalZ
        });
      });
    };
    
    gsap.ticker.add(onTick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (buttonRef.current) {
        buttonRef.current.removeEventListener('mouseenter', handleMouseEnter);
      }
      gsap.ticker.remove(onTick);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen bg-[#0b1a2c] flex flex-col justify-between p-8 md:p-12 overflow-hidden text-[#e3e2dc]">
      <div className="pt-4 z-10 relative">
        <h1 className="text-lg md:text-xl font-medium opacity-0">404 page</h1>
      </div>
      
      <div className="flex-1 center flex-col pointer-events-none" style={{ perspective: "1200px" }}>
        <div className="flex flex-wrap justify-center items-center gap-[0.5rem] md:gap-[0.8rem] max-w-[90vw] md:max-w-4xl min-h-[150px] relative">
          {words.map((word, i) => (
            <span
              key={i}
              ref={(el) => (wordsRef.current[i] = el)}
              className="inline-block text-3xl md:text-5xl lg:text-7xl font-medium tracking-tight"
              style={{ willChange: "transform, opacity" }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="pb-8 center z-10 relative">
        <Link
          href="/"
          ref={buttonRef}
          className="group relative flex items-center gap-3 text-lg md:text-2xl font-medium transition-all duration-300"
        >
          <span className="hover:underline">[ Begin again ]</span>
        </Link>
      </div>
    </div>
  );
}
