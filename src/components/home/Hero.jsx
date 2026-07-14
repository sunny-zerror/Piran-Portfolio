"use client";
import React, { useRef, useState, useEffect } from 'react';
import { RiPlayFill, RiCloseLine } from '@remixicon/react';
import LogoParticles from './LogoParticles';
import { VideoWebGLTransition } from './canvasComponent/VideoWebGLTransition';

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

  return (
    <div className="w-full h-screen relative bg-[#0B1A2C] text-white overflow-hidden">
      <LogoParticles />

      <div className="container pb-5 relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">
        <div className="flex flex-1 items-center pointer-events-auto">
          <h1 className="leading-none">
            Creating Growth <br />
            Through Strong <br />
            Foundations
          </h1>
        </div>

        <div>
          <div className="flex flex-col pb-5 md:flex-row justify-between items-start md:items-end w-full gap-10 md:gap-8 pointer-events-auto">
            <div className="max-w-lg w-full">
              <p data-para-effect className="opacity-60 leading-tight">
                Our leadership solutions empower businesses <br className="hidden md:block" />
                to grow with confidence, clarity, and purpose.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="text-left md:text-right">
                <p className="uppercase">Brand Architect</p>
                <p className="opacity-60">Currently in Amsterdam/NL.</p>
              </div>

              <div className="relative w-[180px] h-[100px] md:w-[240px] md:h-[135px]">
                {/* Thumbnail Div */}
                <div 
                  ref={videoThumbRef}
                  onClick={!expanded ? toggleVideo : undefined}
                  className={`overflow-hidden flex items-center justify-center transform-gpu absolute inset-0 w-full h-full rounded-xl shadow-2xl transition-transform duration-300 ${!expanded ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-0'}`}
                >
                  <div className="absolute inset-0 bg-[#3a4929] w-full h-full opacity-0"></div>
                  
                  <div className="w-12 h-12 text-[#883F27] bg-white rounded-full flex items-center justify-center z-10 pointer-events-none">
                    <RiPlayFill size={22}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <img src="/images/homepage/hero_logos.svg" alt="" />
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