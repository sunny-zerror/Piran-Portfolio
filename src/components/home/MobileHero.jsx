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
import { Autoplay } from 'swiper/modules';
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

const MobileHero = () => {
  const videoThumbRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [videoBounds, setVideoBounds] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWebGL, setShowWebGL] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [activeLogoIndex, setActiveLogoIndex] = useState(null);

  const loaderRef = useRef(null);
  const fillLogoRef = useRef(null);
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
    const heading_split = SplitText.create(".mob_heading_split", {
      type: "lines",
      linesClass: "split-line",
      aria: "none"
    });
    const paragraph_split = SplitText.create(".mob_paragraph_split", {
      type: "lines",
      linesClass: "split-line",
      aria: "none"
    });

    [...heading_split.lines, ...paragraph_split.lines].forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("line-wrapper");
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.set([heading_split.lines, paragraph_split.lines], { yPercent: 100 });

    const masterTl = gsap.timeline({delay:1});

    masterTl.to(".mob_content_box", {
      opacity: 1,
      duration: 0.01
    });
    masterTl.to(".mob_border_bar", {
      height: "100%",
      stagger: 0.2
    });
    masterTl.to(heading_split.lines, {
      yPercent: -8,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.05,
    }, "<");
    masterTl.to(paragraph_split.lines, {
      yPercent: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.05,
    }, "<+0.2");
    masterTl.to([".mob_vid_cont", ".mob_hero_logos"], {
      opacity: 1,
      stagger: 0.15
    });
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

  if (!isMobile) return null;

  return (
    <div className='bg-[#0B1A2C] overflow-hidden'>

      <div className="   w-full h-svh relative  text-white overflow-hidden">
        <LogoParticles />

        <div className="mob_content_box opacity-0 flex items-end container pb-10 relative z-10 w-full h-full pointer-events-none">
          <div className="space-y-2">
            <h1 className="mob_heading_split leading-none">
              Creating Growth
              Through Strong
              Foundations
            </h1>
            <p className="mob_paragraph_split opacity-60 leading-tight">
              Our leadership solutions empower businesses
              to grow with confidence, clarity, and purpose.
            </p>
          </div>
        </div>
      </div>

      <div className='container z-1 text-white'>
        <div className="w-full space-y-5">

          <div className="w-full space-y-2">
            <div className="text-left md:text-right">
              <RotatingText />
              <p className="opacity-60 mob_paragraph_split">Currently in Amsterdam/NL.</p>
            </div>

            <div className=" relative w-full aspect-video mb-2">
              <video loop autoPlay muted playsInline src="https://vz-f76b55f9-7b8.b-cdn.net/2b3c385c-35e7-406c-bb11-8c7d71d90001/playlist.m3u8"></video>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-2 relative ">
          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-[#eaf4fa] text-black p-6 rounded-md shadow-2xl transition-all duration-500 ease-out z-50 
            ${activeLogoIndex !== null
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="flex justify-between items-start">
              <Image height={20} width={20} className='invert-100' src="/icons/quote.svg" alt="" />
              <button
                onClick={() => setActiveLogoIndex(null)}
                aria-label="Close details"
                className="text-black/50 hover:text-black text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="leading-tight font-medium text-black mt-2">
              {activeLogoIndex !== null ? logoData[activeLogoIndex]?.desc : ""}
            </p>
            <p className="text-xs font-bold opacity-70 uppercase mt-4">
              {activeLogoIndex !== null ? logoData[activeLogoIndex]?.author : ""}
            </p>
          </div>

          <div className="flex justify-between pointer-events-auto">
            {logoData.map((item, i) => (
              <div
                key={item.id}
                className="group relative cursor-pointer"
                onClick={() => setActiveLogoIndex(i)}
              >
                <Image
                  width={60}
                  height={40}
                  src={item.img}
                  alt={`Company Logo ${item.id}`}
                  className={`h-10 w-auto object-contain transition-opacity duration-300 ${activeLogoIndex === i ? 'opacity-100' : 'opacity-50'}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default MobileHero;