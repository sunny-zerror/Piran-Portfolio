"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RiArrowRightUpLine } from '@remixicon/react';

gsap.registerPlugin(ScrollTrigger);

const Build3 = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    cardsRef.current = [];

    const addToRefs = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                }
            });

            const totalCards = cardsRef.current.length;
            const gapX = window.innerWidth < 768 ? 80 : 150;
            const gapY = window.innerWidth < 768 ? -20 : -45;

            tl.from(".main_crd",{
                y:1000,
                ease:"none"
            })

            // Add a label so all cards fan out simultaneously AFTER coming up
            tl.add("fanOut");

            cardsRef.current.forEach((card, i) => {
                const reverseIndex = (totalCards - 1) - i;
                const centerOffset = 2;
                tl.to(card, {
                    x: (reverseIndex - centerOffset) * gapX,
                    y: (reverseIndex - centerOffset) * gapY,
                    rotationZ: 0,
                    rotationY: 0,
                    rotationX: 0,
                    scale: 1,
                    clipPath: "polygon(0% 0%, 100% 20%, 100% 100%, 0% 80%)",  // All cards get the slanted parallelogram shape
                    filter: "drop-shadow(-10px 15px 15px rgba(0,0,0,0.5))"
                }, "fanOut"); // Using the label here!
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const images = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", // White sphere/abstract
        "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=600&auto=format&fit=crop", // Dark pink/abstract
        "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop", // Greenish/abstract
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop", // Purple spheres
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop", // Front bottle (placeholder)
    ];

    return (
        <div ref={containerRef} className="w-full bg-[#0B1A2C] text-white font-sans relative h-[250vh]">
            <div className="w-full sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">

                {/* Center Content Group */}
                <div className="relative w-full h-full flex flex-col items-center justify-center">

                    {/* The Cards Stack */}
                    <div className=" main_crd relative w-[20rem]  aspect-3/4 z-10">
                        {images.map((src, index) => (
                            <div
                                key={index}
                                ref={addToRefs}
                                className="absolute inset-0 overflow-hidden  will-change-transform"
                                style={{ zIndex: index * 10, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }} 
                            >
                                <img
                                    src={src}
                                    alt={`Card ${5 - index}`}
                                    className="cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Text Overlay (Z-index higher than cards) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 ">
                        <h2 className="text-center leading-none">
                            Currently Building<br />Fintech Infrastructure
                        </h2>

                        {/* Positioned relatively down to sit near the bottom of the card */}
                        <div className="mt-8 md:mt-12">
                            <button className="bg-white uppercase text-[#883F27] rounded-full  px-6 hover:pl-2 leading-none h-12 text-sm group   transition-all duration-300 flex items-center gap-2">
                                <span className="w-2 h-2 center text-white group-hover:h-8 group-hover:w-8 rounded-full bg-[#883F27] transition-all duration-300">
                                    <RiArrowRightUpLine className={` scale-0 group-hover:scale-100 transition-all duration-300`} />
                                </span>
                                My path
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Text Elements */}
                <h5 className="absolute bottom-10 left-6 md:left-12  uppercase z-50  leading-tight">
                    INTO BUILD3,<br />BUILDING AGAIN
                </h5>
                <h5 className="absolute bottom-10 right-6 md:right-12 leading-tight z-50">
                    2026
                </h5>

            </div>
        </div>
    );
};

export default Build3;