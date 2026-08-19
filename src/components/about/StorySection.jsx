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
    title: "Born Watching",
    desc: "I grew up in South Bombay. At school I was the one in my own head, happier watching the room than holding it. Observation came long before conversation.",
    icon: "/images/aboutpage/story/icons/icon1.svg",
    img: "/images/aboutpage/story/images/img1.svg",
  },
  {
    id: 2,
    title: "Leaving Home",
    desc: "What pulled me out was leaving, and it started closer to home than a passport. The Rotaract Club at H.R. College meant events almost every other day, and people from across Bombay, sometimes across India. Then participating in exchanges took me further: Ukraine, Prague, and Egypt with AIESEC, a summer in Sweden with CISV. Rooms full of people who didn't share my language or my context, where the only way through was to actually talk to someone.",
    icon: "/images/aboutpage/story/icons/icon2.svg",
    img: "/images/aboutpage/story/images/img2.svg",
  },
  {
    id: 3,
    title: "The Thread",
    desc: "I got good at finding the common thread quickly, building a conversation, turning strangers into people I'd still know years later. It's still, by some distance, the thing I'm best at.",
    icon: "/images/aboutpage/story/icons/icon3.svg",
    img: "/images/aboutpage/story/images/img3.svg",
  },
  {
    id: 4,
    title: "Everything at Once",
    desc: "The work came after that, and I was good at it. I was also, for a long stretch, completely scattered: optimising everything at once, mistaking motion for progress, certain that doing more was the same as getting somewhere. It wasn't.",
    icon: "/images/aboutpage/story/icons/icon4.svg",
    img: "/images/aboutpage/story/images/img4.svg",
  },
  {
    id: 5,
    title: "Ten Days of Silence",
    desc: "Then I stopped. Ten days: no talking, no phone, no work, nothing to manage but my own attention. I came out clearer than I'd been in years about what I wanted a life to be made of: people I love, work that means something, and things that could outlast me. I came back with a set of values I try to live by.",
    icon: "/images/aboutpage/story/icons/icon5.svg",
    img: "/images/aboutpage/story/images/img5.svg",
  },
  {
    id: 6,
    title: "What Comes First",
    desc: "The work absorbed all of it, and one discipline settled above the rest: the brand comes first, before the founder's instinct, even before mine. The same goes for how I measure the years: I'd rather grow by helping the people around me grow, and take them with me.",
    icon: "/images/aboutpage/story/icons/icon6.svg",
    img: "/images/aboutpage/story/images/img6.svg",
  },
  {
    id: 7,
    title: "The Short List",
    desc: "I'm still figuring most of it out, and that's never felt like a problem. I just want fewer things now, made carefully, with the people I'd keep for the long version of all of it.",
    icon: "/images/aboutpage/story/icons/icon7.svg",
    img: "/images/aboutpage/story/images/img7.svg",
  },
];

