"use client";
import { growthPartnersData, venturesData } from '@/data/PartnersData';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { flushSync } from 'react-dom';
import { RiArrowRightUpLine, RiLinkedinBoxFill, RiLinkedinBoxLine, RiTwitterXLine } from '@remixicon/react';

gsap.registerPlugin(ScrollTrigger, Flip);

const Partners = () => {
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isGrowth, setIsGrowth] = useState(false);
    const [isMerged, setIsMerged] = useState(false);

    const containerRef = useRef(null);
    const stickyRef = useRef(null);

    useGSAP(() => {
        // Initial scale/fade-in animation when section first enters viewport
        gsap.fromTo(".partner-card",
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                stagger: 0.04,
                duration: 0.6,
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 50%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top+=15% top",
            onEnter: () => {
                const state = Flip.getState(".partner-card");
                flushSync(() => {
                    setIsGrowth(true);
                    setIsMerged(false);
                });
                Flip.from(state, {
                    stagger: 0.04,
                    duration: 0.6,
                    ease: "back.out(1.2)",
                    onEnter: elements => gsap.fromTo(elements,
                        { scale: 0, opacity: 0, y: 0 },
                        {
                            scale: 1,
                            opacity: 1,
                            y: 0,
                            stagger: 0.04,
                            duration: 0.6,
                            ease: "back.out(1.2)"
                        }
                    ),
                });
            },
            onLeaveBack: () => {
                const state = Flip.getState(".partner-card");
                flushSync(() => {
                    setIsGrowth(false);
                    setIsMerged(false);
                });
                Flip.from(state, {
                    stagger: 0.04,
                    duration: 0.6,
                    ease: "back.out(1.2)",
                    onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.8, duration: 0.6, stagger: { from: "end", each: 0.04 }, ease: "back.out(1.2)" }),
                });
            },
        });

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top+=50% top",
            onEnter: () => {
                flushSync(() => {
                    setIsMerged(true);
                });
                
                const tl = gsap.timeline();
                tl.to(".grid-container", 
                    { gap: "0px", duration: 0.4, ease: "power2.inOut" }
                )
                .to(".partner-card",
                    { borderWidth: "0px", duration: 0.4, ease: "power2.inOut" },
                    "-=0.1"
                )
                .to(".merged-card-overlay", 
                    {
                        opacity: 1,
                        duration: 0.6,
                        ease: "back.out(1.2)"
                    },
                    "-=0.2"
                )
            },
            onLeaveBack: () => {
                gsap.killTweensOf(".grid-container, .partner-card, .merged-card-overlay");
                gsap.to(".merged-card-overlay", { opacity: 0, duration: 0.3 });
                gsap.set(".grid-container", { clearProps: "gap" });
                gsap.set(".partner-card", { clearProps: "borderWidth" });
                
                flushSync(() => {
                    setIsMerged(false);
                });
            },
        });
    }, { scope: containerRef });

    const dummyDetails = {
        name: "UNP",
        tags: ["TECHNOLOGY", "INDIA", "USA"],
        founder: "Robin Charles",
        website: "#",
        desc1: "At its core, UNP is a platform built around people. We believe the strongest businesses are created through trusted relationships, clear thinking, and a shared commitment to long-term success. By bringing together exceptional founders, strategic partners, and growth opportunities, we help create the conditions for meaningful progress.",
        desc2: "More than a network, UNP is a catalyst for collaboration and transformation. We work alongside ambitious leaders to navigate complexity, uncover opportunities, and build stronger foundations for the future. Through strategic guidance, trusted partnerships, and a long-term perspective, we help businesses move forward with greater clarity."
    };

    const getLogo = (item, i) => {
        if (!isGrowth && !isMerged) {
            return venturesData[i]?.logo || item.logo;
        } else {
            return `/images/homepage/partners/ventures/img${(i % 5) + 1}.svg`;
        }
    };

    const handlePartnerClick = (item, i) => {
        if (isMerged) return;
        if (!isGrowth) {
            setSelectedPartner(venturesData[i] || item);
        } else {
            setSelectedPartner(item);
        }
    };

    return (
        <div ref={containerRef} className="container bg-[#0B1A2C] text-white relative h-[400vh]! w-full">
            <div ref={stickyRef} className="sticky top-0 w-full h-screen  overflow-hidden ">

                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[33%] z-10 transition-all duration-600 ease-out flex flex-col justify-center">
                    <div className="relative w-full h-40">
                        <div className={`w-full transition-all duration-500 ease-out absolute inset-0 flex flex-col justify-center  ${!isGrowth && !isMerged ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
                            <h2 data-para-effect className="leading-none text-5xl ">Ventures Founded</h2>
                            <p data-para-effect className="opacity-60 leading-tight text-lg mt-6 ">Companies built from the <br /> ground up.</p>
                        </div>
                        <div className={`w-full transition-all duration-500 ease-out absolute inset-0 flex flex-col justify-center  ${isGrowth && !isMerged ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                            <h2 data-para-effect className="leading-none text-5xl ">Growth Partners</h2>
                            <p data-para-effect className="opacity-60 leading-tight text-lg mt-6 ">Businesses supported  through investment  <br />and strategic growth.</p>
                        </div>
                        <div className={`w-full transition-all duration-500 ease-out absolute inset-0 flex flex-col justify-center  ${isMerged ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                            <h2 data-para-effect className="leading-none text-5xl ">Currently Building<br />Fintech Infrastructure</h2>
                        </div>
                    </div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[64%] h-[50vh] flex items-center">
                    <div className="relative w-full transition-all duration-500 ease-in-out">
                        <div className={`grid-container w-full grid
                            ${isMerged ? 'gap-0 h-full' : 'gap-2'}
                            ${isGrowth ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'}
                            `}
                        >
                            {Array.from({ length: isMerged ? 18 : (isGrowth ? growthPartnersData.length : 5) }).map((_, i) => {
                                const item = growthPartnersData[i] || { id: `dummy-${i}` };
                                const isDummy = i >= growthPartnersData.length;
                                return (
                                    <div
                                        key={item.id}
                                        data-flip-id={isDummy ? `dummy-${i}` : `partner-${item.id}`}
                                        onClick={() => !isDummy && handlePartnerClick(item, i)}
                                        className={`partner-card flex items-center justify-center w-full ${isGrowth ? 'aspect-6/5' : 'aspect-square'}
                                            ${isMerged
                                                ? 'bg-[#152535]/80 rounded-none border-[0.5px] border-[#0B1A2C]/50'
                                                : 'bg-white/5 rounded-lg cursor-pointer hover:bg-[#253646] transition-colors duration-300'
                                            }`}
                                    >
                                        {!isMerged && !isDummy && (
                                            <div className="w-20 h-10 center relative">
                                                <Image fill src={getLogo(item, i)} alt="" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div
                            className="merged-card-overlay absolute inset-0 bg-[#152535]/90  overflow-hidden  p-4 md:p-8"
                            style={{ opacity: 0, zIndex: 50, pointerEvents: isMerged ? 'auto' : 'none' }}
                        >
                            <div className="w-full h-full">
                                    <div className="grid grid-cols-5 w-full h-full gap-x-16 text-white">
                                        
                                        <div className="  col-span-2 h-full flex flex-col justify-between w-full">
                                            <div className="">

                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-8 h-8 bg-white rounded-sm transform rotate-45 flex-shrink-0 mt-1"></div>
                                                <h3 className="text-4xl font-bold text-white tracking-tight">{dummyDetails.name}</h3>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                                                <div className="flex flex-wrap gap-2 text-xs ">
                                                    <span className="px-4 py-2 border border-white/20  text-white rounded-full flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-white"></div> {dummyDetails.tags[0]}
                                                    </span>
                                                    <span className="px-4 py-2 border border-white/20  text-white rounded-full">{dummyDetails.tags[1]}</span>
                                                    <span className="px-4 py-2 border border-white/20  text-white rounded-full">{dummyDetails.tags[2]}</span>
                                                </div>
                                                <a href={dummyDetails.website} className="px-4 py-2 pl-3 border border-white/20 rounded-full text-xs  flex items-center gap-2 text-white hover:bg-white hover:text-[#152535] transition-colors duration-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                    </svg>
                                                    WEBSITE
                                                </a>
                                            </div>
                                            </div>

                                            <div className="flex flex-wrap text-white items-center justify-between border-t border-white/10 pt-4 gap-4">
                                                <div>
                                                    <p className="text-sm mb-1 opacity-70">Founder</p>
                                                    <p className="font-medium text-lg">{dummyDetails.founder}</p>
                                                </div>
                                                <div className="flex gap-2 opacity-80">
                                                    <RiTwitterXLine/>
                                                    <RiLinkedinBoxFill/>
                                                   
                                                </div>
                                            </div>
                                        </div>

                                        <div className=" col-span-3   w-full">
                                            <div className="flex justify-between items-center ">
                                                <h5 className="text-xl font-medium">Introducing {dummyDetails.name}</h5>
                                            </div>
                                            <div data-lenis-prevent className="mt-4 overflow-y-scroll scroller_none h-70">
                                                <div className="text-white opacity-70 leading-relaxed space-y-4">
                                                    <p>{dummyDetails.desc1}</p>
                                                    <p>{dummyDetails.desc2}</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                         
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div
                className={` ${selectedPartner ? "opacity-100 pointer-events-auto" : " opacity-0 pointer-events-none"} transition-all duration-300 fixed inset-0 z-50 flex items-center justify-center bg-[#0a1118]/80 backdrop-blur-sm p-4 `}
                onClick={() => setSelectedPartner(null)}
            >
                <div
                    className={`bg-white text-black w-full max-w-2xl rounded-3xl overflow-hidden relative flex flex-col max-h-[85vh] shadow-2xl transition-all duration-300 ${selectedPartner ? "translate-y-0" : " translate-y-5"}  `}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 overflow-y-auto">

                        <div className="bg-[#0B1A2C10] rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-[#883F27] rounded-sm transform rotate-45 flex-shrink-0 mt-1"></div>
                                <h3 data-para-effect className="text-4xl font-bold text-[#883F27] tracking-tight">{dummyDetails.name}</h3>
                            </div>

                            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                                <div className="flex flex-wrap gap-2 text-xs  text-black">
                                    <span className="px-4 py-1.5 border border-black/10 rounded-full flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#883F27]"></div> {dummyDetails.tags[0]}
                                    </span>
                                    <span className="px-4 py-1.5 border border-black/10 rounded-full">{dummyDetails.tags[1]}</span>
                                    <span className="px-4 py-1.5 border border-black/10 rounded-full">{dummyDetails.tags[2]}</span>
                                </div>
                                <a href={dummyDetails.website} className="px-4 py-1.5 pl-3 border-black/10 border rounded-full text-xs  flex items-center gap-2 hover:bg-[#883F27] hover:text-white transition-colors duration-300 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    WEBSITE
                                </a>
                            </div>

                            <div className="flex flex-wrap text-[#883F27] items-center justify-between border-b border-gray-100  gap-4">
                                <div>
                                    <p className=" text-sm mb-1">Founder</p>
                                    <p className=" font-medium text-lg">{dummyDetails.founder}</p>
                                </div>
                                <div className="flex gap-4">
                                    <a href="#" className="hover:opacity-70 transition-opacity">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    </a>
                                    <a href="#" className="hover:opacity-70 transition-opacity">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div
                                className="flex justify-between items-center pt-5  cursor-pointer group"

                            >
                                <h5 className="">Introducing {dummyDetails.name}</h5>
                            </div>
                            <div className={`grid transition-all duration-300 ease-in-out `}>
                                <div data-lenis-prevent className=" overflow-y-scroll scroller_none h-44">
                                    <div className=" text-[#0B1A2C] opacity-70 leading-tight space-y-4  pt-1">
                                        <p>{dummyDetails.desc1}</p>
                                        <p>{dummyDetails.desc2}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Partners;