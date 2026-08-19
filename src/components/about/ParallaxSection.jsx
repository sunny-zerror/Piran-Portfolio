"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Parallax from "parallax-js";
import gsap from "gsap";
import Image from "next/image";
import { galleryData } from "@/data/galleryData";
import InfiniteCarousel from "./InfiniteCarousel";

const ParallaxSection = () => {
    const [openGallerySwiper, setOpenGallerySwiper] = useState(null)
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const textBoxRef = useRef(null);
    const parallaxRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        if (!sceneRef.current || !containerRef.current) return;

        parallaxRef.current = new Parallax(sceneRef.current, {
            relativeInput: true,
            hoverOnly: true,
            inputElement: containerRef.current,
            pointerEvents: true,
            gyroscope: true,
            frictionX: 0.1,
            frictionY: 0.1,
            scalarX: 40,
            scalarY: 60,
        });

        return () => {
            parallaxRef.current?.disable();
            parallaxRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!textBoxRef.current) return;

        if (activeIndex !== null) {
            gsap.to(textBoxRef.current, {
                opacity: 1,
                duration: 0.4,
                ease: "power3.out",
            });
        } else {
            gsap.to(textBoxRef.current, {
                opacity: 0,
                duration: 0.3,
                ease: "power3.inOut",
            });
        }
    }, [activeIndex]);

    useEffect(() => {

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".gallery_container",
                start: "top 99%",
                toggleActions: "play none none reverse"
            }
        })

        tl.to(".galry_card", {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: {
                each: 0.03,
                from: "random",
            },
        })


    }, [])

    return (
        <>
            <InfiniteCarousel openGallerySwiper={openGallerySwiper} setOpenGallerySwiper={setOpenGallerySwiper} />

            <div ref={containerRef} className="gallery_container overflow-hidden relative z-[100] -mt-1 bg-[#E3E2DC] min-h-screen flex items-center justify-center">

                {/* Fixed Center Image - outside parallax depth scene */}
                <div
                    className="galry_card absolute z-[-1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 flex flex-col items-center gap-3"
                >
                    <div className="w-28 sm:w-36 md:w-60 lg:w-64 flex items-center justify-center">
                        <Image
                            width={300}
                            height={400}
                            src="/images/aboutpage/gallery/piran.png"
                            alt="Piran Center Image"
                            className="object-contain w-full h-full normal_glry_img"
                        />
                    </div>
                </div>

                <div ref={sceneRef} className="gallery_scene scene w-full h-full">
                    <div
                        className="gallery_group center w-full h-full"
                        data-depth="0.1"
                        scalar-x="1"
                        scalar-y="0"
                        number="38"
                    >
                        <div className="w-full h-full absolute inset-0">
                            {galleryData.map((item, i) => (
                                <a
                                    key={i}
                                    className="galry_card group pointer-events-auto cursor-pointer opacity-0 absolute flex flex-col items-center gap-1.5 md:gap-3 [will-change:transform] [transform-style:preserve-3d]"
                                    style={{
                                        top: item.top,
                                        left: item.left,
                                        transform: 'translate3d(-50%, -50%, 0)',
                                        zIndex: 50
                                    }}
                                    onClick={() => {
                                        if (item.galleryImages && item.galleryImages.length > 0) {
                                            setOpenGallerySwiper(item)
                                        }
                                    }}
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    <div className="w-12 sm:w-16 md:w-28 lg:w-24 transition-all duration-300 flex items-center justify-center">
                                        <Image
                                            width={300}
                                            height={400}
                                            src={item.img}
                                            alt={item.title || "Gallery Image"}
                                            className={`object-contain w-full h-full transition-transform duration-300 group-hover:scale-110`}
                                        />
                                    </div>

                                    {item.title && (
                                        <div className={`px-2 py-0.5 md:px-4 md:py-1 border rounded-full text-[9px] md:text-xs uppercase cursor-pointer transition-all duration-300 bg-transparent border-gray-400 text-gray-700 group-hover:bg-[#0A1B2F] group-hover:text-white group-hover:border-[#0A1B2F] ${activeIndex !== null && activeIndex !== i ? 'not_active' : 'normal_glry_img'}`}>
                                            {item.title}
                                        </div>
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ParallaxSection;