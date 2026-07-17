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
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*';

const RotatingText = () => {
  const textRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const scrambleTo = (target) => {
      const el = textRef.current;
      if (!el) return;
      const len = target.length;
      const duration = 0.8;
      const obj = { progress: 0 };

      gsap.to(obj, {
        progress: 1,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          const p = obj.progress;
          let result = '';
          for (let i = 0; i < len; i++) {
            // Each character resolves at a staggered point
            const charThreshold = i / len;
            if (p > charThreshold + 0.3) {
              result += target[i];
            } else {
              result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            }
          }
          el.textContent = result;
        },
        onComplete: () => {
          el.textContent = target;
        },
      });
    };

    // Initial text
    if (textRef.current) textRef.current.textContent = TITLES[0];

    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % TITLES.length;
      scrambleTo(TITLES[indexRef.current]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return <p ref={textRef} className="uppercase">{TITLES[0]}</p>;
};

const Hero = () => {
  const videoThumbRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [videoBounds, setVideoBounds] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showWebGL, setShowWebGL] = useState(false);

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
    const heading_split = SplitText.create(".heading_split", {
      type: "lines",
      linesClass: "split-line"
    });
    const paragraph_split = SplitText.create(".paragraph_split", {
      type: "lines",
      linesClass: "split-line"
    });

    [...heading_split.lines, ...paragraph_split.lines].forEach((line) => {
      const wrapper = document.createElement("div");

      wrapper.classList.add("line-wrapper");

      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.set([heading_split.lines, paragraph_split.lines], { yPercent: 100 });

    const tl = gsap.timeline({
      delay: 4
    })
    tl.to(".content_box", {
      opacity: 1,
      duration: 0.01
    })
    tl.to(".border_bar", {
      height: "100%",
      stagger: 0.2
    });
    tl.to(heading_split.lines, {
      yPercent: -8,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.05,
    }, "<");
    tl.to(paragraph_split.lines, {
      yPercent: 0,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.05,
    }, "<+0.2");
    tl.to([".vid_cont", "hero_logos"], {
      opacity: 1,
      stagger: 0.15
    }, "<");

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

  return (
    <div className="   w-full h-screen relative bg-[#0B1A2C] text-white overflow-hidden">
      <LogoParticles />

      <div className=" content_box opacity-0 container pb-5 relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">
        <div className="flex flex-1 items-center pointer-events-auto">
          <h1 className=" heading_split leading-none">
            Creating Growth <br />
            Through Strong <br />
            Foundations
          </h1>
        </div>

        <div>
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

              <div className=" relative w-60 aspect-video">
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
                <div key={item.id} className="group relative cursor-pointer">
                  <img
                    src={item.img}
                    alt="logo img"
                    className="h-14 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
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
          className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center z-50 transition-colors backdrop-blur-sm pointer-events-auto"
        >
          <RiCloseLine size={24} />
        </button>
      </div>
    </div>
  )
}

export default Hero;