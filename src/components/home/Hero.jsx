"use client";
import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/dist/Flip';
import { RiPlayFill } from '@remixicon/react';
import LogoParticles from './LogoParticles';

gsap.registerPlugin(Flip);

const Hero = () => {
  const videoRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    
    const state = Flip.getState(videoRef.current);
    
    videoRef.current.flipState = state;
    setExpanded(!expanded);
  };

  useGSAP(() => {
    if (!videoRef.current || !videoRef.current.flipState) return;
    
    Flip.from(videoRef.current.flipState, {
      duration: 0.8,
      ease: "power4.inOut",
      absolute: true,
      zIndex: 100,
    });
    
    videoRef.current.flipState = null;
  }, [expanded]);

  return (
    <div className="w-full h-screen relative bg-[#0B1A2C] text-white overflow-hidden">

      <LogoParticles />

      <div className="container  pb-5 relative z-10 w-full h-full flex flex-col justify-between  pointer-events-none">
        
        <div className=" flex flex-1 items-center pointer-events-auto">
          <h1 className="leading-none">
            Creating Growth <br />
            Through Strong <br />
            Foundations
          </h1>
        </div>

        <div className="">
        <div className="flex flex-col pb-5  md:flex-row justify-between items-start md:items-end w-full gap-10 md:gap-8 pointer-events-auto">
          
          <div className="max-w-lg w-full">
            <p className="opacity-60 leading-tight">
              Our leadership solutions empower businesses <br className="hidden md:block" />
              to grow with confidence, clarity, and purpose.
            </p>
           
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 ">
            <div className="text-left md:text-right ">
              <p className=" uppercase">Brand Architect</p>
              <p className="opacity-60">Currently in Amsterdam/NL.</p>
            </div>

            <div className="relative w-[180px] h-[100px] md:w-[240px] md:h-[135px]">
                <div 
                  ref={videoRef}
                  // onClick={!expanded ? toggleVideo : undefined}
                  className={`bg-black cursor-pointer overflow-hidden flex items-center justify-center transform-gpu ${
                    expanded 
                      ? 'fixed inset-0 w-screen h-screen z-[100] rounded-none'
                      : 'absolute inset-0 w-full h-full z-50 rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-300'
                  }`}
                >
                  <div className="absolute inset-0 bg-[#3a4929] w-full h-full"></div>
                  <img src="/images/homepage/workResult/wave_stroke_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" alt="Video thumbnail overlay" />
                  
                  {!expanded && (
                    <div className="w-12 h-12 text-[#883F27] bg-white rounded-full flex items-center justify-center z-10 transition-transform">
                      <RiPlayFill size={22}/>
                    </div>
                  )}

                  {expanded && (
                    <>
                      <div className="text-white text-xl font-light opacity-50 z-10">
                        [ Video Player Placeholder ]
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVideo();
                        }}
                        className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center z-50 transition-colors backdrop-blur-sm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
            </div>
          </div>

        </div>

         <div className=" border-t border-white/10 pt-5">
              <img src="/images/homepage/hero_logos.svg" alt="" />
            </div>
        </div>

      </div>
    </div>
  )
}

export default Hero;