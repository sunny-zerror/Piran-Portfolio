"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { demoGalleryData } from "./demoGalleryData";
import DemoInfiniteCarousel from "./DemoInfiniteCarousel";
import { RiArrowLeftLine, RiEyeLine, RiFilter3Line } from "@remixicon/react";

export default function DemoPage() {
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

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#121417] flex items-center justify-center select-none font-sans">

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
            const isMatch = activeFilter === "all" || item.category === activeFilter;
            const isHovered = hoveredFrame?.id === item.id;

            return (
              <div
                key={item.id}
                id={`frame-${item.id}`}
                className={`absolute pointer-events-auto cursor-pointer group transition-all duration-300 ease-out ${
                  isMatch
                    ? "opacity-100 hover:z-40"
                    : "opacity-30 grayscale-[60%] scale-[0.97] pointer-events-none"
                }`}
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
                  className={`relative w-full h-full overflow-hidden transition-all duration-300 ease-out ${
                    item.id === "masai_mara"
                      ? "p-[3px] md:p-[4px] bg-[#f0ede6] border border-[#cfc9be]"
                      : "p-[1.5px] md:p-[2px] bg-[#faf8f5] border border-[#d8d3c7]"
                  } ${
                    isHovered
                      ? "shadow-[0_16px_36px_rgba(0,0,0,0.55),0_0_0_2px_rgba(255,255,255,0.85)] scale-105 -translate-y-1"
                      : "shadow-[0_6px_18px_rgba(0,0,0,0.32)]"
                  }`}
                  style={{
                    borderRadius: "1.5px"
                  }}
                >
                  {/* Frame Artwork Content */}
                  <div className="relative w-full h-full overflow-hidden bg-[#e8e4dc]">
                    {artMode === "art" ? (
                      /* Original Aesthetic Artwork Slice */
                      <img
                        src={item.artImg}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        draggable={false}
                      />
                    ) : (
                      /* Photographic Preview */
                      item.photoImg.endsWith(".mp4") ? (
                        <video
                          src={item.photoImg}
                          className="w-full h-full object-cover"
                          loop
                          muted
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img
                          src={item.photoImg}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          draggable={false}
                        />
                      )
                    )}

                    {/* Subtle Matte Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />
                  </div>
                </div>

                {/* Floating Glassmorphic Tooltip on Hover */}
                {isHovered && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] z-50 pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-200"
                  >
                    <div className="bg-[#18293A]/90 backdrop-blur-md text-white text-left px-3 py-1.5 rounded-lg border border-white/20 shadow-2xl">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/20 tracking-wider">
                          {item.category}
                        </span>
                        <span className="font-semibold text-xs tracking-wider uppercase">
                          {item.title}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[10px] text-white/70 tracking-normal mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                      <div className="text-[9px] text-[#A6E3E9] uppercase tracking-widest font-mono mt-1 flex items-center gap-1">
                        <span>Click to open carousel</span>
                        <span>→</span>
                      </div>
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