/* ═════════════════ Staggered Water Drop Canvas Reveal Component ═════════════════ */
const StoryWaterDropCanvas = ({ activeIndex }) => {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const lastActiveIndexRef = useRef(activeIndex);
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
    if (lastActiveIndexRef.current !== activeIndex) {
      const fromIndex = lastActiveIndexRef.current;
      lastActiveIndexRef.current = activeIndex;

      currentDrops.current = generateDrops();
      startTimeRef.current = performance.now();

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const fadeOutDuration = 150; // Smooth 150ms fade out of old image
      const revealDuration = 450;  // 450ms staggered water drop reveal of new image
      const totalDuration = fadeOutDuration + revealDuration;

      const render = (time) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;
        const globalProgress = Math.min(elapsed / totalDuration, 1.0);

        const w = canvas.width;
        const h = canvas.height;
        if (w === 0 || h === 0) return;

        ctx.clearRect(0, 0, w, h);

        const prevImg = imagesRef.current[fromIndex];
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
        if (currImg) {
          if (currImg.complete && currImg.naturalWidth > 0) {
            ctx.drawImage(currImg, 0, 0, canvas.width, canvas.height);
          } else {
            currImg.onload = () => {
              if (canvasRef.current) {
                const currentCtx = canvasRef.current.getContext('2d');
                currentCtx.drawImage(currImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
              }
            };
          }
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
  const [activeIndex, setActiveIndex] = useState(0); // Start at 0 so first step is pre-selected
  const triggerRef = useRef(null);
  const textRef = useRef(null);
  const stRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [activeIndex]);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      stRef.current = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top center", // Trigger initial animation when section reaches top center
        end: "bottom bottom",
        // markers: true,
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
    });

    return () => {
      mm.revert();
      stRef.current = null;
    };
  }, []);

  const handleDotClick = (idx) => {
    if (stRef.current && window.innerWidth >= 768) {
      const st = stRef.current;
      const progress = (idx + 0.5) / storySteps.length;
      const scrollPos = st.start + (st.end - st.start) * progress;
      window.scrollTo({ top: scrollPos, behavior: 'smooth' });
    } else {
      setActiveIndex(idx);
    }
  };

  const activeStory = storySteps[Math.max(0, activeIndex)];

  return (
    <div ref={triggerRef} className={`w-full h-auto md:h-[500vh] relative transition-colors duration-500 ${activeStory?.id === 5 ? 'bg-[#0B1A2C]' : 'bg-[#E3E2DC]'}`}>
      <div className={`relative md:sticky top-0 h-auto md:h-screen w-full overflow-hidden flex flex-col justify-between py-12 transition-colors duration-500 ${activeStory?.id === 5 ? 'text-white' : 'text-[#0B1A2C]'}`}>

        {/* Main Content Layout Container */}
        <div className="container h-full flex flex-col  justify-center gap-y-8 md:gap-y-32 relative z-10">

          {/* Main Title Header */}
          <div className="max-w-md pt-4">
            <h2 data-para-effect className={`leading-none tracking-tight transition-colors duration-500 ${activeStory?.id === 5 ? 'text-white' : 'text-[#0B1A2C]'}`}>
              The Story of My<br />Life Journey
            </h2>
          </div>

          {/* Icon Timeline / Stepper Buttons */}
          <div className="flex items-center justify-between  md:justify-start md:gap-x-2 scroller_none pb-2 w-full">
            {storySteps.map((step, idx) => {
              const isStep5Active = activeStory?.id === 5;
              const isActive = idx === activeIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => handleDotClick(idx)}
                  className={`relative group p-3 md:p-4 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer shrink-0 ${isActive
                      ? isStep5Active
                        ? 'bg-white border border-dashed border-[#0B1A2C]'
                        : 'bg-[#0B1A2C] border border-dashed border-[#0B1A2C]'
                      : isStep5Active
                        ? 'bg-transparent border border-dashed border-white/50 hover:border-white'
                        : 'bg-transparent border border-dashed border-gray-400 hover:border-[#0B1A2C]'
                    }`}
                >
                  <div className="w-6 h-6 md:w-7 md:h-7 relative flex items-center justify-center">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={28}
                      height={28}
                      className={`w-full h-full object-contain transition-all duration-300 ${isActive
                          ? isStep5Active ? 'brightness-0' : 'brightness-0 invert'
                          : isStep5Active ? 'brightness-0 invert opacity-70 group-hover:opacity-100' : 'group-hover:opacity-100'
                        }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Canvas Illustration */}
          <div className="w-full md:hidden z-0 relative">
            {activeStory?.id === 5 ? (
              <div className="flex items-center justify-center py-6 px-2 w-full h-full">
                <div className="space-y-4 ">
                  <h3 className="text-xl font-medium leading-tight text-white">
                    Dream Boldly, Act Fearlessly & Live with Purpose.
                  </h3>
                  <div className="flex flex-wrap  gap-x-2 gap-y-2 text-xs text-white/80">
                    <span className="border border-white/20 rounded-full px-3 py-1">Ambition with Integrity</span>
                    <span className="border border-white/20 rounded-full px-3 py-1">Fairness & Equity</span>
                    <span className="border border-white/20 rounded-full px-3 py-1">Discipline & Consistency</span>
                    <span className="border border-white/20 rounded-full px-3 py-1">Generosity without Calculation</span>
                    <span className="border border-white/20 rounded-full px-3 py-1">Respect & Admiration</span>
                    <span className="border border-white/20 rounded-full px-3 py-1">Inspire through Action</span>
                    <span className="border border-white/20 rounded-full px-3 py-1">Make Memories</span>
                    <span className="border border-white/20 rounded-full px-3 py-1">Create Value</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video pointer-events-none">
                <StoryWaterDropCanvas activeIndex={activeIndex} />
              </div>
            )}
          </div>


          {/* Active Story Description (Bottom Left) */}
          <div ref={textRef} className="max-w-xl md:h-52 space-y-2 relative z-20">
            <h4 data-para-effect className={`font-medium transition-colors duration-500 ${activeStory?.id === 5 ? 'text-white' : 'text-[#0B1A2C]'}`}>
              {activeStory.title}
            </h4>
            <p data-para-effect className={`leading-tight transition-colors duration-500 ${activeStory?.id === 5 ? 'text-white/70' : 'text-[#0B1A2C]/70'}`}>
              {activeStory.desc}
            </p>
          </div>
        </div>

        {/* Right Side Illustration Canvas Container */}
        <div className="hidden md:flex absolute right-0 top-0 bottom-0 w-full md:w-3/5 lg:w-1/2 h-full overflow-hidden z-0 items-center justify-end p-4">
          <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${activeStory?.id === 5 ? 'opacity-0' : 'opacity-100'}`}>
            <StoryWaterDropCanvas activeIndex={activeIndex} />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center p-8 lg:p-24 ${activeStory?.id === 5 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none -z-10'}`}>
            <div className="flex flex-col gap-8 justify-center w-full h-full items-start text-left">
              <h3 className="text-3xl lg:text-5xl font-medium leading-tight text-white max-w-xl">
                Dream Boldly, Act Fearlessly & Live with Purpose.
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-3 text-sm lg:text-base text-white/80 max-w-xl font-medium">
                <span className="border border-white/20 rounded-full px-4 py-2">Ambition with Integrity</span>
                <span className="border border-white/20 rounded-full px-4 py-2">Fairness & Equity</span>
                <span className="border border-white/20 rounded-full px-4 py-2">Discipline & Consistency</span>
                <span className="border border-white/20 rounded-full px-4 py-2">Generosity without Calculation</span>
                <span className="border border-white/20 rounded-full px-4 py-2">Respect & Admiration</span>
                <span className="border border-white/20 rounded-full px-4 py-2">Inspire through Action</span>
                <span className="border border-white/20 rounded-full px-4 py-2">Make Memories</span>
                <span className="border border-white/20 rounded-full px-4 py-2">Create Value</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StorySection;