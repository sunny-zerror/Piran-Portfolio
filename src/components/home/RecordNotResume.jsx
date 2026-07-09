"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const testimonials = [
    {
        id: 1,
        quote: "Working with Piran was one of the most valuable investments we made as a leadership team. He brought clarity to conversations that had been unresolved for months, helping us align around a shared direction and focus on what truly mattered.",
        name: "Isaac Heath",
        title: "Founder & CEO",
        bgColor: "bg-[#883F27]",
        textColor: "text-white"
    },
    {
        id: 2,
        quote: "Working with Piran was one of the most valuable investments we made as a leadership team. He brought clarity to conversations that had been unresolved for months, helping us align around a shared direction and focus on what truly mattered.",
        name: "Nora Mckee",
        title: "Founder & CEO",
        bgColor: "bg-[#E3E2DC]",
        textColor: "text-gray-900"
    },
    {
        id: 3,
        quote: "Working with Piran was one of the most valuable investments we made as a leadership team. He brought clarity to conversations that had been unresolved for months, helping us align around a shared direction and focus on what truly mattered.",
        name: "Junior Frye",
        title: "Founder & CEO",
        bgColor: "bg-white",
        textColor: "text-gray-900"
    }
];

const RecordNotResume = () => {
    return (
        <div className="container bg-[#141d26]  text-white pb-14 font-sans relative">
            <div className="grid grid-cols-3 gap-x-20">

                <div className="w-full col-span-1 flex flex-col justify-between">
                    <h2 className="leading-none">
                        A Record, <br /> Not A Resume
                    </h2>
                    <p className="opacity-70 leading-tight text-lg">
                        Creating meaningful outcomes <br /> through strategy, action, and <br /> partnership.
                    </p>
                </div>

                <div className="flex w-full col-span-2">
                    <div className=" w-full lg:w-[60%] border-l border-t border-b border-white/20 border-dashed flex flex-col">
                        <div className="flex-1 border-b border-gray-700/50 border-dashed p-8  flex flex-col justify-between">
                            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="">
                            <h4 className="">7+ Years</h4>
                            <p className=" opacity-60 leading-tight">Building trusted relationships that drive <br /> meaningful business outcomes.</p>
                            </div>
                        </div>

                        <div className="flex-1 flex">
                            <div className="w-1/2 p-8 border-r border-gray-700/50 border-dashed flex flex-col justify-between">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className="">
                                <h4 className="">150+</h4>
                                <p className="opacity-60 leading-tight">Founders & Leaders Advised</p>
                                </div>
                            </div>
                            <div className="w-1/2 p-8 flex flex-col justify-between">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="">
                                <h4 className="">5</h4>
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
                            {testimonials.map((t) => (
                                <SwiperSlide key={t.id}>
                                    <div className={`w-full space-y-24 h-full flex flex-col p-8 relative overflow-hidden ${t.bgColor} ${t.textColor}`}>
                                        {/* Quote Icon */}
                                        <div className="opacity-90 mb-8">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.58333 17.3333C4.58333 13.9927 7.03961 11.218 10.274 10.7416L10.0163 9.00693C5.72754 9.64165 2.5 13.3855 2.5 17.8333V20.3333H6.66667V17.3333H4.58333ZM15.4167 17.3333C15.4167 13.9927 17.873 11.218 21.1073 10.7416L20.8496 9.00693C16.5609 9.64165 13.3333 13.3855 13.3333 17.8333V20.3333H17.5V17.3333H15.4167Z" />
                                            </svg>
                                        </div>

                                        <p className="text-2xl leading-tight">
                                            "{t.quote}"
                                        </p>

                                        <div className="flex items-center gap-4 mt-12 relative z-10">
                                            <div className="w-12 h-12 rounded-full bg-black/10 overflow-hidden flex-shrink-0">
                                                <div className="w-full h-full bg-black/20 flex items-center justify-center">
                                                    <svg className="w-6 h-6 opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="leading-none">{t.name}</h5>
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
