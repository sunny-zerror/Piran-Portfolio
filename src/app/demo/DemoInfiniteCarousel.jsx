"use client";
import { RiCloseLine } from '@remixicon/react'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { demoGalleryData } from './demoGalleryData'

const DemoInfiniteCarousel = ({ openGallerySwiper, setOpenGallerySwiper, allGalleries = demoGalleryData }) => {
  const carouselRef = useRef(null)
  const animationRef = useRef(null)

  const current = useRef(0)
  const target = useRef(0)

  const isDown = useRef(false)
  const startX = useRef(0)
  const dist = useRef(0)

  const validGalleries = (allGalleries && allGalleries.length > 0 ? allGalleries : demoGalleryData)
    .filter(g => g.galleryImages && g.galleryImages.length > 0);
  const currentIndex = validGalleries.findIndex(g => g.title === openGallerySwiper?.title || g.id === openGallerySwiper?.id);

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
  }

  const handlePrev = () => {
    if (validGalleries.length === 0) return;
    const nextIdx = currentIndex > 0 ? currentIndex - 1 : validGalleries.length - 1;
    switchGallery(validGalleries[nextIdx]);
  }

  const handleNext = () => {
    if (validGalleries.length === 0) return;
    const nextIdx = (currentIndex !== -1 && currentIndex < validGalleries.length - 1) ? currentIndex + 1 : 0;
    switchGallery(validGalleries[nextIdx]);
  }

  const [renderScroll, setRenderScroll] = useState(0)

  const itemWidth = 300
  const gap = 4
  const galleryImages = openGallerySwiper?.galleryImages || []
  let baseImages = [...galleryImages];
  while (baseImages.length > 0 && baseImages.length < 10) {
    baseImages = [...baseImages, ...galleryImages];
  }

  const totalItemWidth = itemWidth + gap
  const totalWidth = totalItemWidth * baseImages.length

  const slides = [
    ...baseImages,
    ...baseImages,
    ...baseImages
  ]

  useEffect(() => {
    current.current = totalWidth
    target.current = totalWidth
    setRenderScroll(totalWidth)
  }, [totalWidth])

  useEffect(() => {
    const lerp = (a, b, n) => a + (b - a) * n

    const viewport =
      typeof window !== 'undefined' ? window.innerWidth : 0

    const min = totalWidth - viewport
    const max = totalWidth * 2

    const animate = () => {
      current.current = lerp(current.current, target.current, 0.1)

      if (current.current > max) {
        current.current -= totalWidth
        target.current -= totalWidth
      }

      if (current.current < min) {
        current.current += totalWidth
        target.current += totalWidth
      }

      setRenderScroll(current.current)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationRef.current)
  }, [totalWidth])

  const down = (e) => {
    isDown.current = true
    startX.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0
  }

  const move = (e) => {
    if (!isDown.current) return
    const x = e.clientX || (e.touches && e.touches[0]?.clientX) || 0
    dist.current = (startX.current - x) * 1.5
    target.current += dist.current
    startX.current = x
  }

  const up = () => {
    isDown.current = false
  }

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && openGallerySwiper) {
        setOpenGallerySwiper(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openGallerySwiper, setOpenGallerySwiper]);

  useEffect(() => {
    let splt_wrd;

    if (openGallerySwiper) {
      gsap.set(".spli_txt", { clearProps: "opacity,transform" })
      try {
        if (typeof SplitText !== "undefined") {
          splt_wrd = SplitText.create(".spli_txt", { type: "words", wordsClass: "splt_wrd", aria: "none" })
          gsap.set(splt_wrd.words, {
            y: 50,
            opacity: 0
          })
        }
      } catch (e) {
        // Fallback if SplitText is unavailable
      }

      gsap.set(".slide_width", {
        opacity: 0
      })
      gsap.to(".header", { opacity: 0, pointerEvents: "none", duration: 0.3 })

      if (window.lenis) window.lenis.stop()

      var openTl = gsap.timeline()

      openTl.to(".gallery_swiper_paren", {
        opacity: 1,
        duration: 0.2,
        pointerEvents: 'all'
      })
      openTl.to(".slide_width", {
        opacity: 1,
        stagger: 0.08,
        duration: .5
      }, "<")

      if (splt_wrd && splt_wrd.words) {
        openTl.to(splt_wrd.words, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08
        }, "<+=0.3")
      } else {
        openTl.to(".spli_txt", {
          opacity: 1,
          duration: 0.4
        }, "<")
      }

    } else {
      if (window.lenis) window.lenis.start()
      gsap.to(".header", { opacity: 1, pointerEvents: "all", duration: 0.3, delay: 0.3 })
      gsap.to(".gallery_swiper_paren", {
        opacity: 0,
        duration: 0.4,
        pointerEvents: 'none'
      })
      gsap.set(".slide_width", {
        opacity: 0,
        delay: 0.4
      })
    }

    return () => {
      if (splt_wrd) splt_wrd.revert();
    }
  }, [openGallerySwiper])

  return (
    <div
      id="demo-infinite-carousel"
      className="gallery_swiper_paren pointer-events-none opacity-0 fixed top-0 left-0 z-[99999] inset-0 bg-[#E3E2DC] text-[#18293A] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Top Header */}
      <div>
        <div className="w-full flex items-center justify-between p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#18293A]/10 font-mono">
              {openGallerySwiper?.category || "Gallery"}
            </span>
            <h5 key={openGallerySwiper?.title + "num"} className="spli_txt font-mono text-sm tracking-wider">
              {currentNum} / {totalNum}
            </h5>
          </div>
          <button
            id="close-carousel-button"
            onClick={() => setOpenGallerySwiper(null)}
            aria-label="Close gallery"
            className="w-10 h-10 rounded-full hover:bg-black/10 flex items-center justify-center cursor-pointer transition-all duration-200"
          >
            <RiCloseLine size={28} />
          </button>
        </div>

        {/* Slides Track */}
        <div
          ref={carouselRef}
          className="relative w-full cursor-grab active:cursor-grabbing py-4"
          onMouseDown={down}
          onMouseMove={move}
          onMouseUp={up}
          onMouseLeave={up}
          onTouchStart={down}
          onTouchMove={move}
          onTouchEnd={up}
        >
          <div
            className="flex pl-4"
            style={{
              transform: `translate3d(${-renderScroll}px, 0%, 0)`
            }}
          >
            {slides?.map((media, i) => (
              <div
                key={i}
                style={{
                  marginRight: gap,
                  width: itemWidth
                }}
                className="slide_width relative aspect-[3/4] shrink-0 overflow-hidden bg-[#222] rounded-md shadow-md"
              >
                {media?.type === 'img' ? (
                  <Image
                    fill
                    alt={openGallerySwiper?.title || "Gallery Image"}
                    src={media.src}
                    className="object-cover w-full h-full"
                    draggable={false}
                    sizes="300px"
                    loading="lazy"
                  />
                ) : media?.type === 'video' ? (
                  <video
                    src={media.src}
                    className="object-cover w-full h-full"
                    loop
                    muted
                    autoPlay
                    playsInline
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar Controls */}
      <div className="w-full px-6 md:px-12 flex items-end justify-between pb-8 md:pb-12">
        <button
          id="carousel-prev-button"
          onClick={handlePrev}
          className="cursor-pointer group flex items-center gap-2 hover:gap-3 transition-all duration-300 uppercase text-sm tracking-wider font-medium"
        >
          <span className="transform transition-transform group-hover:-translate-x-1 text-lg">←</span>
          <span>Prev</span>
        </button>

        <div className="flex flex-col items-center">
          {openGallerySwiper?.subtitle && (
            <span className="text-xs uppercase tracking-widest text-[#18293A]/60 mb-1 font-mono">
              {openGallerySwiper.subtitle}
            </span>
          )}
          <p
            key={openGallerySwiper?.title + "title"}
            className="leading-none spli_txt text-center font-serif tracking-tight"
            style={{
              fontSize: "clamp(2rem, 7vw, 7.5rem)"
            }}
          >
            {openGallerySwiper?.title}
          </p>
        </div>

        <button
          id="carousel-next-button"
          onClick={handleNext}
          className="cursor-pointer group flex items-center gap-2 hover:gap-3 transition-all duration-300 uppercase text-sm tracking-wider font-medium"
        >
          <span>Next</span>
          <span className="transform transition-transform group-hover:translate-x-1 text-lg">→</span>
        </button>
      </div>
    </div>
  )
}

export default DemoInfiniteCarousel
