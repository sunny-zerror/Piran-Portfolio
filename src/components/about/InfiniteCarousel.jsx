"use client";
import { galleryData } from '@/data/galleryData'
import { RiCloseLine } from '@remixicon/react'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'


const InfiniteCarousel = ({ openGallerySwiper, setOpenGallerySwiper }) => {
  const carouselRef = useRef(null)
  const animationRef = useRef(null)

  const current = useRef(0)
  const target = useRef(0)

  const validGalleries = galleryData.filter(g => g.galleryImages && g.galleryImages.length > 0);
  const currentIndex = validGalleries.findIndex(g => g.title === openGallerySwiper?.title);
  
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
      if(validGalleries.length === 0) return;
      const nextIdx = currentIndex > 0 ? currentIndex - 1 : validGalleries.length - 1;
      switchGallery(validGalleries[nextIdx]);
  }

  const handleNext = () => {
      if(validGalleries.length === 0) return;
      const nextIdx = (currentIndex !== -1 && currentIndex < validGalleries.length - 1) ? currentIndex + 1 : 0;
      switchGallery(validGalleries[nextIdx]);
  }

  const [renderScroll, setRenderScroll] = useState(0)

  const itemWidth = 300
  const gap = 2
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

  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault()
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY)
          ? e.deltaX
          : e.deltaY

      target.current += delta * 0.9
    }

    const el = carouselRef.current
    window.addEventListener('wheel', onWheel, { passive: false })

    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  const drag = useRef({
    down: false,
    x: 0,
    v: 0
  })

  const down = (e) => {
    drag.current.down = true
    drag.current.x = e.pageX || e.touches?.[0]?.pageX
  }

  const move = (e) => {
    if (!drag.current.down) return
    const x = e.pageX || e.touches?.[0]?.pageX
    const diff = drag.current.x - x
    drag.current.v = diff
    drag.current.x = x
    target.current += diff
  }

  const up = () => {
    drag.current.down = false
    target.current += drag.current.v * 8
  }

  useEffect(() => {
    let splt_wrd;
    if (openGallerySwiper) {
      gsap.set(".spli_txt", { clearProps: "opacity,transform" }) // Clear inline styles from switchGallery fade out without breaking font-size
      splt_wrd = SplitText.create(".spli_txt", { type: "words" , wordsClass: "splt_wrd", aria: "none" })
      gsap.set(splt_wrd.words, {
        y: 50,
        opacity:0
      })
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
        stagger: 0.1,
        duration: .5
      }, "<")
      openTl.to(splt_wrd.words, {
        y:0,
        opacity:1,
        duration: 0.5,
        stagger: 0.1
      }, "<+=0.5")

    } else {
      if (window.lenis) window.lenis.start()
      gsap.to(".header", { opacity: 1, pointerEvents: "all", duration: 0.3, delay: 0.5 })
      gsap.to(".gallery_swiper_paren", {
        opacity: 0,
        duration: 0.5,
        pointerEvents: 'none'
      })
      gsap.set(".slide_width", {
        opacity: 0,
        delay: 0.5
      })
    }
    
    return () => {
      if (splt_wrd) splt_wrd.revert();
    }
  }, [openGallerySwiper])


  return (
    <div className=" gallery_swiper_paren  pointer-events-none opacity-0 fixed top-0 left-0   z-[9999] inset-0 bg-[#ECE3DB] text-[#18293A] overflow-hidden flex flex-col  justify-between">
      <div className=''>
        <div className="w-full flex items-center justify-between p-2">
          <h5 key={openGallerySwiper?.title + "num"} className=' spli_txt '>{currentNum} / {totalNum}</h5>
          <button onClick={() => setOpenGallerySwiper(false)} aria-label="Close gallery" className='w-6 cursor-pointer'><RiCloseLine size={30}/></button>
        </div>
        <div
          ref={carouselRef}
          className="relative w-full"
          onMouseDown={down}
          onMouseMove={move}
          onMouseUp={up}
          onMouseLeave={up}
          onTouchStart={down}
          onTouchMove={move}
          onTouchEnd={up}
        >
          <div
            className="flex pl-2"
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
                className={` slide_width relative aspect-[3/4]  shrink-0 overflow-hidden bg-[#883F27] animate-pulse`}
              >
                {media?.type === 'img' ? (
                  <Image
                   fill
                    alt={openGallerySwiper?.title || "Gallery Image"}
                    src={media.src}
                    className="cover"
                    draggable={false}
                    loading="lazy"
                    onLoadingComplete={(img) => img.parentElement.classList.remove('animate-pulse')}
                  />
                ) : media?.type === 'video' ? (
                  <video
                    src={media.src}
                    className="cover"
                    loop
                    muted
                    autoPlay
                    playsInline
                    onLoadedData={(e) => e.target.parentElement.classList.remove('animate-pulse')}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full px-5 flex items-end justify-between">
        <button onClick={handlePrev} className=' cursor-pointer flex items-center gap-2 hover:gap-3 transition-all duration-300 pb-10 uppercase '>
          <p className="cursor-pointer!">
          ←
          </p>
          <h5 className='cursor-pointer!'>
          Prev
          </h5>
        </button>
        <p
          key={openGallerySwiper?.title + "title"}
          className="leading-none spli_txt  text-center"
          style={{
            fontSize: "clamp(1.5rem, 8vw, 10rem)"
          }}
        >
          {openGallerySwiper?.title}
        </p>
        <button onClick={handleNext} className=' cursor-pointer flex gap-2 items-center hover:gap-3 transition-all duration-300 pb-10 uppercase '>
          <h5 className='cursor-pointer!'>
          Next
          </h5>
          <p className="cursor-pointer!">
           →
          </p>
        </button>
      </div>

    </div>
  )
}

export default InfiniteCarousel
