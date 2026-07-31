"use client";
import React, { useRef, useState, useEffect } from 'react';
import { RiPlayFill, RiCloseLine } from '@remixicon/react';
import LogoParticles from './LogoParticles';
import { VideoWebGLTransition } from './canvasComponent/VideoWebGLTransition';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import SplitText from 'gsap/dist/SplitText'
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
gsap.registerPlugin(ScrollTrigger, SplitText)


const TITLES = ['Brand Architect', 'Growth Strategist', 'Vision Builder'];

const RotatingText = () => {
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

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" hero_logos opacity-0 relative h-6 overflow-hidden uppercase flex justify-start items-center">
      <div ref={currentRowRef} className="flex relative" />
      <div ref={nextRowRef} className="flex absolute top-0 left-0" />
    </div>
  );
};

const Hero = () => {
  const videoThumbRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [videoBounds, setVideoBounds] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWebGL, setShowWebGL] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const loaderRef = useRef(null);
  const fillLogoRef = useRef(null);
  const counterRef = useRef(null);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 750);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleVideo = () => {
    if (isAnimating) return;

    if (!expanded) {
      // Opening
      if (videoThumbRef.current) {
        const bounds = videoThumbRef.current.getBoundingClientRect();
        setVideoBounds(bounds);
        setShowWebGL(true);
        setExpanded(true);
        setIsAnimating(true);

        // Hide header
        const header = document.querySelector('header') || document.querySelector('.fixed.top-0');
        if (header) header.style.display = 'none';
      }
    } else {
      // Closing
      setExpanded(false);
      setIsAnimating(true);

      // Show header
      const header = document.querySelector('header') || document.querySelector('.fixed.top-0');
      if (header) header.style.display = '';
    }
  };

  const handleAnimationComplete = (isExpanded) => {
    setIsAnimating(false);
    if (!isExpanded) {
      setShowWebGL(false);
      setVideoBounds(null);
    }
  };

  useGSAP(() => {
    const paragraph_split = SplitText.create(".paragraph_split", {
      type: "lines",
      linesClass: "split-line",
      aria: "none"
    });

    [...paragraph_split.lines].forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("line-wrapper");
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.set([".txt2_head", paragraph_split.lines], { yPercent: 100 });

    const masterTl = gsap.timeline();

    // Step 1: Bottom-to-Top Logo Fill Loader Animation (0% to 100%)
    const progressObj = { value: 0 };

    masterTl.to(progressObj, {
      value: 100,
      duration: 2.2,
      ease: "power1.inOut",
      onUpdate: () => {
        const val = Math.round(progressObj.value);
        setLoadProgress(val);
        if (fillLogoRef.current) {
          fillLogoRef.current.style.clipPath = `inset(${100 - val}% 0% 0% 0%)`;
        }
      }
    });

    // Step 2: Disappear Loader Overlay smoothly
    masterTl.to(loaderRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        if (loaderRef.current) {
          loaderRef.current.style.display = "none";
        }
      }
    });

    // Step 3: Run usual hero text reveal
    masterTl.to(".content_box", {
      opacity: 1,
      duration: 0.01
    });

    masterTl.to([".txt2_head", paragraph_split.lines], {
      yPercent: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.05,
    }, "<+0.2");
    masterTl.to([".txt2_head"], {
      transform: "translateX(0)",
      stagger: 0.15,
      duration:1,
      ease: "power2.inOut"
    });
    masterTl.to([".vid_cont", ".hero_logos"], {
      opacity: 1,
      stagger: 0.15
    }, ">");

  });

  const logoData = [
    {
      id: 1,
      img: "/images/homepage/hero/logo1.svg",
      desc: "I can standardize my approach and I can A-B test knowing that I'm actually A-B testing, not depending on someone to be in a good mood that day or in a bad mood that day.",
      author: "ICP: SALES & GTM LEADERS"
    }, {
      id: 2,
      img: "/images/homepage/hero/logo2.svg",
      desc: "We saw immediate results and a huge increase in our outbound conversions within the first week of deployment.",
      author: "ICP: MARKETING DIRECTORS"
    },
    {
      id: 3,
      img: "/images/homepage/hero/logo3.svg",
      desc: "The analytics provided are game-changing. We finally have clarity on our user journey from start to finish.",
      author: "ICP: PRODUCT MANAGERS"
    }, {
      id: 4,
      img: "/images/homepage/hero/logo4.svg",
      desc: "A robust platform that scales seamlessly. Our engineering team loves the API-first approach and documentation.",
      author: "ICP: VP OF ENGINEERING"
    },
  ];

  if (isMobile) return null;

  return (
    <div className="   w-full h-screen relative bg-[#0B1A2C] text-white overflow-hidden">
      {/* Full-Screen Site Loader */}
      <div
        ref={loaderRef}
        className="fixed inset-0 z-[999] bg-[#0B1A2C] flex flex-col items-center justify-center pointer-events-auto"
      >
        <div className="relative w-52 h-52  flex items-center justify-center">
          {/* Background Dark Outline Logo */}
          <Image
            width={208}
            height={208}
            src="/logo.svg"
            alt="Piran Tarapore Logo outline placeholder"
            className="w-full h-full object-contain opacity-20 brightness-0 invert"
          />
          {/* Foreground Pure White Logo Fill (Bottom-to-Top clip-path) */}
          <Image
            ref={fillLogoRef}
            width={208}
            height={208}
            src="/logo.svg"
            alt="Piran Tarapore Logo fill"
            className="absolute inset-0 w-full h-full object-contain brightness-0 invert"
            style={{ clipPath: "inset(100% 0% 0% 0%)" }}
          />
        </div>

        {/* Counter Percentage */}
        <div className="absolute bottom-10 text-xs tracking-widest font-mono opacity-60">
          {loadProgress}%
        </div>
      </div>

      <LogoParticles />

      <div className=" content_box opacity-0 container pb-5 relative z-10 w-full h-full flex items-end pointer-events-none">
        <div className=" absolute w-full h-full flex items-center pointer-events-auto">
          <h1 className=" w-full leading-18">
            <div className="wrapper_heading block w-full overflow-hidden">
              <div className="txt2_head translate-x-[31%]">
                Creating Growth
              </div>
            </div>
            <div className="wrapper_heading block w-full overflow-hidden">
              <div className="txt2_head translate-x-[31.5%]">
                Through Strong
              </div>
            </div>
            <div className="wrapper_heading block w-full overflow-hidden">
              <div className="txt2_head translate-x-[34.5%]">
                Foundations
              </div>
            </div>

          </h1>
        </div>

        <div className='w-full'>
          <div className="flex flex-col pb-5 md:flex-row justify-between items-start md:items-end w-full gap-10 md:gap-8 pointer-events-auto">
            <div className="max-w-lg w-full">
              <p data-para-effect className=" paragraph_split opacity-60 leading-tight">
                Our leadership solutions empower businesses <br className="hidden md:block" />
                to grow with confidence, clarity, and purpose.
              </p>
            </div>

            <div className="   flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="text-left md:text-right">
                <RotatingText />
                <p className="opacity-60 paragraph_split">Currently in Amsterdam/NL.</p>
              </div>

              <div className=" vid_cont opacity-0  relative w-72 aspect-video">
                {/* Thumbnail Div */}
                <div
                  ref={videoThumbRef}
                  onClick={!expanded ? toggleVideo : undefined}
                  className={`overflow-hidden flex items-center justify-center transform-gpu absolute inset-0 w-full h-full rounded-xl  cursor-pointer`}
                >
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <div className="flex gap-x-12 items-center pointer-events-auto">
              {logoData.map((item, i) => (
                <div key={item.id} className=" hero_logos opacity-0 group relative cursor-pointer">
                  <Image
                    width={80}
                    height={56}
                    src={item.img}
                    alt={`Company Logo ${item.id}`}
                    className="h-14 w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="absolute bottom-full left-0 space-y-4 mb-2 w-80 bg-[#eaf4fa] text-black p-6 rounded-md shadow-2xl opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none z-50">
                    <div className="">
                      <Image height={20} width={20} className='invert-100' src="/icons/quote.svg" alt="" />
                    </div>
                    <p className="text-lg  leading-tight font-medium text-black">
                      {item.desc}
                    </p>
                    <p className="text-xs font-bold opacity-70 uppercase ">
                      {item.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WebGL Overlay - Always rendered now, acts as the thumbnail itself */}
      <VideoWebGLTransition
        targetRef={videoThumbRef}
        expanded={expanded}
        isAnimating={isAnimating}
        onAnimationComplete={handleAnimationComplete}
      />

      {/* Close Button UI (Fades in when expanded) */}
      <div
        className={`fixed inset-0 z-[1000] pointer-events-none transition-opacity duration-500 ${expanded && !isAnimating ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          onClick={toggleVideo}
          aria-label="Close video"
          className={`absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-[#0B1A2C] text-white rounded-full flex items-center justify-center z-50 transition-colors backdrop-blur-sm pointer-events-none ${expanded && "pointer-events-auto!"}`}
        >
          <RiCloseLine size={24} />
        </button>
      </div>
    </div>
  )
}

export default Hero;