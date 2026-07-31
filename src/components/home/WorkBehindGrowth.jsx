"use client";
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React from 'react'
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import WorkBehindBg from './WorkBehindBg';
import { WavePlaneCanvas } from './canvasComponent/Waveplane3d';
gsap.registerPlugin(ScrollTrigger)

const data = [
    {
        id: 1,
        title: "intensive",
        desc: "We examine the business, opportunities, challenges, positioning, and future direction.",
        num_img: "/images/homepage/workResult/num_1.svg",
        tags: ["Diagnosis", "alignment", "dentification", "opportunity"]
    },
    {
        id: 2,
        title: "building",
        desc: "This phase transforms strategy into decisions, systems, initiatives, and execution.",
        num_img: "/images/homepage/workResult/num_2.svg",
        tags: ["roadmap", "growth initiatives", "architecture", "organizational alignment"]
    },
    {
        id: 3,
        title: "intensive",
        desc: "We examine the business, opportunities, challenges, positioning, and future direction.",
        num_img: "/images/homepage/workResult/num_3.svg",
        tags: ["Diagnosis", "alignment", "dentification", "opportunity"]
    },
]

const WorkBehindGrowth = () => {

    useGSAP(() => {
        data.forEach((_, i) => {
            const parentSelector = `.anim_child_${i + 1}`;
            let startTrigger
            if (i === 0) startTrigger = "top center"
            if (i === 1) startTrigger = "center center"
            if (i === 2) startTrigger = "bottom center"


            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: parentSelector,
                    start: startTrigger,
                    toggleActions: "play none none reverse"
                }
            });

            tl.to(`${parentSelector} .num_svg`, {
                width: "25%",
                duration: 0.4,
                ease: "power1.inOut"
            }, 0);

            tl.to(`${parentSelector} .tags_btns`, {
                scale: 1,
                stagger: 0.1,
                ease: "back.out"
            }, 0);

            tl.to(`.circ_${i + 1}`, {
                scale: 1,
                backgroundColor: "white",
                duration: 0.4,
                ease: "power1.inOut"
            }, 0);
        });

        gsap.to(".fill_line", {
            height: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".anim_pren",
                start: "top center",
                end: "bottom center",
                scrub: true
            }
        });
    });

    return (
        <>
            <div className="container  bg-[#0B1A2C] mt-12 md:mt-24 pt-12 md:pt-24 space-y-8 md:space-y-16">
                <div className="w-full relative z-10 text-center">
                    <h2 data-para-effect className='leading-none text-white'>The Work Behind <br />   The Growth</h2>
                </div>

                <div className="anim_pren relative z-10 space-y-5">

                    <div className="hidden md:block w-2 h-full bg-[#343F4B] absolute left-1/2 -translate-x-1/2 top-0">
                        <div className=" circ_1 scale-90 absolute size-6 z-5 rounded-full -translate-x-1/2 left-1/2  top-0 -translate-y-1/2 bg-[#343F4B]"></div>
                        <div className="circ_2 scale-90 absolute size-6 z-5 rounded-full -translate-x-1/2 left-1/2  top-1/2 -translate-y-1/2 bg-[#343F4B]"></div>
                        <div className="circ_3 scale-90 absolute size-6 z-5 rounded-full -translate-x-1/2 left-1/2  bottom-0 translate-y-1/2 bg-[#343F4B]"></div>
                        <div className=" fill_line w-0.5 translate-x-0.75 bg-white h-0"></div>
                    </div>

                    {data.map((item, i) => (
                        <div key={i} className={`anim_child_${i + 1} grid grid-cols-3 gap-4 md:gap-0`}>
                            <div className="col-span-3 md:col-span-1 flex border border-dashed md:h-30 overflow-hidden rounded-xl border-white/20 text-white">
                                <div className=" num_svg  w-full overflow-hidden shrink-0 bg-[#E3E2DC] center">
                                    <img src={item.num_img} alt={`Step ${item.id} indicator`} className="h-20 lg:h-auto object-contain" />
                                </div>
                                <div className=" h-full flex shrink-0 flex-col  justify-center gap-y-2 px-4 py-3 md:px-5 md:py-0 w-[70%] md:w-auto">
                                    <h5 className='capitalize leading-none text-base md:text-lg'>{item.title}</h5>
                                    <p className='opacity-70 leading-tight text-xs md:text-sm max-w-52 sm:max-w-xs md:w-80'>{item.desc}</p>
                                    <div className="flex flex-wrap gap-1.5 mt-1 md:hidden">
                                        {item.tags.map((tag, i) => (
                                            <button key={i} className={` tags_btns scale-0 px-3 py-1.5 rounded-full center leading-none h-fit block text-[10px] uppercase text-white ${i % 2 === 0 ? "bg-white/12" : "bg-[#883F27]"} `}>{tag}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block"></div>
                            <div className="hidden md:flex col-span-1 flex-wrap px-5 items-center content-center gap-2 border border-dashed  md:h-30 overflow-hidden rounded-xl border-white/20">
                                {item.tags.map((tag, i) => (
                                    <button key={i} className={` tags_btns scale-0 px-4 py-2 rounded-full center leading-none h-fit block text-sm uppercase text-white ${i % 2 === 0 ? "bg-white/12" : "bg-[#883F27]"} `}>{tag}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
                <div className="w-full h-[60vh] bg-[#0B1A2C] relative">
                    <WavePlaneCanvas/>
                </div>
        </>
    )
}

export default WorkBehindGrowth