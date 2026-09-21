"use client";
import { RiCloseLine, RiPlayFill } from '@remixicon/react';
import gsap from 'gsap';
import SplitText from 'gsap/dist/SplitText';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { demoGalleryData } from './demoGalleryData';

const VideoSlide = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="relative w-full h-full group/video cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        className="object-cover w-full h-full pointer-events-none select-none"
        loop
        muted
        playsInline
      />
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white ">
            <RiPlayFill className='size-5'/>
          </div>
        </div>
      )}
    </div>
  );
};

const DemoInfiniteCarousel = ({ openGallerySwiper, setOpenGallerySwiper, allGalleries = demoGalleryData }) => {
  const carouselRef = useRef(null);
  const animationRef = useRef(null);

  const current = useRef(0);
  const target = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const velocity = useRef(0);

  const validGalleries = (allGalleries && allGalleries.length > 0 ? allGalleries : demoGalleryData)
    .filter(g => g.galleryImages && g.galleryImages.length > 0);
  
  const currentIndex = validGalleries.findIndex(
    g => g.title === openGallerySwiper?.title || g.id === openGallerySwiper?.id
  );

  const currentNum = String(currentIndex !== -1 ? currentIndex + 1 : 1).padStart(2, '0');
  const totalNum = String(validGalleries.length).padStart(2, '0');

  const switchGallery = (newGallery) => {
    gsap.to(".slide_width, .spli_txt", {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setOpenGallerySwiper(newGallery);
      }
    });
  };

  const handlePrev = () => {
    if (validGalleries.length === 0) return;
    const nextIdx = currentIndex > 0 ? currentIndex - 1 : validGalleries.length - 1;
    switchGallery(validGalleries[nextIdx]);
  };

  const handleNext = () => {
    if (validGalleries.length === 0) return;
    const nextIdx = (currentIndex !== -1 && currentIndex < validGalleries.length - 1) ? currentIndex + 1 : 0;
    switchGallery(validGalleries[nextIdx]);
  };

  const [renderScroll, setRenderScroll] = useState(0);

  const itemWidth = 320;
  const gap = 12;
  const galleryImages = openGallerySwiper?.galleryImages || [];

  let baseImages = [...galleryImages];
  while (baseImages.length > 0 && baseImages.length < 10) {
    baseImages = [...baseImages, ...galleryImages];
  }

  const totalItemWidth = itemWidth + gap;
  const totalWidth = totalItemWidth * baseImages.length;

  const slides = [
    ...baseImages,
    ...baseImages,
    ...baseImages
  ];

  // Initialize position when totalWidth or openGallerySwiper changes
  useEffect(() => {
    if (totalWidth > 0) {
      current.current = totalWidth;
      target.current = totalWidth;
      setRenderScroll(totalWidth);
    }
  }, [totalWidth, openGallerySwiper]);

  // Main animation loop (lerp + seamless loop + optional slow drift)
  useEffect(() => {
    if (!openGallerySwiper || totalWidth <= 0) return;

    const lerp = (a, b, n) => a + (b - a) * n;
    const viewport = typeof window !== 'undefined' ? window.innerWidth : 1200;

    const min = totalWidth - viewport;
    const max = totalWidth * 2;

    const animate = () => {
      // Auto drift slightly when not actively dragging
      if (!isDragging.current) {
        target.current += 0.6;
      }

      current.current = lerp(current.current, target.current, 0.08);

      // Wrap around for infinite loop
      if (current.current > max) {
        current.current -= totalWidth;
        target.current -= totalWidth;
      }

      if (current.current < min) {
        current.current += totalWidth;
        target.current += totalWidth;
      }

      setRenderScroll(current.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [totalWidth, openGallerySwiper]);

  // Mouse / Touch Dragging on Window
  const handlePointerDown = (e) => {
    isDragging.current = true;
    const pageX = e.pageX || (e.touches && e.touches[0]?.pageX) || 0;
    startX.current = pageX;
    lastX.current = pageX;
    velocity.current = 0;
  };

  useEffect(() => {
    if (!openGallerySwiper) return;

    const handlePointerMove = (e) => {
      if (!isDragging.current) return;
      const pageX = e.pageX || (e.touches && e.touches[0]?.pageX) || 0;
      const deltaX = lastX.current - pageX;
      velocity.current = deltaX;
      target.current += deltaX * 1.1;
      lastX.current = pageX;
    };

    const handlePointerUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      target.current += velocity.current * 6; // Add momentum on release
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [openGallerySwiper]);

  // Wheel scrolling (active only when modal is open)
  useEffect(() => {
    if (!openGallerySwiper) return;

    const onWheel = (e) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      target.current += delta * 0.95;
    };

    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', onWheel);
    };
  }, [openGallerySwiper]);

  // Keyboard navigation & ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!openGallerySwiper) return;
      if (e.key === "Escape") {
        setOpenGallerySwiper(null);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openGallerySwiper, currentIndex]);

  // GSAP Opening and Closing Animations
  useEffect(() => {
    let splt_wrd;

    if (openGallerySwiper) {
      gsap.set(".spli_txt", { clearProps: "opacity,transform" });
      try {
        if (typeof SplitText !== "undefined") {
          splt_wrd = SplitText.create(".spli_txt", { type: "words", wordsClass: "splt_wrd", aria: "none" });
          gsap.set(splt_wrd.words, {
            y: 50,
            opacity: 0
          });
        }
      } catch (e) {
        // Fallback if SplitText is not available
      }

      gsap.set(".slide_width", {
        opacity: 0
      });
      gsap.to(".header", { opacity: 0, pointerEvents: "none", duration: 0.3 });

      if (window.lenis) window.lenis.stop();

      const openTl = gsap.timeline();

      openTl.to(".gallery_swiper_paren", {
        opacity: 1,
        duration: 0.2,
        pointerEvents: 'all'
      });
      openTl.to(".slide_width", {
        opacity: 1,
        stagger: 0.08,
        duration: 0.5
      }, "<");

      if (splt_wrd && splt_wrd.words) {
        openTl.to(splt_wrd.words, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08
        }, "<+=0.3");
      } else {
        openTl.to(".spli_txt", {
          opacity: 1,
          duration: 0.4
        }, "<");
      }

    } else {
      if (window.lenis) window.lenis.start();
      gsap.to(".header", { opacity: 1, pointerEvents: "all", duration: 0.3, delay: 0.3 });
      gsap.to(".gallery_swiper_paren", {
        opacity: 0,
        duration: 0.4,
        pointerEvents: 'none'
      });
      gsap.set(".slide_width", {
        opacity: 0,
        delay: 0.4
      });
    }

    return () => {
      if (splt_wrd) splt_wrd.revert();
    };
  }, [openGallerySwiper]);

  return (
    <div className="gallery_swiper_paren pointer-events-none opacity-0 fixed top-0 left-0 z-[9999999] inset-0 bg-[#E3E2DC] text-[#18293A] overflow-hidden flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <div>
        <div className="w-full flex items-center justify-between p-4 sm:p-6">
          <h5 key={openGallerySwiper?.title + "num"} className="spli_txt font-mono text-sm sm:text-base tracking-wider">
            {currentNum} / {totalNum}
          </h5>
          <button
            onClick={() => setOpenGallerySwiper(null)}
            aria-label="Close gallery"
            className="w-9 h-9 rounded-full hover:bg-black/10 flex items-center justify-center cursor-pointer transition-all duration-200"
          >
            <RiCloseLine size={28} />
          </button>
        </div>

        {/* Slides Track Container */}
        <div
          ref={carouselRef}
          className="relative w-full cursor-grab active:cursor-grabbing py-6 select-none"
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          <div
            className="flex pl-4"
            style={{
              transform: `translate3d(${-renderScroll}px, 0%, 0)`,
              willChange: 'transform'
            }}
          >
            {slides?.map((media, i) => (
              <div
                key={i}
                style={{
                  marginRight: gap,
                  width: itemWidth
                }}
                className="slide_width relative aspect-[3/4] shrink-0 overflow-hidden bg-[#0b1a2c] "
              >
                {media?.type === 'img' ? (
                  <Image
                    fill
                    alt={openGallerySwiper?.title || "Gallery Image"}
                    src={media.src}
                    className="object-cover w-full h-full pointer-events-none select-none"
                    draggable={false}
                    loading="lazy"
                  />
                ) : media?.type === 'video' ? (
                  <VideoSlide src={media.src} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar Navigation */}
      <div className="w-full px-6 sm:px-10 flex items-end justify-between pb-5">
        <button
          onClick={handlePrev}
          className="cursor-pointer group flex items-center gap-2 hover:gap-3 transition-all duration-300 uppercase text-sm sm:text-base tracking-wider font-semibold"
        >
          <span className="cursor-pointer group-hover:-translate-x-1 transition-transform">←</span>
          <span className="cursor-pointer">Prev</span>
        </button>

        <p
          key={openGallerySwiper?.title + "title"}
          className="leading-none spli_txt text-center "
          style={{
            fontSize: "clamp(2rem, 7.5vw, 9rem)"
          }}
        >
          {openGallerySwiper?.title}
        </p>

        <button
          onClick={handleNext}
          className="cursor-pointer group flex items-center gap-2 hover:gap-3 transition-all duration-300 uppercase text-sm sm:text-base tracking-wider font-semibold"
        >
          <span className="cursor-pointer">Next</span>
          <span className="cursor-pointer group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default DemoInfiniteCarousel;
