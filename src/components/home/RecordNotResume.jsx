"use client";
import React from 'react';
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
    return (
        <div className="container  py-24  relative">
            <div className="grid grid-cols-3 gap-x-20">

                <div className="w-full col-span-1 flex flex-col justify-between">
                    <h2 data-para-effect className="leading-none">
                        A Record, <br /> Not A Resume
                    </h2>
                    <p data-para-effect className="opacity-70 leading-tight text-lg">
                        Creating meaningful outcomes <br /> through strategy, action, and <br /> partnership.
                    </p>
                </div>

                <div className="flex w-full col-span-2 border  border-[#18253220] border-dashed">
                    <div className=" w-full lg:w-[60%]  border-t border-r  border-[#18253220] border-dashed flex flex-col">
                        <div className="flex-1 border-b border-[#18253220] border-dashed p-8  flex flex-col justify-between">
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                                <div className="size-8 relative">
                                   <Image width={40} height={40} src="/images/homepage/testimonials/handshake.svg" alt="" />
                                    </div>
                            </div>
                            <div className="">
                            <h4 data-para-effect className="">7+ Years</h4>
                            <p className=" opacity-60 leading-tight">Building trusted relationships that drive <br /> meaningful business outcomes.</p>
                            </div>
                        </div>

                        <div className="flex-1 flex">
                            <div className="w-1/2 p-8 border-r border-[#18253220] border-dashed flex flex-col justify-between">
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
                            <div className="w-1/2 p-8 flex flex-col justify-between">
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

                    <div className="w-full lg:w-[40%]">
                        <Swiper
                            modules={[Autoplay]}
                            autoplay={true}
                            loop={true}
                            className="h-full"
                        >
                            {testimonials.map((t,i) => (
                                <SwiperSlide key={t.id}>
                                    <div className={`w-full aspect-3/5 h-full flex flex-col justify-between p-8 relative overflow-hidden ${t.bgColor} ${t.textColor}`}>
                                    <div className="absolute inset-0 w-full h-full">
                                        <Image fill src="/images/homepage/testimonials/card_bg.png" alt="" />
                                    </div>
                                        <div className="">
                                        <div className={`opacity-90 size-10 ${i===0 ? "invert-0 ":"invert-100"} mb-8`}>
                                          <Image width={100} height={50} src="/icons/quote.svg" alt="quote" />
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
