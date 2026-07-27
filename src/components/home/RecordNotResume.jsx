"use client";
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Image from 'next/image';

const testimonials = [
    {
        id: 1,
        quote: "Working with Piran was one of the most valuable investments we made as a leadership team. He brought clarity to conversations that had been unresolved for months, helping us align around a shared direction and focus on what truly mattered.",
        name: "Isaac Heath",
        img:"/images/homepage/testimonials/img1.png",
        title: "Founder & CEO",
        bgColor: "bg-[#883F27]",
        textColor: "text-white"
    },
    {
        id: 2,
        quote: "Working with Piran was one of the most valuable investments we made as a leadership team. He brought clarity to conversations that had been unresolved for months, helping us align around a shared direction and focus on what truly mattered.",
        name: "Nora Mckee",
        img:"/images/homepage/testimonials/img2.png",
        title: "Founder & CEO",
        bgColor: "bg-[#E3E2DC]",
        textColor: "text-gray-900"
    },
    {
        id: 3,
        quote: "Working with Piran was one of the most valuable investments we made as a leadership team. He brought clarity to conversations that had been unresolved for months, helping us align around a shared direction and focus on what truly mattered.",
        name: "Junior Frye",
        img:"/images/homepage/testimonials/img3.png",
        title: "Founder & CEO",
        bgColor: "bg-white",
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
                            A Record, <br className="hidden md:block" /> Not A Resume
                        </h2>
                        <p data-para-effect className=" hidden md:block opacity-70 leading-tight text-lg mt-3">
                            Creating meaningful outcomes <br className="hidden md:block" /> through strategy, action, and <br className="hidden md:block" /> partnership.
                        </p>
                        <p data-para-effect className=" md:hidden opacity-70 leading-tight text-lg mt-3">
                            Creating meaningful outcomes  through strategy, action, and  partnership.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row w-full md:col-span-2 gap-2 md:gap-0 md:border md:border-[#18253220] md:border-dashed">
                    <div className="w-full md:w-[60%] border border-dashed border-[#18253220] md:border-none md:border-r flex flex-col">
                        <div className="flex-1 border-b border-[#18253220] border-dashed p-5 sm:p-8 flex flex-col justify-between gap-y-6">
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                <div className="size-8 relative">
                                   <Image width={40} height={40} src="/images/homepage/testimonials/handshake.svg" alt="" />
                                    </div>
                            </div>
                            <div className="">
                            <h4 data-para-effect className="">7+ Years</h4>
                            <p className=" opacity-60 leading-tight">Building trusted relationships that drive <br className="hidden sm:block" /> meaningful business outcomes.</p>
                            </div>
                        </div>

                        <div className="flex-1 flex">
                            <div className="w-1/2 p-5 sm:p-8 border-r border-[#18253220] border-dashed flex flex-col justify-between gap-y-6">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                    <div className="size-8 relative">
                                    <Image width={40} height={40} src="/images/homepage/testimonials/bounty.svg" alt="" />
                                     </div>
                                </div>
                                <div className="">
                                <h4 data-para-effect className="">150+</h4>
                                <p className="opacity-60 leading-tight">Founders & Leaders Advised</p>
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
                                <p className="opacity-60 leading-tight">Continents Worked Across</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-[40%]">
                        <Swiper
                            ref={swiperRef}
                            modules={[Autoplay]}
                            autoplay={true}
                            loop={true}
                            className="h-full animate-marquee-custom"
                            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        >
                            {testimonials.map((t,i) => (
                                <SwiperSlide key={t.id}>
                                    <div className={`w-full aspect-3/5 h-full flex flex-col justify-between max-sm:border max-sm:border-[#18253220] max-sm:border-dashed p-5 md:p-8 relative overflow-hidden ${t.bgColor} ${t.textColor}`}>
                                    <div className="absolute inset-0 w-full h-full">
                                        <Image fill src="/images/homepage/testimonials/card_bg.png" alt="" />
                                    </div>
                                        <div className="">
                                        <div className="flex justify-between items-center mb-8 relative z-10">
                                            <div className={`opacity-90 size-10 ${i===0 ? "invert-0 ":"invert-100"}`}>
                                                <Image width={100} height={50} src="/icons/quote.svg" alt="quote" />
                                            </div>
                                            <div className="flex gap-1.5 items-center pointer-events-auto">
                                                {testimonials.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            swiperRef.current?.swiper?.slideToLoop(idx);
                                                        }}
                                                        className={`size-2 rounded-full border transition-all duration-300 ${
                                                            activeIndex === idx
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
    )
}

export default RecordNotResume;
