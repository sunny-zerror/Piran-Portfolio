"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutWork = () => {
    const sectionRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(bgRef.current,
                { y: -100 },
                {
                    y: 100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

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

    return (
        <section ref={sectionRef} className="relative w-full min-h-screen py-24 flex flex-col justify-center overflow-hidden bg-cover bg-center">
            {/* Background Image with Dark & Dusk Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div ref={bgRef} className="absolute inset-0 w-full h-[124%] -top-[12%]">
                    <Image
                        src="/images/aboutpage/mumbai_city_bg.png"
                        alt="Mumbai Dusk Background"
                        fill
                        priority
                        className="cover"
                    />
                </div>
            </div>

            <div className="container relative z-10 flex flex-col gap-y-16 justify-between h-full">
                <div className="w-full grid grid-cols-6 items-end text-white">
                    <h2 data-para-effect className=' col-span-4 leading-none'> What I'm <br className="hidden md:block" /> Working On Now</h2>
                    <p data-para-effect className='opacity-70 leading-tight col-span-2 text-lg'>Exploring new ideas, building innovative solutions, and turning ambitious visions into lasting impact.</p>
                </div>
                <div className="relative flex flex-col space-y-5 w-full">


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
                                    className={`${colStartClass} col-span-12 md:col-span-6 rounded-2xl w-full p-6 md:p-8 items-end grid grid-cols-2 ${card.isGlass
                                        ? "bg-white/20 backdrop-blur-2xl  "
                                        : "bg-[#883F27] border border-[#883F27] "
                                        }`}
                                >
                                    {/* Left Column: Number & Title */}
                                    <div className="w-full  text-white flex gap-y-12 flex-col">
                                        <span className="">
                                            {card.id}
                                        </span>
                                        <h4 data-para-effect className=" leading-none w-[90%]">
                                            {card.title}
                                        </h4>
                                    </div>


                                    <div className="w-full border-l border-dashed border-white/30 pl-6">
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
        </section>
    );
};

export default AboutWork;