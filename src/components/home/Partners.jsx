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
        { id: 'i3', name: 'Samara Capital', role: 'Limited Partner', desc: 'An India-focused investment firm that has deployed over 1.5 billion dollars since 2007. Samara Capital backs operators who transform fragmented businesses into scalable enterprises, across healthcare, insurance, and retail.', logo: '/images/homepage/partners/samara.png' }
    ]
};

const Partners = () => {
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isThesisOpen, setIsThesisOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const activeIndexRef = useRef(0);
    const cardsRefs = useRef([[], [], [], []]);

    useEffect(() => {
        if (isPopupOpen || isThesisOpen) {
            if (window.lenis) window.lenis.stop();
        } else {
            if (window.lenis) window.lenis.start();
        }
        return () => {
            if (window.lenis) window.lenis.start();
        };
    }, [isPopupOpen, isThesisOpen]);

    useGSAP(() => {

        gsap.to(".bottom_bar", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true
            },
            width: "100%",
            ease: "none"
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
                            className="bg-[#152535] p-8 md:p-12 rounded-lg w-full flex flex-col justify-between"
                            style={{ flexBasis: '100%' }}
                        >
                            <div className="inner-content flex flex-col justify-between h-full w-full">
                                <div>
                                    <h3 className="text-2xl font-medium mb-6 text-white">How I Choose</h3>
                                    <p className="opacity-80 text-lg  text-white">
                                        Consultants leave after the recommendation. Agencies leave after the deliverable. Investors show up for board meetings. Nobody stays. I stay. I come in before the institutions do, usually pre-seed to seed, where positioning is the bottleneck rather than the product. Home ground: wellness, healthcare, and financial services. The ask is simple and documented: strategic equity, agreed before the work begins.
                                    </p>
                                </div>
                                <div className="mt-8 border-t border-white/10 pt-6">
                                    <button
                                        onClick={() => setIsThesisOpen(true)}
                                        className="bg-white uppercase  text-[#883F27] rounded-full  px-6 hover:pl-1 leading-none h-10 text-sm group   transition-all duration-300 pointer-events-auto flex items-center gap-2">
                                        <span className="w-2 h-2 center text-white group-hover:h-8 group-hover:w-8 rounded-full bg-[#883F27] transition-all duration-300">
                                            <RiArrowRightUpLine size={18} className={` scale-0 group-hover:scale-100 transition-all duration-300`} />
                                        </span>
                                        Read Full Thesis
                                    </button>
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
                                <button className='p-1.5 bg-white/10 rounded-full group-hover:bg-white group-hover:text-[#0B1A2C] transition-all duration-300 '><RiArrowRightUpLine className='size-4' /></button>
                            </div>
                            <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                                <div className="w-44 h-20 center relative">
                                    <Image fill src={item.logo} alt="" className="object-contain invert-100" />
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

                <div className="bottom_bar absolute h-1 bg-white w-0 left-0 bottom-1 rounded-full"></div>

                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[40%] z-10 flex flex-col justify-center">
                    <div className="relative w-[80%] h-40">
                        <div className="title-section title-section-0 w-full absolute inset-0 flex flex-col justify-center">
                            <h2>Founded</h2>
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
                                <h2 className="leading-none m-0 p-0">Founder</h2>
                            </div>
                            <p className="opacity-60 leading-tight text-lg mt-2">A company of my own is underway a wellness and nutraceutical brand, in stealth. After years of building for founders, it was time. The name arrives only when it's ready.</p>
                        </div>
                    </div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[60%] h-[50vh] flex items-center">
                    <div className="relative w-full h-full">
                        {renderAllCardSections()}
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="block md:hidden py-12 space-y-16">
                {/* Mobile Founded */}
                <div className="space-y-6">
                    <div>
                        <h2>Founded</h2>
                        <p className="opacity-60 leading-tight mt-2">Companies built from the ground up, and the ones still being built.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {newPartnersData.founded.map((item) => (
                            <div key={item.id} onClick={() => setSelectedPartner(item)} className="flex relative items-center justify-center w-full aspect-6/5 bg-white/5 rounded-md cursor-pointer active:bg-[#253646] transition-colors border border-white/10 shrink-0">
                                <div className="w-full absolute bottom-0 flex items-end justify-between p-2 leading-none">
                                    <p className='text-sm uppercase w-[80%]'>{item.name}</p>
                                    <button className='p-1 bg-white/10 rounded-full group-hover:bg-white group-hover:text-[#0B1A2C] transition-all duration-300 '><RiArrowRightUpLine className='size-4' /></button>
                                </div>
                                <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-10 center relative">
                                        <Image fill src={item.logo} alt="" className="object-contain invert-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Backed */}
                <div className="space-y-6">
                    <div>
                        <h2>Backed </h2>
                        <p className="opacity-60 leading-tight mt-2">Brands where the thinking earned ownership and the engagement never really ends.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {newPartnersData.backed.map((item) => (
                            <div key={item.id} onClick={() => setSelectedPartner(item)} className="flex relative items-center justify-center w-full aspect-6/5 bg-white/5 rounded-md cursor-pointer active:bg-[#253646] transition-colors border border-white/10 shrink-0">
                                <div className="w-full absolute bottom-0 flex items-end justify-between p-2 leading-none">
                                    <p className='text-sm uppercase w-[80%]'>{item.name}</p>
                                    <button className='p-1 bg-white/10 rounded-full group-hover:bg-white group-hover:text-[#0B1A2C] transition-all duration-300 '><RiArrowRightUpLine className='size-4' /></button>
                                </div>
                                <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-10 center relative">
                                        <Image fill src={item.logo} alt="" className="object-contain invert-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Invested */}
                <div className="space-y-6">
                    <div>
                        <h2>Invested </h2>
                        <p className="opacity-60 leading-tight mt-2">Private positions taken early and held with patience, in businesses playing long games.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {newPartnersData.invested.map((item) => (
                            <div key={item.id} onClick={() => setSelectedPartner(item)} className="flex relative items-center justify-center w-full aspect-6/5 bg-white/5 rounded-md cursor-pointer active:bg-[#253646] transition-colors border border-white/10 shrink-0">
                                <div className="w-full absolute bottom-0 flex items-end justify-between p-2 leading-none">
                                    <p className='text-sm uppercase w-[80%]'>{item.name}</p>
                                    <button className='p-1 bg-white/10 rounded-full group-hover:bg-white group-hover:text-[#0B1A2C] transition-all duration-300 '><RiArrowRightUpLine className='size-4' /></button>
                                </div>
                                <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-10 center relative">
                                        <Image fill src={item.logo} alt="" className="object-contain invert-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile NOW */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="leading-none m-0 p-0">Founder</h2>
                        </div>
                        <p className="opacity-60 leading-tight mt-2">A company of my own is underway a wellness and nutraceutical brand, in stealth. After years of building for founders, it was time. The name arrives only when it's ready.</p>
                    </div>

                    <div className="bg-[#152535] p-5 rounded-lg  w-full flex flex-col justify-between">
                        <div>
                            <h3 className=" mb-4 text-white">How I Choose</h3>
                            <p className="opacity-80  text-white">
                                Consultants leave after the recommendation. Agencies leave after the deliverable. Investors show up for board meetings. Nobody stays. I stay. I come in before the institutions do, usually pre-seed to seed, where positioning is the bottleneck rather than the product. Home ground: wellness, healthcare, and financial services. The ask is simple and documented: strategic equity, agreed before the work begins.
                            </p>
                        </div>
                        <div className="mt-6 border-t border-white/10 pt-4">
                            <button
                                onClick={() => setIsThesisOpen(true)}
                                className="bg-white uppercase  text-[#883F27] rounded-full  px-6 hover:pl-1 leading-none h-10 text-sm group   transition-all duration-300 pointer-events-auto flex items-center gap-2">
                                <span className="w-2 h-2 center text-white group-hover:h-8 group-hover:w-8 rounded-full bg-[#883F27] transition-all duration-300">
                                    <RiArrowRightUpLine size={18} className={` scale-0 group-hover:scale-100 transition-all duration-300`} />
                                </span>
                                Read Full Thesis
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup Overlay for selected partner */}
            <div
                className={`${isPopupOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all duration-300 fixed inset-0 z-50 flex items-center justify-center bg-[#0a1118]/80 backdrop-blur-sm p-4`}
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
                                    <h3 className="text-2xl font-bold tracking-tight text-[#0B1A2C] mb-2">{selectedPartner?.name}</h3>
                                    <p className="text-sm font-medium opacity-60 uppercase">{selectedPartner?.role}</p>
                                </div>
                                <div className="w-16 h-8 relative shrink-0">
                                    <Image fill src={selectedPartner?.logo || '/images/homepage/partners/ventures/img1.svg'} alt="" className="object-contain" style={{ filter: 'invert(1)' }} />
                                </div>
                            </div>

                            <div className="text-[#0B1A2C] opacity-80 space-y-4 text-lg">
                                <p>{selectedPartner?.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thesis Overlay */}
            <div
                className={`${isThesisOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all duration-500 fixed inset-0 z-[1000000] bg-[#0B1A2C] text-white overflow-y-auto scroller_none`}
            >
                <div data-lenis-prevent className="mx-auto  max-w-4xl py-12 relative">
                    <button
                        onClick={() => setIsThesisOpen(false)}
                        className="fixed top-6 right-6 md:top-12 md:right-12 w-12 h-12 bg-white/10 hover:bg-white hover:text-[#0B1A2C] rounded-full flex items-center justify-center transition-all duration-300 z-50"
                        aria-label="Close Thesis"
                    >
                        <RiCloseLine size={24} />
                    </button>

                    <div className="space-y-12 ">
                        <div>
                            <h4 className=" mb-2">The Thesis</h4>
                            <p className="opacity-80 text-lg ">Most early-stage founders don't fail because the product was wrong or the money ran out. They fail because clarity was missing in the year it mattered most. The pre-institutional phase is where decisions compound fastest: positioning, narrative, market understanding, direction. Everything downstream inherits that clarity or its absence.</p>
                            <p className="opacity-80 text-lg mt-6 ">The support around founders is fragmented by design. Consultants optimise for the recommendation, agencies for the asset, capital for the board seat. Each exits before the hardest part: the pivots, the repositioning, the translation of strategy into something real. No one holds the full picture, and no one stays. That gap is the practice.</p>
                        </div>

                        <div>
                            <h4 className=" mb-2">Where I Work</h4>
                            <p className="opacity-80 text-lg ">Home ground: wellness, healthcare, and financial services. That is where the conviction has clustered, in equity earned through the work and in positions taken early. What I bring into these markets is the brand lens: the early bottleneck is rarely the science or the licence, it is positioning, narrative, and direction. That is the bottleneck I unlock.</p>
                            <p className="opacity-80 text-lg mt-6 ">I come in early: pre-revenue or early revenue, before institutional capital, while the strategic decisions still compound. Selectively, the work reaches beyond the home ground, into consumer and craft-led businesses where positioning carries the same weight. If positioning isn't the problem, I'm not the answer.</p>
                        </div>

                        <div>
                            <h4 className=" mb-2">How I Choose</h4>
                            <p className="opacity-80 text-lg ">A handful of founders at a time, never more. The formal read covers strategic intent, decision-making, execution and ownership, equity alignment, and time horizon. The informal read decides more: how a founder treats people with nothing to offer them, whether they arrive prepared, how they respond to challenge, what their follow-through looks like between meetings.</p>
                            <p className="opacity-80 text-lg mt-6 ">What has to be true: the founder has fire. They're coachable without being dependent. The problem is real and they've been inside it, testing and adapting, not theorising. And there's a clear leverage point for the thinking. What makes me walk away: misalignment in values or commitment, founders who want capital without partnership, and resistance to what the market is plainly saying.</p>
                        </div>

                        <div>
                            <h4 className=" mb-2">The Ask</h4>
                            <p className="opacity-80 text-lg ">Strategic equity is the default and the anchor. I earn it by creating value, not by deploying capital. Structures are agreed upfront and tied to clear dependencies: milestones delivered, scope fulfilled, value unlocked. Shares vest when the agreed condition is met.</p>
                            <p className="opacity-80 text-lg mt-6 ">Capital itself is rare. It follows conviction built through an engagement that's already proving itself, and when it happens it's structured simply and accompanies a relationship that's been tested. My upside is the founder's upside. I don't extract. I earn.</p>
                        </div>

                        <div>
                            <h4 className=" mb-2">How I Work</h4>
                            <p className="opacity-80 text-lg ">It starts with a conversation that isn't a pitch but a read, on both sides. If there's mutual interest, a structured questionnaire follows, and after that the deeper conversations: scope, involvement, equity, milestones, cadence. Nothing is implied, everything is agreed, and a signed agreement comes before any work and any doors open. Typically seven or more meetings before commitment is discussed seriously.</p>
                            <p className="opacity-80 text-lg mt-6 ">The engagement then moves through three phases. Intensive: close rhythm, the foundational decisions, the phase where value concentrates. Building: partners step in, Point Of and vetted specialists, while I hold the strategic layer. Steady: reports and open availability, a sounding board and a door-opener as the company grows. Partners are introduced transparently, and the founder always chooses. Through every phase, I'm a message away.</p>
                        </div>

                        <div>
                            <h4 className=" mb-2">What I Don't Do</h4>
                            <p className="opacity-80 text-lg ">No passive involvement: if I'm in, I'm embedded. No template-first work: playbooks are starting points, never the deliverable. No operational takeover: the founder leads the business. No engagements where clarity isn't the bottleneck. And no capital without conviction that's been earned in the room. The boundaries protect every engagement and the model itself. Restraint is structural, not posturing.</p>
                        </div>

                        <div className="pt-12 border-t border-white/10">
                            <p className="opacity-80 text-lg  mb-8">If you're building something that deserves this kind of attention, the door is one form away.</p>
                            <Link href={"/contact"} 
                                // onClick={() => setIsThesisOpen(false)}
                             className="bg-white uppercase w-fit  text-[#883F27] rounded-full  px-6 hover:pl-1 leading-none h-10 text-sm group   transition-all duration-300 pointer-events-auto flex items-center gap-2">
                                <span className="w-2 h-2 center text-white group-hover:h-8 group-hover:w-8 rounded-full bg-[#883F27] transition-all duration-300">
                                    <RiArrowRightUpLine size={18} className={` scale-0 group-hover:scale-100 transition-all duration-300`} />
                                </span>
                                Begin
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Partners;