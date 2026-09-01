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
import { RotatingText } from '../common/RotatingText';
import { LiveTime } from '../common/LiveTime';
import LogoParticlesNew from './LogoParticlesNew';
gsap.registerPlugin(ScrollTrigger, SplitText)

const Hero = () => {
  const videoThumbRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [videoBounds, setVideoBounds] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWebGL, setShowWebGL] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 750);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (expanded) {
      if (window.lenis) window.lenis.stop();
    } else {
      if (window.lenis) window.lenis.start();
    }
    return () => {
      if (window.lenis) window.lenis.start();
    };
  }, [expanded]);

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

    const masterTl = gsap.timeline({ delay: 2.5 });

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
      duration: 1,
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
      desc: "A strategic partner to the Poonawalla Group across startups, real estate, and brand ventures.",
      img: "/images/homepage/hero/logo3.svg",
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

  if (isMobile) return null;

  return (
    <div className="   w-full h-screen relative bg-[#0B1A2C] text-white overflow-hidden">

      <LogoParticlesNew />

      <div className=" content_box opacity-0 container pb-5 relative z-10 w-full h-full flex items-end pointer-events-none">
        <div className=" absolute w-full h-full flex items-center pointer-events-auto">
          <h1 className=" w-full leading-18">
            <div className="wrapper_heading block w-full overflow-hidden">
              <div className="txt2_head">
                Building brands.
              </div>
            </div>
            <div className="wrapper_heading block w-full overflow-hidden">
              <div className="txt2_head">
                Backing founders.
              </div>
            </div>
          </h1>
        </div>

        <div className='w-full'>
          <div className="flex flex-col pb-5 md:flex-row justify-between items-start md:items-end w-full gap-10 md:gap-8 pointer-events-auto">
            <div className="max-w-lg w-full">
              <p data-para-effect className=" paragraph_split opacity-60 leading-tight">
                The strategy comes first, the equity follows <br /> conviction, and the partnership stays long after.
              </p>
            </div>

            <div className="   flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="text-left md:text-right">
                <div className="hero_logos opacity-0">
                  <RotatingText />
                </div>
                <p className="hero_logos opacity-0 "><LiveTime /></p>
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
                    alt={item.author}
                    className="h-14 w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  />

                  <div className="absolute bottom-full left-0 space-y-4 mb-2 w-80 bg-[#eaf4fa] text-black p-6 rounded-md shadow-2xl opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none z-50">
                    <div className="">
                      <Image height={20} width={20} className='invert-100' src="/icons/quote.svg" alt="quote icon" />
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