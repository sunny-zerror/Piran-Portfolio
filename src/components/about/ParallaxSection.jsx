"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Parallax from "parallax-js";
import gsap from "gsap";
import Image from "next/image";
import { galleryData } from "@/data/galleryData";
import InfiniteCarousel from "./InfiniteCarousel";

const ParallaxSection = () => {
    const [openGallerySwiper, setOpenGallerySwiper] = useState(false)
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
            frictionX: 0.03, // Ultra-smooth lerp easing on X axis
            frictionY: 0.03, // Ultra-smooth lerp easing on Y axis
            scalarX: 350,
            scalarY: 400,
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

            <div ref={containerRef} className="gallery_container overflow-hidden relative z-[100] -mt-1 bg-[#ECE3DB]">

                <div ref={sceneRef} className="gallery_scene scene" >
                    <div
                        className="gallery_group center w-full h-full"
                        data-depth="0.1"
                        scalar-x="1"
                        scalar-y="0"
                        number="38"
                    >
                        <div className="w-full h-full absolute inset-0">

                            {galleryData.map((item, i) => {
                                const isCenterImg = item.img.includes('piran_pic');

                                return (
                                    <a
                                        key={i}
                                        className="galry_card group pointer-events-auto cursor-pointer opacity-0 absolute flex flex-col items-center gap-3"
                                        style={{
                                            top: item.top,
                                            left: item.left,
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: isCenterImg ? 1 : 10
                                        }}
                                        onClick={() => setOpenGallerySwiper(true)}
                                        onMouseEnter={() => setActiveIndex(i)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                    >
                                        <div
                                            className={`transition-all duration-300 ${isCenterImg ? 'w-44 md:w-60 lg:w-64 pointer-events-none!' : 'w-24 md:w-32 lg:w-36'} flex items-center justify-center`}
                                        >
                                            <Image
                                                width={300}
                                                height={400}
                                                src={item.img}
                                                alt={item.title || "Gallery Image"}
                                                className={`object-contain w-full h-full transition-transform duration-300 group-hover:scale-110 ${activeIndex !== null && activeIndex !== i ? 'not_active' : 'normal_glry_img'}`}
                                            />
                                        </div>

                                        {item.title && (
                                            <div className={`px-4 py-1 border rounded-full text-xs uppercase cursor-pointer transition-all duration-300 bg-transparent border-gray-400 text-gray-700 group-hover:bg-[#0A1B2F] group-hover:text-white group-hover:border-[#0A1B2F] ${activeIndex !== null && activeIndex !== i ? 'not_active' : 'normal_glry_img'}`}>
                                                {item.title}
                                            </div>
                                        )}
                                    </a>
                                )
                            })}

                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ParallaxSection;