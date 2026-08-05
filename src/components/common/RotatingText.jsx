"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const TITLES = ['Builder', 'Founder ', 'Investor',"Dot Connector"];

export const RotatingText = () => {
  const currentRowRef = useRef(null);
  const nextRowRef = useRef(null);
  const indexRef = useRef(0);

  const buildChars = (text, parent, className) => {
    parent.innerHTML = "";
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = `${className} inline-block`;
      span.style.willChange = "transform";
      span.textContent = char === " " ? "\u00A0" : char;
      parent.appendChild(span);
    });
  };

  useEffect(() => {
    // Set initial word
    if (currentRowRef.current) {
      buildChars(TITLES[0], currentRowRef.current, "char-out");
    }

    const interval = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % TITLES.length;
      const nextWordStr = TITLES[nextIndex];

      // Build next word chars into DOM directly
      if (!currentRowRef.current || !nextRowRef.current) return;
      buildChars(nextWordStr, nextRowRef.current, "char-in");

      const outChars = currentRowRef.current.querySelectorAll(".char-out");
      const inChars = nextRowRef.current.querySelectorAll(".char-in");

      // Set incoming chars below
      gsap.set(inChars, { yPercent: 100 });

      const tl = gsap.timeline({
        onComplete: () => {
          // Swap: move next word text into current row, clear next row
          if (currentRowRef.current && nextRowRef.current) {
            buildChars(nextWordStr, currentRowRef.current, "char-out");
            nextRowRef.current.innerHTML = "";
            gsap.set(currentRowRef.current.querySelectorAll(".char-out"), { yPercent: 0 });
          }
          indexRef.current = nextIndex;
        }
      });

      // Current chars slide out upward (0 -> -100) with stagger
      tl.to(outChars, {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.02
      }, 0);

      // Next chars slide in from below (100 -> 0) with stagger, in parallel
      tl.to(inChars, {
        yPercent: 0,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.02
      }, 0.01);

    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="  relative h-6 overflow-hidden uppercase flex justify-start items-center">
      <div ref={currentRowRef} className="flex relative" />
      <div ref={nextRowRef} className="flex absolute top-0 left-0" />
    </div>
  );
};