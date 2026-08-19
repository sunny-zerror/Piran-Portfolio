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
import { RotatingText } from '../common/RotatingText';
import { LiveTime } from '../common/LiveTime';
import LogoParticlesNew from './LogoParticlesNew';
gsap.registerPlugin(ScrollTrigger, SplitText)

const MobileHero = () => {
  const videoThumbRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [videoBounds, setVideoBounds] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWebGL, setShowWebGL] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [activeLogoIndex, setActiveLogoIndex] = useState(null);

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

    const masterTl = gsap.timeline({delay:3});

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
      img: "/images/homepage/hero/logo3.svg",
      desc: "A strategic partner to the Poonawalla Group across startups, real estate, and brand ventures.",
      author: "Poonawalla Group"
    }, {
      id: 2,
      img: "/images/homepage/hero/logo2.svg",
      desc: "A postgraduate year in marketing communication at the University of Melbourne, where international rooms sharpened the thinking and the speaking.",
      author: "University of Melbourne"
    },
    {
      id: 3,
      img: "/images/homepage/hero/logo1.svg",
      desc: "A founder in Build3's tenth cohort, where the next venture took shape in the nutraceutical space.",
      author: "Build3"
    }
  ];

  if (!isMobile) return null;

  return (
    <div className='bg-[#0B1A2C] overflow-hidden'>

      <div className="   w-full h-svh relative  text-white overflow-hidden">
        <LogoParticlesNew />

        <div className="mob_content_box opacity-0 flex items-end container pb-10 relative z-10 w-full h-full pointer-events-none">
          <div className="space-y-2">
            <h1 className="mob_heading_split leading-none">
              Building brands. <br /> Building founders.
            </h1>
            <p className="mob_paragraph_split opacity-60 leading-tight">
              The strategy comes first, the equity follows conviction, and the partnership stays long after.</p>
          </div>
        </div>
      </div>

      <div className='container z-1 text-white'>
        <div className="w-full space-y-5">

          <div className="w-full space-y-2">
            <div className="text-left md:text-right">
              <RotatingText />
              <p className="opacity-60 mob_paragraph_split"><LiveTime /></p>
            </div>

            <div className=" relative w-full aspect-video overflow-hidden mb-2">
              <video loop autoPlay muted playsInline src="/videos/video.mp4"></video>
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
              <Image height={20} width={20} className='invert-100' src="/icons/quote.svg" alt="quote icon" />
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
                  alt={item.author}
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