"use client";
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { flushSync } from 'react-dom';
import { RiArrowRightUpLine, RiCloseLine } from '@remixicon/react';
import 'swiper/css';
import { Link } from 'next-view-transitions';
import CustomButton from '../common/CustomButton';

gsap.registerPlugin(ScrollTrigger);

const newPartnersData = {
    founded: [
        { id: 'f1', name: 'Point Of', role: 'Founder', desc: 'An independent consultancy rethinking how brands connect with culture and people. Point Of works at the intersection of design, strategy, and technology, translating ambition into identity and identity into impact. The Studio gives a brand its shape; the Consultancy keeps it sharp.', logo: '/images/homepage/partners/po.svg' },
        { id: 'f2', name: 'Casa Carigar', role: 'Co-Founder', desc: "An editorial marketplace for India's most considered furniture and décor studios. Curated makers, named pieces: Casa Carigar is built on the belief that Indian craft does not need preservation, it needs systems. From India, with intention.", logo: '/images/homepage/partners/casacarigar.svg' }
    ],
    backed: [
        { id: 'b1', name: 'Naturefit', role: 'Strategic Equity Partner', desc: 'A digital health platform for India\'s traditional medicine systems: Ayurveda, Yoga, and Siddha. Naturefit connects practitioners, products, diagnostics, and health plans in one place, bringing centuries-old practice the access and standards of modern healthcare. A Poonawalla Group company.', logo: '/images/homepage/partners/naturefit.png' },
        { id: 'b2', name: 'LVL', role: 'Strategic Equity Partner', desc: 'The outsourced finance team for growing businesses. LVL takes on the accounting and financial operations founders shouldn\'t be running themselves, with the discipline of an in-house function and none of its overhead.', logo: '/images/homepage/partners/lvl.png' }
    ],
    invested: [
        { id: 'i1', name: 'Marengo Asia Hospitals', role: 'Private Investor', desc: 'A multispecialty hospital network across the NCR, Rajasthan, and Gujarat, with 2,500 beds and counting. Marengo Asia is expanding healthcare capacity for a country that needs decades more of it.', logo: '/images/homepage/partners/marengo.png' },
        { id: 'i2', name: 'Edme Insurance', role: 'Private Investor', desc: 'An insurance-broking platform built through acquisition, including Aditya Birla Insurance Brokers, one of the country\'s leading broking houses. Edme is consolidating India\'s insurance distribution around a single customer-first thesis, alongside institutional capital.', logo: '/images/homepage/partners/edme.png' },
        { id: 'i3', name: 'Samara Capital', role: 'Limited Partner', desc: 'An India-focused investment firm that has deployed over 1.5 billion dollars since 2007. Samara Capital backs operators who transform fragmented businesses into scalable enterprises, across healthcare, insurance, and retail.', logo: '/images/homepage/partners/samara.svg' }
    ]
};

