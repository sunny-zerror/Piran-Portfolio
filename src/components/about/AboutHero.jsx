"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, Flip);

const AboutHero = () => {
    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const maskContainerRef = useRef(null);

    useGSAP(() => {
        // Initial entry animation (runs on mount)
        gsap.from(".initial-para", {
            opacity: 0,
            duration: 0.25,
            stagger: 1,
            ease: "power2.out"
        });

        // Initialize timeline with ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        // Phase 1: Fade out non-target text and change background
        tl.to(".fade-text", { opacity: 0, duration: 0.5 })
            .to(stickyRef.current, { backgroundColor: "#ECE3DB", duration: 0.5 }, "<")
            .to(".target-text", { color: "#0B1A2C", duration: 0.5 }, "<");

        // Phase 2: Move targets to final destinations using Flip.fit & Reveal Mask
        const targets = gsap.utils.toArray(".target-text");
        const destinations = gsap.utils.toArray(".final-dest");

        targets.forEach((target, i) => {
            // Flip.fit returns a tween that animates the target exactly over the destination
            const fitTween = Flip.fit(target, destinations[i], {
                duration: 1,
                scale: true,
            });
            tl.add(fitTween, "move"); // Add them at a label "move" so they happen together
        });


        // Phase 3: Mask expands to fill the screen AND text splits open horizontally
        tl.to(maskContainerRef.current, {
            "--mask-size": "5000px", // Expand mask massively to reveal full image
            duration: 2,
            ease: "power2.in"
        }, "expand")
            // Move the left two target texts to the left
            .to([targets[0], targets[1]], {
                x: "-=50vw",
                opacity: 0,
                duration: 1,
                ease: "power1.inOut"
            }, "expand")
            // Move the right two target texts to the right
            .to([targets[2], targets[3]], {
                x: "+=50vw",
                opacity: 0,
                duration: 1,
                ease: "power1.inOut"
            }, "expand");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="h-[500vh] w-full bg-[#0B1A2C]">
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full bg-[#0B1A2C] overflow-hidden flex items-center justify-center"
            >

                {/* The Masked Image Container */}
                <div
                    ref={maskContainerRef}
                    className="absolute inset-0 w-full h-full z-0 pointer-events-none"
                    style={{
                        "--mask-size": "0px",
                        maskImage: "url('/logo_blue.svg')",
                        WebkitMaskImage: "url('/logo_blue.svg')",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                        maskSize: "var(--mask-size)",
                        WebkitMaskSize: "var(--mask-size)",
                    }}
                >
                    {/* Using the provided m3u8 video as the background that gets revealed */}
                    <video
                        src="https://vz-f76b55f9-7b8.b-cdn.net/2b3c385c-35e7-406c-bb11-8c7d71d90001/playlist.m3u8"
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>

                {/* Initial scattered texts (z-10 to stay above mask initially) */}
                <div className="absolute inset-0 w-full h-full p-8 md:p-16  pointer-events-none z-10">

                    <h5 className="initial-para absolute top-[20%] left-[10%] md:left-[20%] max-w-md text-[#EAE9E4]">
                        <span className="fade-text">The strongest brands are rarely built overnight. They begin with </span>
                        <span className="target-text inline-block origin-top-left">a clear</span>
                        <span className="fade-text"> conviction</span>
                    </h5>

                    <h5 className="initial-para absolute top-[45%] right-[5%] md:right-[15%] max-w-md text-[#EAE9E4]">
                        <span className="fade-text">Good strategy isn't about adding more. It's about </span>
                        <span className="target-text inline-block origin-top-left">point of view</span>
                        <span className="fade-text"> that guides every choice.</span>
                    </h5>

                    <h5 className="initial-para absolute bottom-[35%] left-[5%] md:left-[15%] max-w-md text-[#EAE9E4]">
                        <span className="fade-text">Design is simply the visible result of better thinking. It gives </span>
                        <span className="target-text inline-block origin-top-left">that shapes</span>
                        <span className="fade-text"> every interaction.</span>
                    </h5>

                    <h5 className="initial-para absolute bottom-[10%] right-[10%] md:right-[20%] max-w-md text-[#EAE9E4]">
                        <span className="fade-text">When every piece moves together, growth feels natural. The outcome is </span>
                        <span className="target-text inline-block origin-top-left">everything else.</span>
                    </h5>

                </div>

                {/* Final Destination (invisible placeholders used for Flip calculations) */}
                <div className="w-full  max-w-[1200px] flex items-center justify-center opacity-0 pointer-events-none z-10">
                    {/* Left Text */}
                    <div className="flex-1 flex justify-end gap-2 pr-1.5 ">
                        <h3 className="final-dest ">a clear</h3>
                        <h3 className="final-dest ">point of view</h3>
                    </div>

                    {/* Gap exactly in the center for the mask logo to align perfectly */}
                    <div className="w-[0px] h-[0px] flex-shrink-0"></div>

                    {/* Right Text */}
                    <div className="flex-1 flex justify-start gap-2 pl-1.5">
                        <h3 className="final-dest ">that shapes</h3>
                        <h3 className="final-dest ">everything else.</h3>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutHero;