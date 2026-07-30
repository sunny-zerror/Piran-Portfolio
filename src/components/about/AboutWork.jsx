"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AboutStrength from './AboutStrength';

gsap.registerPlugin(ScrollTrigger);

const AboutWork = () => {
     const [openItem, setOpenItem] = useState(null);

  const toggleItem = (item) => {
    setOpenItem(openItem === item ? null : item);
  };
    const sectionRef = useRef(null);
    const bgRef = useRef(null);

    const cards = [
        {
            id: "01",
            title: "Building the Future of Fintech",
            desc: "Developing reliable fintech infrastructure for seamless digital experiences and innovation.",
            isGlass: true,
        },
        {
            id: "02",
            title: "Expanding Global Opportunities",
            desc: "Growing across international markets through collaboration, innovation, and a shared vision for success.",
            isGlass: false, // Terracotta/Rust card
        },
        {
            id: "03",
            title: "Empowering High- Growth Startups",
            desc: "Partnering with ambitious founders to build scalable businesses and lasting brands together.",
            isGlass: true,
        },
    ];

      const items = [
    {
      id: "strengths",
      title: "Strengths",
      desc: "I can dismantle a brand's logic to find the single point of failure within 24 hours of audit."
    },
    {
      id: "working",
      title: "Still Working On",
      desc: "Continually refining design systems, exploring new interactive paradigms, and scaling cross-functional capabilities."
    }
  ];

    return (
        <section ref={sectionRef} className="relative w-full  bg-[#0B1A2C]">
            {/* Sticky Background Image with Dark Overlay */}
            <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 z-0">
                    <div ref={bgRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                        <Image
                            src="/images/aboutpage/mumbai_city_bg.png"
                            alt="Mumbai Dusk Background"
                            fill
                            priority
                            className="cover"
                        />
                    </div>
                </div>
            </div>

            {/* Scrolling Content Layer over the Sticky Background */}
            <div className="relative z-10 -mt-[100vh]">
                <div className="container h-fit! py-12 md:py-24 flex flex-col gap-y-16 justify-between">
                    <div className="w-full md:grid grid-cols-6 items-end text-white">
                        <h2 data-para-effect className=' col-span-4 leading-none'> What I'm <br className="hidden md:block" /> Working On Now</h2>
                        <p data-para-effect className='opacity-70 max-sm:mt-2 leading-tight col-span-2 text-lg'>Exploring new ideas, building innovative solutions, and turning ambitious visions into lasting impact.</p>
                    </div>
                    <div className="relative flex flex-col space-y-0 md:space-y-5 w-full">

                        {cards.map((card, index) => {
                            const colStartClass = index === 2 && "col-start-1 md:col-start-7"
                            return (
                                <div
                                    key={card.id}
                                    className={`grid grid-cols-12`}
                                >
                                    {index === 1 && (
                                        <div className="col-span-3 pr-5 pl-[50%]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 160 87" fill="none" preserveAspectRatio="none" vectorEffect="non-scaling-stroke" data-process-svg-left="" aria-hidden="true" className="joint-svg text-white/50">
                                                <path d="M0.5 0V83C0.5 84.6569 1.84315 86 3.5 86H159.5" stroke="currentColor" strokeDasharray="2 4" className="animate-dash-line" style={{ opacity: 1 }}></path>
                                            </svg>
                                        </div>
                                    )}
                                    {/* Card Container */}
                                    <div
                                        className={`${colStartClass} col-span-12 md:col-span-6 rounded-2xl max-sm:space-y-5 w-full p-6 md:p-8 items-end md:grid grid-cols-2 ${card.isGlass
                                            ? "bg-white/20 backdrop-blur-2xl  "
                                            : "bg-[#883F27] border border-[#883F27] "
                                            }`}
                                    >
                                        {/* Left Column: Number & Title */}
                                        <div className="w-full  text-white flex gap-y-12 md:flex-col max-sm:justify-start max-sm:gap-x-5">
                                            <h4 className="leading-none">
                                                {card.id}
                                            </h4>
                                            <h4 data-para-effect className=" leading-none md:w-[90%]">
                                                {card.title}
                                            </h4>
                                        </div>

                                        <div className="w-full md:border-l border-dashed border-white/30 pl-12 md:pl-6">
                                            <p data-para-effect className="text-white/80 leading-tight">
                                                {card.desc}
                                            </p>
                                        </div>
                                    </div>

                                     {index === 1 && (
                                        <div className="col-span-3 flex items-end pl-5">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="50%" viewBox="0 0 160 87" fill="none" preserveAspectRatio="none" aria-hidden="true" vectorEffect="non-scaling-stroke" data-process-svg-right="" className="joint-svg text-white/50">
                                              <path d="M0 0.5H156C157.657 0.5 159 1.84315 159 3.5V86.5" stroke="currentColor" strokeDasharray="2 4" className="animate-dash-line" style={{ opacity: 1 }}></path>
                                          </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    </div>
                </div>

                <div className="w-full py-12 md:py-24 bg-[#0B1A2C] text-white">
                    <div className="container h-fit!">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                            {/* Left Column: Strengths & Accordion */}
                            <div className="flex flex-col md:space-y-44 md:max-w-xl">
                                <div className="space-y-4">
                                    <h2 data-para-effect className="leading-none">
                                        Strengths & Still <br /> Working On
                                    </h2>
                                    <p data-para-effect className="text-white/60 leading-tight">
                                        Building trust requires showing the blueprint, including the stress-points. These are the pillars of the practice and the areas currently undergoing reinforcement.
                                    </p>
                                </div>

                                {/* Accordion / Toggles */}
                                <div className="mt-4 md:mt-8 flex flex-col">
                                    {items.map((item) => {
                                        const isOpen = openItem === item.id;
                                        return (
                                            <div key={item.id} className="border-b border-dashed border-white/20 py-2 md:py-5">
                                                <button
                                                    onClick={() => toggleItem(item.id)}
                                                    className="w-full flex justify-between items-center text-left py-2 focus:outline-none group cursor-pointer"
                                                >
                                                    <h5 className="text-white">
                                                        {item.title}
                                                    </h5>
                                                    <h5 className="text-white">
                                                        {isOpen ? "−" : "+"}
                                                    </h5>
                                                </button>
                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                        isOpen ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
                                                    }`}
                                                >
                                                    <p className=" text-white/70 leading-tight">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Column: Transparent Cutout exposing sticky city background */}
                            <div className="flex justify-center md:justify-end">
                                <div 
                                    className="relative w-full max-sm:aspect-square md:w-[80%] aspect-square md:aspect-auto min-h-[400px] overflow-hidden rounded-xl  flex items-center justify-center pointer-events-none"
                                    style={{
                                        backgroundImage: "url('/images/aboutpage/mumbai_city_bg.png')",
                                        backgroundAttachment: "fixed",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat"
                                    }}
                                >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutWork;