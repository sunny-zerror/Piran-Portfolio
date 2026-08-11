"use client";
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Image from 'next/image';
import gsap from 'gsap';

const testimonials = [
    {
        id: 1,
        quote: "Piran took the time to understand the legacy before touching anything. The identity and the website that followed finally gave our digital presence the weight the name deserved.",
        name: "Salman Khan Films",
        img: "/images/homepage/testimonials/img1.png",
        title: "",
        bgColor: "bg-[#883F27]",
        textColor: "text-white"
    },
    {
        id: 2,
        quote: "Piran rebuilt how Naturefit shows up: what we stand for, how we say it, and how it all holds together.",
        name: "Naturefit",
        img: "/images/homepage/testimonials/img2.png",
        title: "",
        bgColor: "bg-[#E3E2DC]",
        textColor: "text-gray-900"
    },
    {
        id: 3,
        quote: "Piran was in the room for every decision that made KVAR what it is, from how the brand carries itself to our five-floor experience centre. Today we deliver turnkey projects alongside international designers. It wouldn't have happened without him.",
        name: "KVAR",
        img: "/images/homepage/testimonials/img3.png",
        title: "",
        bgColor: "bg-white",
        textColor: "text-gray-900"
    },
    {
        id: 4,
        quote: "Piran led our Campus Ambassador programme and treated JBL like his own brand. Engagement kept climbing, and his read of youth culture stayed in our playbook long after.",
        name: "JBL / Harman",
        img: "/images/homepage/testimonials/img1.png",
        title: "",
        bgColor: "bg-[#883F27]",
        textColor: "text-white"
    },
    {
        id: 5,
        quote: "We perfected the product. Piran perfected everything the customer meets before it: the idea, the feel, the reason to care. From a sold-out first pop-up to three full ranges today, that early work shows.",
        name: "House of Namah",
        img: "/images/homepage/testimonials/img2.png",
        title: "",
        bgColor: "bg-[#E3E2DC]",
        textColor: "text-gray-900"
    }
];

const RecordNotResume = () => {
    const swiperRef = useRef(null);
    const dragBtnRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (dragBtnRef.current) {
            gsap.to(dragBtnRef.current, {
                x: x,
                y: y,
                duration: 0.5,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        }
    };

    return (
        <div className="container py-12 md:py-24 relative">
            <div className="flex flex-col md:grid md:grid-cols-3 gap-y-10 md:gap-x-20">

                <div className="w-full md:col-span-1 flex flex-col justify-between space-y-4 md:space-y-0">
                    <div>
                        <h2 data-para-effect className="leading-none">
                            A Record, <br />Not a Resume
                        </h2>
                        <p data-para-effect className=" hidden md:block opacity-70 leading-tight text-lg mt-3">
                            The work speaks in  outcomes,  <br className="hidden md:block" /> not titles.
                        </p>
                        <p data-para-effect className=" md:hidden opacity-70 leading-tight text-lg mt-3">
                            The work speaks in outcomes, not titles.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row w-full md:col-span-2 gap-2 md:gap-0 md:border md:border-[#0B1A2C20] md:border-dashed">
                    <div className="w-full md:w-[60%] border border-dashed border-[#0B1A2C20] md:border-none md:border-r flex flex-col">
                        <div className="flex-1 border-b border-[#0B1A2C20] border-dashed p-5 sm:p-8 flex flex-col justify-between gap-y-6">
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                <div className="size-8 relative">
                                    <Image width={40} height={40} src="/images/homepage/testimonials/handshake.svg" alt="" />
                                </div>
                            </div>
                            <div className="">
                                <h4 data-para-effect className="">7+</h4>
                                <p className=" opacity-60 leading-tight">Years in Practice</p>
                            </div>
                        </div>

                        <div className="flex-1 flex">
                            <div className="w-1/2 p-5 sm:p-8 border-r border-[#0B1A2C20] border-dashed flex flex-col justify-between gap-y-6">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                    <div className="size-8 relative">
                                        <Image width={40} height={40} src="/images/homepage/testimonials/bounty.svg" alt="" />
                                    </div>
                                </div>
                                <div className="">
                                    <h4 data-para-effect className="">170+</h4>
                                    <p className="opacity-60 leading-tight">Brands Worked With</p>
                                </div>
                            </div>
                            <div className="w-1/2 p-5 sm:p-8 flex flex-col justify-between gap-y-6">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                    <div className="size-8 relative">
                                        <Image width={40} height={40} src="/images/homepage/testimonials/earth.svg" alt="" />
                                    </div>
                                </div>
                                <div className="">
                                    <h4 data-para-effect className="">5</h4>
                                    <p className="opacity-60 leading-tight">Continents Spanned</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-[40%] relative group overflow-hidden">
                        {/* Custom Glassmorphism Drag Button */}
                        <div
                            ref={dragBtnRef}
                            className={`pointer-events-none absolute left-0 top-0 z-30 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur-md bg-white/20 border border-white/40 text-black shadow-lg transition-opacity duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                                } flex items-center gap-1.5`}
                            style={{
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                            }}
                        >
                            <span>Drag</span>
                        </div>

                        <div
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onMouseMove={handleMouseMove}
                            className="h-full cursor-none"
                        >
                            <Swiper
                                ref={swiperRef}
                                modules={[Autoplay]}
                                autoplay={{ delay: 3500, disableOnInteraction: false }}
                                speed={1000}
                                loop={true}
                                className="h-full animate-marquee-custom [&_.swiper-wrapper]:ease-out"
                                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                            >
                                {testimonials.map((t, i) => (
                                    <SwiperSlide key={t.id}>
                                        <div className={`w-full aspect-3/5 h-full flex flex-col justify-between max-sm:border max-sm:border-[#0B1A2C20] max-sm:border-dashed p-5 md:p-8 relative overflow-hidden ${t.bgColor} ${t.textColor}`}>
                                            <div className="absolute inset-0 w-full h-full">
                                                <Image fill src="/images/homepage/testimonials/card_bg.png" alt="" />
                                            </div>
                                            <div className="">
                                                <div className="flex justify-between items-center mb-8 relative z-10">
                                                    <div className={`opacity-90 size-10 ${i === 0 ? "invert-0 " : "invert-100"}`}>
                                                        <Image width={100} height={50} src="/icons/quote.svg" alt="quote" />
                                                    </div>
                                                    <div className="flex gap-1.5 items-center pointer-events-auto z-20">
                                                        {testimonials.map((_, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    swiperRef.current?.swiper?.slideToLoop(idx);
                                                                }}
                                                                aria-label={`Go to slide ${idx + 1}`}
                                                                className={`size-2 rounded-full border transition-all duration-300 ${activeIndex === idx
                                                                        ? 'bg-current border-current scale-110'
                                                                        : 'bg-transparent opacity-40 border-current'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <p className="text-2xl leading-tight">
                                                    "{t.quote}"
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 mt-12 relative z-10">
                                                <div className="w-12 h-12 relative rounded-full bg-black/10 overflow-hidden flex-shrink-0">
                                                    <Image fill src={t.img} alt="" />
                                                </div>
                                                <div>
                                                    <h5 className=" font-medium leading-none">{t.name}</h5>
                                                    <p className="opacity-70">{t.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default RecordNotResume;
