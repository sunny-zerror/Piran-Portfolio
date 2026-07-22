"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const storySteps = [
    {
        id: 1,
        title: "The Quiet Beginning",
        desc: "At school, I was happiest listening rather than speaking. Growing up in a Parsi colony in Colaba taught me observation long before conversation became my strength.",
        icon: "/images/aboutpage/story/icons/icon1.svg",
        img: "/images/aboutpage/story/images/img1.svg",
    },
    {
        id: 2,
        title: "Leaving Home",
        desc: "Everything changed when AIESEC sent me abroad. From Ukraine and Prague to Egypt and later Sweden, every unfamiliar place became an opportunity to connect with people beyond language and culture.",
        icon: "/images/aboutpage/story/icons/icon2.svg",
        img: "/images/aboutpage/story/images/img2.svg",
    },
    {
        id: 3,
        title: "Becoming a Connector",
        desc: "Meeting strangers became second nature. Different cultures taught me how to find common ground quickly, build trust, and create relationships that lasted far beyond first conversations.",
        icon: "/images/aboutpage/story/icons/icon3.svg",
        img: "/images/aboutpage/story/images/img3.svg",
    },
    {
        id: 4,
        title: "Motion Isn't Progress",
        desc: "Success came early, but so did distraction. I spent years optimizing everything, believing doing more meant moving forward, until I realized that activity isn't the same as purpose.",
        icon: "/images/aboutpage/story/icons/icon4.svg",
        img: "/images/aboutpage/story/images/img4.svg",
    },
    {
        id: 5,
        title: "Ten Days of Silence",
        desc: "Vipassana became the turning point. Ten days without conversation, technology, or work helped strip away the noise and brought clarity about what truly mattered.",
        icon: "/images/aboutpage/story/icons/icon5.svg",
        img: "/images/aboutpage/story/images/img5.svg",
    },
    {
        id: 6,
        title: "Building with Intention",
        desc: "That clarity reshaped how I work. Today every project begins with one principle: understand what truly matters, build around it, and let everything else follow naturally.",
        icon: "/images/aboutpage/story/icons/icon6.svg",
        img: "/images/aboutpage/story/images/img6.svg",
    },
    {
        id: 7,
        title: "What's Next",
        desc: "Today I'm building a nutraceutical company—not simply to fill a market gap, but to create something that helps people find balance, focus, and a better version of themselves.",
        icon: "/images/aboutpage/story/icons/icon7.svg",
        img: "/images/aboutpage/story/images/img7.svg",
    },
];

/* ═════════════════ Staggered Water Drop Canvas Reveal Component ═════════════════ */
const StoryWaterDropCanvas = ({ activeIndex }) => {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const prevIndexRef = useRef(activeIndex);
  const animRef = useRef(null);
  const startTimeRef = useRef(null);

  // Preload all 7 SVG images into native Image objects
  useEffect(() => {
    const loadedImgs = storySteps.map((step) => {
      const img = new window.Image();
      img.src = step.img;
      return img;
    });
    imagesRef.current = loadedImgs;
  }, []);

  // Generate 10 staggered water drop impact positions
  const generateDrops = () => {
    const drops = [];
    for (let i = 0; i < 10; i++) {
      drops.push({
        x: 0.15 + Math.random() * 0.7, // Random X (15% to 85% width)
        y: 0.1 + Math.random() * 0.8,  // Random Y (10% to 90% height)
        delay: i * 0.08,               // Stagger delay per drop
        maxRadius: 0.35 + Math.random() * 0.25, // Max ripple radius
      });
    }
    return drops;
  };

  const currentDrops = useRef(generateDrops());

  useEffect(() => {
    if (prevIndexRef.current !== activeIndex) {
      currentDrops.current = generateDrops();
      startTimeRef.current = performance.now();
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const fadeOutDuration = 350; // Smooth 350ms fade out of old image
      const revealDuration = 1200;  // 1.2s staggered water drop reveal of new image
      const totalDuration = fadeOutDuration + revealDuration;

      const render = (time) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;
        const globalProgress = Math.min(elapsed / totalDuration, 1.0);

        const w = canvas.width;
        const h = canvas.height;
        if (w === 0 || h === 0) return;

        ctx.clearRect(0, 0, w, h);

        const prevImg = imagesRef.current[prevIndexRef.current];
        const currImg = imagesRef.current[activeIndex];

        // ── Phase 1: Smoothly fade out old image ──
        if (elapsed < fadeOutDuration) {
          const fadeAlpha = 1.0 - (elapsed / fadeOutDuration);
          if (prevImg && prevImg.complete && prevImg.naturalWidth > 0) {
            ctx.globalAlpha = Math.max(0, fadeAlpha);
            ctx.drawImage(prevImg, 0, 0, w, h);
          }
        } else {
          // ── Phase 2: Water droplet staggered reveal for the new image ──
          const revealElapsed = elapsed - fadeOutDuration;
          const revealProgress = Math.min(revealElapsed / revealDuration, 1.0);

          if (currImg && currImg.complete && currImg.naturalWidth > 0) {
            ctx.save();
            ctx.beginPath();

            // Draw ink splash blot shape with organic liquid tendrils & droplets
            const drawInkSplash = (ctx, cx, cy, r, numPoints, seed) => {
              if (r <= 0) return;
              ctx.moveTo(cx + r, cy);
              for (let a = 0; a < Math.PI * 2; a += 0.15) {
                const noise1 = Math.sin(a * 5.0 + seed * 10.0) * 0.25;
                const noise2 = Math.cos(a * 3.0 + seed * 5.0) * 0.18;
                // Tendril spikes
                const spike = Math.pow(Math.max(0, Math.sin(a * 4.0 + seed)), 6.0) * 0.55;
                const radius = r * (1.0 + noise1 + noise2 + spike);
                const x = cx + Math.cos(a) * radius;
                const y = cy + Math.sin(a) * radius;
                ctx.lineTo(x, y);
              }
              ctx.closePath();

              // Extra tiny satellite splatter droplets
              for (let i = 0; i < 4; i++) {
                const angle = seed * 3.0 + i * 1.57;
                const dist = r * (1.3 + Math.sin(seed + i) * 0.2);
                const dropR = Math.max(1, r * 0.08 * (Math.cos(seed * 2 + i) * 0.5 + 0.5));
                const dx = cx + Math.cos(angle) * dist;
                const dy = cy + Math.sin(angle) * dist;
                ctx.moveTo(dx + dropR, dy);
                ctx.arc(dx, dy, dropR, 0, Math.PI * 2);
              }
            };

            currentDrops.current.forEach((drop, idx) => {
              const dropProgress = Math.max(0, Math.min(1, (revealProgress - drop.delay) / (1.0 - drop.delay)));
              if (dropProgress > 0) {
                const maxDim = Math.max(w, h);
                const radius = dropProgress * drop.maxRadius * maxDim * 1.1;
                const cx = drop.x * w;
                const cy = drop.y * h;
                drawInkSplash(ctx, cx, cy, radius, 12, idx + 1.0);
              }
            });

            ctx.clip();
            ctx.globalAlpha = 1.0;
            ctx.drawImage(currImg, 0, 0, w, h);
            ctx.restore();
          }
        }

        if (globalProgress < 1.0) {
          animRef.current = requestAnimationFrame(render);
        } else {
          prevIndexRef.current = activeIndex;
        }
      };

      if (animRef.current) cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(render);
    }
  }, [activeIndex]);

  // Handle canvas sizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        
        const ctx = canvas.getContext('2d');
        const currImg = imagesRef.current[activeIndex];
        if (currImg && currImg.complete) {
          ctx.drawImage(currImg, 0, 0, canvas.width, canvas.height);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return <canvas ref={canvasRef} className="w-full h-full object-contain" />;
};

