"use client";
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Image from 'next/image';
import gsap from 'gsap';
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react';

const testimonials = [
    {
        id: 1,
        quote: "Piran took the time to understand the legacy before touching anything. The identity and the website that followed finally gave our digital presence the weight the name deserved.",
        name: "Salman Khan Films",
        img: "/images/homepage/testimonials/logos/skf.svg",
        title: "",
        bgColor: "bg-[#883F27]",
        textColor: "text-white"
    },
    {
        id: 2,
        quote: "Piran rebuilt how Naturefit shows up: what we stand for, how we say it, and how it all holds together.",
        name: "Naturefit",
        img: "/images/homepage/testimonials/logos/naturefit.png",
        title: "",
        bgColor: "bg-[#E3E2DC]",
        textColor: "text-gray-900"
    },
    {
        id: 3,
        quote: "Piran was in the room for every decision that made KVAR what it is, from how the brand carries itself to our five-floor experience centre. Today we deliver turnkey projects alongside international designers. It wouldn't have happened without him.",
        name: "KVAR",
        img: "/images/homepage/testimonials/logos/kvar.png",
        title: "",
        bgColor: "bg-white",
        textColor: "text-gray-900"
    },
    {
        id: 4,
        quote: "Piran led our Campus Ambassador programme and treated JBL like his own brand. Engagement kept climbing, and his read of youth culture stayed in our playbook long after.",
        name: "JBL / Harman",
        img: "/images/homepage/testimonials/logos/jbl.svg",
        title: "",
        bgColor: "bg-[#883F27]",
        textColor: "text-white"
    },
    {
        id: 5,
        quote: "We perfected the product. Piran perfected everything the customer meets before it: the idea, the feel, the reason to care. From a sold-out first pop-up to three full ranges today, that early work shows.",
        name: "House of Namah",
        img: "/images/homepage/testimonials/logos/namah.png",
        title: "",
        bgColor: "bg-[#E3E2DC]",
        textColor: "text-gray-900"
    }
];

const RecordNotResume = () => {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

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

                    <div className="w-full md:w-[40%] aspect-3/5 border-l border-[#0B1A2C20] border-dashed relative group overflow-hidden flex flex-col">
                        <div className="flex-1 w-full min-h-0 relative">
                            <Swiper
                                ref={swiperRef}
                                modules={[Autoplay]}
                                autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                                speed={1000}
                                loop={true}
                                className="h-full w-full"
                                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                            >
                                {testimonials.map((t, i) => (
                                    <SwiperSlide key={t.id}>
                                        <div className={`w-full h-full flex flex-col justify-between max-sm:border max-sm:border-[#0B1A2C20] max-sm:border-dashed p-5 md:p-8 relative overflow-hidden ${t.bgColor} ${t.textColor}`}>
                                            <div className="absolute inset-0 w-full h-full">
                                                <Image fill src="/images/homepage/testimonials/card_bg.png" alt="" />
                                            </div>
                                            <div className="">
                                                <div className="flex justify-between items-center mb-8 relative z-10">
                                                    <div className={`opacity-90 size-10 ${(i === 0 || i === 3) ? "invert-0 " : "invert-100"}`}>
                                                        <Image width={100} height={50} src="/icons/quote.svg" alt="quote" />
                                                    </div>
                                                </div>

                                                <p className="text-2xl leading-tight">
                                                    "{t.quote}"
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 mt-12 relative z-10">
                                                <div>
                                                    <h5 className="font-medium leading-none">{t.name}</h5>
                                                    <p className="opacity-70">{t.title}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <div className="w-full grid grid-cols-5 border-t border-[#0B1A2C20] border-dashed shrink-0">
                            {testimonials.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => swiperRef.current?.swiper?.slideToLoop(i)}
                                    className={`center aspect-square border-r border-[#0B1A2C20] border-dashed last:border-r-0 transition-colors group/btn ${activeIndex === i ? 'bg-[#883F27]' : 'hover:bg-[#0B1A2C05]'}`}
                                >
                                    <div
                                        className={`w-10 h-10 relative ${activeIndex === i ? 'invert-100' : 'invert-0'}`}
                                    ><Image fill className='object-contain' src={item.img} alt="testimonial logo" /></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default RecordNotResume;
