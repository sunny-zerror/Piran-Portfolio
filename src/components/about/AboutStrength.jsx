"use client";
import Image from 'next/image';
import React from 'react'

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
    return (
        <>
            <div className="w-full py-12 md:py-24 bg-[#0B1A2C] relative z-[100] text-white">
                <div className="container h-fit!">
                    <div className="grid grid-cols-1 md:grid-cols-2">
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

                        {/* Right Column: Transparent Cutout exposing sticky city background */}
                        <div className="flex justify-center md:justify-end">
                            <div
                                className="relative w-full max-sm:aspect-square md:w-[80%] aspect-square md:aspect-auto min-h-100 overflow-hidden rounded-xl  flex items-center justify-center pointer-events-none"
                            >
                                <Image fill className='cover' src={"/images/aboutpage/piran_pic.png"} alt='Piran Tarapore' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AboutStrength