const Partners = () => {
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const activeIndexRef = useRef(0);
    const cardsRefs = useRef([[], [], [], []]);

    useEffect(() => {
        if (isPopupOpen) {
            if (window.lenis) window.lenis.stop();
        } else {
            if (window.lenis) window.lenis.start();
        }
        return () => {
            if (window.lenis) window.lenis.start();
        };
    }, [isPopupOpen]);

    useGSAP(() => {

        const bar_tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true
            },
        })
        bar_tl.to(".bottom_bar", {
            width: "100%",
            ease: "none"
        })
        bar_tl.to(".bottom_bar", {
            opacity: 0,
            duration: 0
        })

        let mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            // Set initial state for titles
            gsap.set(".title-section", { y: -50, opacity: 0, pointerEvents: "none" });
            gsap.set(".title-section-0", { y: 0, opacity: 1, pointerEvents: "auto" });

            // Set initial state for cards
            [1, 2, 3].forEach(idx => {
                gsap.set(cardsRefs.current[idx], { scale: 0.8, opacity: 0, pointerEvents: "none" });
                gsap.set(`.card-section-${idx}`, { zIndex: 0 });
            });
            gsap.set(`.card-section-0`, { zIndex: 1 });
            gsap.set(cardsRefs.current[0], { scale: 0.8, opacity: 0, pointerEvents: "auto" });

            // Initial entry: cards pop from scale 0.8 to 1 with stagger
            gsap.to(cardsRefs.current[0], {
                scale: 1,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%",
                    toggleActions: "play none none reverse"
                }
            });

            const transitionState = (newIndex) => {
                const oldIndex = activeIndexRef.current;
                if (oldIndex === newIndex) return;

                const goingForward = newIndex > oldIndex;

                activeIndexRef.current = newIndex;
                setActiveIndex(newIndex); // For mobile layout updates

                // Kill all tweens and reset inactive sections to ensure fast scrolling doesn't leave elements stuck
                [0, 1, 2, 3].forEach(idx => {
                    gsap.killTweensOf(`.title-section-${idx}`);
                    gsap.killTweensOf(cardsRefs.current[idx]);
                    if (idx !== oldIndex && idx !== newIndex) {
                        gsap.set(`.title-section-${idx}`, { opacity: 0, pointerEvents: "none" });
                        gsap.set(cardsRefs.current[idx], { opacity: 0, scale: 0.8, pointerEvents: "none" });
                        gsap.set(`.card-section-${idx}`, { zIndex: 0 });
                    }
                });

                // Animate old title out
                gsap.to(`.title-section-${oldIndex}`, {
                    y: goingForward ? -50 : 50,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.in",
                    onComplete: () => gsap.set(`.title-section-${oldIndex}`, { pointerEvents: "none" })
                });

                // Animate new title in
                gsap.fromTo(`.title-section-${newIndex}`,
                    { y: goingForward ? 50 : -50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out",
                        delay: 0.15,
                        onStart: () => gsap.set(`.title-section-${newIndex}`, { pointerEvents: "auto" })
                    }
                );

                // CARDS TRANSITION (No Flip, raw refs)
                gsap.set(`.card-section-${oldIndex}`, { zIndex: 0 });
                gsap.set(`.card-section-${newIndex}`, { zIndex: 1 });

                // Animate old cards out
                gsap.to(cardsRefs.current[oldIndex], {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.4,
                    ease: "power2.in",
                    stagger: 0.05,
                    onComplete: () => gsap.set(cardsRefs.current[oldIndex], { pointerEvents: "none" })
                });

                // Animate new cards in
                gsap.set(cardsRefs.current[newIndex], { pointerEvents: "auto" });
                gsap.fromTo(cardsRefs.current[newIndex],
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)", stagger: 0.1, delay: 0.1 }
                );
            };

            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top+=20% top",
                onEnter: () => transitionState(1),
                onLeaveBack: () => transitionState(0),
            });
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top+=40% top",
                onEnter: () => transitionState(2),
                onLeaveBack: () => transitionState(1),
            });
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top+=60% top",
                onEnter: () => transitionState(3),
                onLeaveBack: () => transitionState(2),
            });
        });

        return () => mm.revert();
    }, { scope: containerRef });

    const handlePartnerClick = (item) => {
        setSelectedPartner(item);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setTimeout(() => {
            setSelectedPartner(null);
        }, 300);
    };

    const renderAllCardSections = () => {
        return [0, 1, 2, 3].map(index => {
            let cards = [];
            let cardBasis = '100%';

            if (index === 0) {
                cards = newPartnersData.founded;
                cardBasis = 'calc(50% - 4px)';
            } else if (index === 1) {
                cards = newPartnersData.backed;
                cardBasis = 'calc(50% - 4px)';
            } else if (index === 2) {
                cards = newPartnersData.invested;
                cardBasis = 'calc(33.333% - 6px)';
            }

            if (index === 3) {
                return (
                    <div key={`section-${index}`} className={`card-section card-section-${index} absolute inset-0 w-full flex flex-wrap gap-2 items-center`}>
                        <div
                            ref={el => cardsRefs.current[3][0] = el}
                            className={`bg-[#152535] p-8 md:p-12 rounded-lg w-full flex flex-col justify-between  overflow-hidden relative`}
                            style={{ flexBasis: '100%' }}
                        >
                            <div className="inner-content h-full flex flex-col justify-between w-full fade-in">
                                <div>
                                    <h3 className="text-2xl font-medium mb-4 md:mb-6 text-white">Founder</h3>
                                    <p className="opacity-80 w-[80%] md:text-lg text-white">
                                        A company of my own is underway a wellness and nutraceutical brand, in stealth. After years of building for founders, it was time. The name arrives only when it's ready.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div key={`section-${index}`} className={`card-section card-section-${index} absolute inset-0 w-full flex flex-wrap gap-2 items-center`}>
                    {cards.map((item, i) => (
                        <div
                            key={item.id}
                            ref={el => cardsRefs.current[index][i] = el}
                            onClick={() => handlePartnerClick(item)}
                            style={{ flexBasis: cardBasis }}
                            className={`group relative flex items-center justify-center aspect-6/5 bg-white/5 rounded-lg cursor-pointer hover:bg-[#253646] transition-colors duration-300`}
                        >
                            <div className="w-full absolute bottom-0 flex items-end justify-between p-3 leading-none">
                                <p className='text-sm uppercase w-[80%]'>{item.name}</p>
                                <button aria-label={`View ${item.name} details`} className='p-1.5 bg-white/10 rounded-full group-hover:bg-white group-hover:text-[#0B1A2C] transition-all duration-300 '><RiArrowRightUpLine className='size-4' /></button>
                            </div>
                            <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                                <div className="w-44 h-20 center relative">
                                    <Image fill src={item.logo} alt={item.name} className="object-contain invert-100" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        });
    };

    return (
        <div ref={containerRef} className="container bg-[#0B1A2C] text-white relative h-auto md:h-[400vh]! w-full">
            <div ref={stickyRef} className="hidden md:block sticky! top-0 w-full h-screen! overflow-hidden ">

                <div className="bottom_bar absolute h-1 bg-[#E3E2DC] w-0 left-0 bottom-1 rounded-full"></div>

                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[40%] z-10 flex flex-col justify-center">
                    <div className="relative w-[80%] h-40">
                        <div className="title-section title-section-0 w-full absolute inset-0 flex flex-col justify-center">
                            <h2 data-para-effect>Founded</h2>
                            <p className="opacity-60 leading-tight text-lg mt-6">Companies built from the ground up, and the ones still being built.</p>
                        </div>
                        <div className="title-section title-section-1 w-full absolute inset-0 flex flex-col justify-center">
                            <h2>Backed </h2>
                            <p className="opacity-60 leading-tight text-lg mt-6">Brands where the thinking earned ownership and the engagement never really ends.</p>
                        </div>
                        <div className="title-section title-section-2 w-full absolute inset-0 flex flex-col justify-center">
                            <h2>Invested </h2>
                            <p className="opacity-60 leading-tight text-lg mt-6">Private positions taken early and held with patience, in businesses playing long games.</p>
                        </div>
                        <div className="title-section title-section-3 w-full absolute inset-0 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-4">
                                <h2 className="leading-none m-0 p-0">Now</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[60%] h-full flex items-center">
                    {renderAllCardSections()}
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="block md:hidden py-12 space-y-16">
                {/* Mobile Founded */}
                <div className="space-y-6">
                    <div>
                        <h2 data-para-effect>Founded</h2>
                        <p className="opacity-60 leading-tight mt-2">Companies built from the ground up, and the ones still being built.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {newPartnersData.founded.map((item) => (
                            <div key={item.id} onClick={() => { setSelectedPartner(item); setIsPopupOpen(true); }} className="flex relative items-center justify-center w-full aspect-6/5 bg-white/5 rounded-md cursor-pointer active:bg-[#253646] transition-colors border border-white/10 shrink-0">
                                <div className="w-full absolute bottom-0 flex items-end justify-between p-2 leading-none">
                                    <p className='text-xs uppercase w-[80%]'>{item.name}</p>
                                    <button aria-label={`View ${item.name} details`} className='p-1 bg-white/10 rounded-full group-hover:bg-white group-hover:text-[#0B1A2C] transition-all duration-300 '><RiArrowRightUpLine className='size-4' /></button>
                                </div>
                                <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-10 center relative">
                                        <Image fill src={item.logo} alt={item.name} className="object-contain invert-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Backed */}
                <div className="space-y-6">
                    <div>
                        <h2 data-para-effect>Backed </h2>
                        <p className="opacity-60 leading-tight mt-2">Brands where the thinking earned ownership and the engagement never really ends.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {newPartnersData.backed.map((item) => (
                            <div key={item.id} onClick={() => { setSelectedPartner(item); setIsPopupOpen(true); }} className="flex relative items-center justify-center w-full aspect-6/5 bg-white/5 rounded-md cursor-pointer active:bg-[#253646] transition-colors border border-white/10 shrink-0">
                                <div className="w-full absolute bottom-0 flex items-end justify-between p-2 leading-none">
                                    <p className='text-xs uppercase w-[80%]'>{item.name}</p>
                                    <button aria-label={`View ${item.name} details`} className='p-1 bg-white/10 rounded-full group-hover:bg-white group-hover:text-[#0B1A2C] transition-all duration-300 '><RiArrowRightUpLine className='size-4' /></button>
                                </div>
                                <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-10 center relative">
                                        <Image fill src={item.logo} alt={item.name} className="object-contain invert-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Invested */}
                <div className="space-y-6">
                    <div>
                        <h2 data-para-effect>Invested </h2>
                        <p className="opacity-60 leading-tight mt-2">Private positions taken early and held with patience, in businesses playing long games.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {newPartnersData.invested.map((item) => (
                            <div key={item.id} onClick={() => { setSelectedPartner(item); setIsPopupOpen(true); }} className="flex relative items-center justify-center w-full aspect-6/5 bg-white/5 rounded-md cursor-pointer active:bg-[#253646] transition-colors border border-white/10 shrink-0">
                                <div className="w-full absolute bottom-0 flex items-end justify-between p-2 leading-none">
                                    <p className='text-xs uppercase w-[80%]'>{item.name}</p>
                                    <button aria-label={`View ${item.name} details`} className='p-1 bg-white/10 rounded-full group-hover:bg-white group-hover:text-[#0B1A2C] transition-all duration-300 '><RiArrowRightUpLine className='size-4' /></button>
                                </div>
                                <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-10 center relative">
                                        <Image fill src={item.logo} alt={item.name} className="object-contain invert-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile NOW */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <h2 data-para-effect className="leading-none m-0 p-0">Now</h2>
                    </div>

                    <div className="bg-[#152535] p-5 rounded-lg w-full flex flex-col overflow-hidden relative justify-between">
                        <h3 className="text-2xl font-medium mb-4 md:mb-6 text-white">Founder</h3>
                        <p className="opacity-80 md:text-lg text-white">
                            A company of my own is underway a wellness and nutraceutical brand, in stealth. After years of building for founders, it was time. The name arrives only when it's ready.
                        </p>
                    </div>
                </div>
            </div>

            {/* Popup Overlay for selected partner */}
            <div
                className={`${isPopupOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all duration-300 fixed inset-0 z-[100000] flex items-center justify-center bg-[#0a1118]/80 backdrop-blur-sm p-4`}
                onClick={handleClosePopup}
            >
                <div
                    onClick={handleClosePopup}
                    className="text-black bg-white absolute rounded-full p-2 right-3 top-3 md:hidden z-10"
                >
                    <RiCloseLine />
                </div>
                <div
                    className={`bg-white text-black w-full max-w-2xl rounded-xl md:rounded-3xl overflow-hidden relative flex flex-col max-h-[85vh] shadow-2xl transition-all duration-300 ${isPopupOpen ? "translate-y-0" : "translate-y-5"}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 md:p-6 overflow-y-auto">
                        <div className="bg-[#0B1A2C10] rounded-2xl p-4 md:p-8 border border-black/5">
                            <div className="flex justify-between items-start mb-6 border-b border-black/10 pb-6">
                                <div>
                                    <h3 className=" leading-none text-[#0B1A2C] mb-2">{selectedPartner?.name}</h3>
                                    <p className="text-sm font-medium opacity-60 uppercase">{selectedPartner?.role}</p>
                                </div>
                                <div className="w-16 h-8 relative shrink-0">
                                    <Image fill src={selectedPartner?.logo || "/images/homepage/partners/casacarigar.svg"} alt={selectedPartner?.name || "Partner"} className="object-contain" style={{ filter: 'invert(1)' }} />
                                </div>
                            </div>

                            <div className="text-[#0B1A2C] opacity-80 space-y-4 md:text-lg">
                                <p>{selectedPartner?.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Partners;