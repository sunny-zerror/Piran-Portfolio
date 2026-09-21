"use client";
import Image from 'next/image';
import React, { useState } from 'react';

const STRENGTH_IMAGES = [
    "/images/aboutpage/piran_4.JPG",
    "/images/aboutpage/piran.JPG",
    "/images/aboutpage/piran_2.JPG",
];

const items = [
    {
        id: "strengths",
        title: "Strengths",
        points: [
            "I know who to call, and they pick up.",
            "My taste is in what I leave out.",
            "I collect questions faster than answers."
        ]
    },
    {
        id: "working",
        title: "Still Working On",
        points: [
            "I'd rather do twelve takes than trust the first.",
            "I find the last ten percent hard to hand over.",
            "\"Let's figure it out\" is my reflex, and \"no\" still isn't."
        ]
    }
];

const AboutStrength = () => {
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    return (
        <>
            <div className="w-full py-12 md:py-24 bg-[#0B1A2C] relative z-[100] text-white">
                <div className="container h-fit!">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
                        {/* Left Column: Strengths & Accordion */}
                        <div className="flex flex-col  md:max-w-xl">
                            <div className="space-y-4">
                                <h2 data-para-effect className="leading-none">
                                    Strengths & Still <br /> Working On
                                </h2>
                                <p data-para-effect className="text-white/60 leading-tight">
                                    Building trust requires showing the blueprint, including the stress-points. These are the pillars of the practice and the areas currently undergoing reinforcement.
                                </p>
                            </div>

                            {/* Static List */}
                            <div className="mt-4 md:mt-24 flex flex-col">
                                {items.map((item) => (
                                    <div key={item.id} className="border-b border-dashed border-white/20 py-6 md:py-8 last:border-0">
                                        <h5 className="text-white mb-4">
                                            {item.title}
                                        </h5>
                                        <div className="space-y-2">
                                            {item.points.map((point, idx) => (
                                                <p key={idx} className="text-white/70 leading-tight">
                                                    {point}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Image with 5 Smooth Fade Switcher Buttons */}
                        <div className="flex justify-center md:justify-end">
                            <div
                                className="relative w-full max-sm:aspect-square md:w-[80%] aspect-square md:aspect-auto min-h-100 overflow-hidden rounded-xl flex items-center justify-center"
                            >
                                {STRENGTH_IMAGES.map((src, idx) => (
                                    <Image
                                        key={src}
                                        fill
                                        className={`cover transition-opacity duration-700 ease-in-out ${
                                            activeImgIndex === idx ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        src={src}
                                        alt={`Piran Tarapore ${idx + 1}`}
                                    />
                                ))}

                                {/* 5 Image Switcher Buttons */}
                                <div className="absolute z-30 bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/20 pointer-events-auto cursor-pointer">
                                    {STRENGTH_IMAGES.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImgIndex(idx)}
                                            className={`size-7 rounded-full text-xs font-medium transition-all duration-300 flex items-center justify-center ${
                                                activeImgIndex === idx
                                                    ? "bg-white text-[#0B1A2C] shadow-sm scale-110 font-bold"
                                                    : "text-white/70 hover:text-white hover:bg-white/15"
                                            }`}
                                            aria-label={`Switch to image ${idx + 1}`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutStrength