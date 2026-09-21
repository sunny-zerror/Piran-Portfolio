"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiAddLine, RiArrowLeftLine, RiEyeLine, RiFilter3Line } from "@remixicon/react";
import DemoInfiniteCarousel from './../../app/demo/DemoInfiniteCarousel';
import { demoGalleryData } from './../../app/demo/demoGalleryData';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)

export default function GallerySection() {
    const [openGallerySwiper, setOpenGallerySwiper] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'Place' | 'Doing'
    const [artMode, setArtMode] = useState("art"); // 'art' (reference mockup) | 'photo' (travel/action preview)
    const [hoveredFrame, setHoveredFrame] = useState(null);

    // Keyboard shortcut to close tooltip or modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && !openGallerySwiper) {
                setHoveredFrame(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [openGallerySwiper]);

    const placesCount = demoGalleryData.filter((i) => i.category === "Place").length;
    const doingCount = demoGalleryData.filter((i) => i.category === "Doing").length;

    useGSAP(() => {
        gsap.to(".wall_frames", {
            opacity: 1,
            scale:1,
            stagger: 0.05,
            scrollTrigger: {
                trigger: ".gallery-paren",
                start: "top 60%",
                toggleActions: "play none none reverse"
            }
        })
    })

    return (
        <main className=" gallery-paren relative  overflow-hidden flex items-center justify-center select-none font-sans">

            {/* Main 16:9 Living Room Stage */}
            <div
                className="relative w-full aspect-video overflow-hidden"

            >
                {/* Background Image: Piran on sofa with empty wall */}
                <Image
                    src="/images/aboutpage/gallery/piran_onsofa.png"
                    alt="Piran reading newspaper on sofa"
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain pointer-events-none select-none"
                />

                {/* Interactive Picture Frames on the Wall */}
                <div className="absolute inset-0 pointer-events-none">
                    {demoGalleryData.map((item, idx) => {
                        const isHovered = hoveredFrame?.id === item.id;

                        return (
                            <div
                                key={item.id}
                                id={`frame-${item.id}`}
                                className={` wall_frames scale-90 opacity-0 absolute pointer-events-auto cursor-pointer group drop-shadow-2xl ${isHovered && "z-50"} `}
                                style={{
                                    left: item.left,
                                    top: item.top,
                                    width: item.width,
                                    height: item.height
                                }}
                                onClick={() => setOpenGallerySwiper(item)}
                                onMouseEnter={() => setHoveredFrame(item)}
                                onMouseLeave={() => setHoveredFrame(null)}
                            >
                                {/* Physical Frame Container with Realistic Shadow & Bevel */}
                                <div
                                    className={`relative w-full h-full overflow-hidden transition-all bg-[#0b1a2c] p-[0.2rem] duration-300 ease-out`}
                                >
                                    {/* Frame Artwork Content */}
                                    <div className="relative w-full h-full overflow-hidden">
                                        <Image
                                            fill
                                            src={item.artImg}
                                            alt={item.title}
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            draggable={false}
                                            sizes="(max-width: 768px) 15vw, 10vw"
                                        />
                                    </div>
                                </div>

                                {/* Floating Glassmorphic Tooltip on Hover */}
                                {isHovered && (
                                    <div
                                        className=" w-60 absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] z-50  cursor-auto animate-in fade-in zoom-in-95 duration-200"
                                    >
                                        <div className=" w-full bg-[#ffffff] rounded-xs text-black text-left p-4   shadow-2xl">
                                            <div className=" w-full  flex items-center justify-between">
                                                <p className="font-semibold   uppercase">
                                                    {item.title}
                                                </p>
                                                <div
                                                    onClick={() => setOpenGallerySwiper(item)} className="size-5 hover:bg-black hover:text-white cursor-pointer transition-all duration-300 border border-black/50 center rounded-full">
                                                    <RiAddLine className="size-3" />
                                                </div>
                                            </div>
                                            {item.subtitle && (
                                                <p className="text-xs mt-2 opacity-70">
                                                    {item.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Fullscreen Infinite Carousel Modal */}
            <DemoInfiniteCarousel
                openGallerySwiper={openGallerySwiper}
                setOpenGallerySwiper={setOpenGallerySwiper}
                allGalleries={demoGalleryData}
            />
        </main>
    );
}