const StorySection = () => {
    const [activeIndex, setActiveIndex] = useState(-1); // Start unrevealed until triggered
    const triggerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: triggerRef.current,
                start: "top center", // Trigger initial animation when section reaches top center
                end: "bottom bottom",
                scrub: 0.5,
                onEnter: () => {
                    setActiveIndex(0); // Trigger 1st image drop reveal when reaching top center
                },
                onLeaveBack: () => {
                    setActiveIndex(-1); // Reset when scrolling back up
                },
                onUpdate: (self) => {
                    if (self.progress > 0) {
                        const step = Math.min(
                            Math.floor(self.progress * storySteps.length),
                            storySteps.length - 1
                        );
                        setActiveIndex(step);
                    }
                },
            });
        }, triggerRef);

        return () => ctx.revert();
    }, []);

    const activeStory = storySteps[Math.max(0, activeIndex)];

    return (
        <div ref={triggerRef} className="w-full h-[500vh] relative bg-[#ECE3DB]">
            <div className="sticky top-0 h-screen w-full overflow-hidden text-[#0B1A2C] flex flex-col justify-between py-12">

                {/* Main Content Layout Container */}
                <div className="container h-full flex flex-col justify-center space-y-40 relative z-10">

                    {/* Main Title Header */}
                    <div className="max-w-md pt-4">
                        <h2 data-para-effect className=" leading-none tracking-tight text-[#0B1A2C]">
                            The Story of My<br />Life Journey
                        </h2>
                    </div>

                    {/* Icon Timeline / Stepper Buttons */}
                    <div className="flex items-center gap-2">
                        {storySteps.map((step, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative group p-3 md:p-4 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${isActive
                                            ? 'bg-[#0B1A2C] border border-dashed border-[#0B1A2C]'
                                            : 'bg-transparent border border-dashed border-gray-400 hover:border-[#0B1A2C]'
                                        }`}
                                >
                                    <div className="w-6 h-6 md:w-7 md:h-7 relative flex items-center justify-center">
                                        <Image
                                            src={step.icon}
                                            alt={step.title}
                                            width={28}
                                            height={28}
                                            className={`w-full h-full object-contain transition-all duration-300 ${isActive ? 'brightness-0 invert' : ' group-hover:opacity-100'
                                                }`}
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Story Description (Bottom Left) */}
                    <div className="max-w-xl pb-6 transition-all duration-500">
                        <h4 data-para-effect className=" font-medium  text-[#0B1A2C]">
                            {activeStory.title}
                        </h4>
                        <p data-para-effect className=" text-[#0B1A2C]/70 leading-tight ">
                            {activeStory.desc}
                        </p>
                    </div>
                </div>

                {/* Right Side Illustration Canvas Container */}
                <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 lg:w-1/2 h-full pointer-events-none overflow-hidden z-0 flex items-center justify-end p-4">
                    <StoryWaterDropCanvas activeIndex={activeIndex} />
                </div>

            </div>
        </div>
    );
};

export default StorySection;