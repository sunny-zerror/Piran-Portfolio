"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, Flip);

const AboutHero = () => {
    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const maskContainerRef = useRef(null);
    const [scrollLocked, setScrollLocked] = React.useState(true);

    // Lenis scroll locking effect
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            setScrollLocked(false);
            return;
        }

        if (scrollLocked) {
            if (window.lenis) {
                window.lenis.stop();
            } else {
                document.body.style.overflow = "hidden";
            }
        } else {
            if (window.lenis) {
                window.lenis.start();
            } else {
                document.body.style.overflow = "";
            }
        }

        return () => {
            if (window.lenis) window.lenis.start();
            document.body.style.overflow = "";
        };
    }, [scrollLocked]);

    useGSAP(() => {
        const isMobile = window.innerWidth < 768;

        // Initial entry animation (runs on mount)
        gsap.from(".initial-para", {
            opacity: 0,
            duration: 0.25,
            stagger: 0.6,
            ease: "power2.out",
            onComplete: () => {
                if (!isMobile) {
                    setScrollLocked(false);

                    // Initialize desktop timeline with ScrollTrigger
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 1,
                        }
                    });

                    tl.to(".fade-text", { opacity: 0, duration: 0.5 });

                    const targets = gsap.utils.toArray(".target-text");
                    const destinations = gsap.utils.toArray(".final-dest");

                    targets.forEach((target, i) => {
                        const fitTween = Flip.fit(target, destinations[i], {
                            duration: 1,
                            scale: true,
                        });
                        tl.add(fitTween, "move");
                    });

                    tl.to(maskContainerRef.current, {
                        "--mask-size": "5000px",
                        duration: 2,
                        ease: "power2.in"
                    }, "expand")
                        .to([targets[0], targets[1]], {
                            x: "-=50vw",
                            opacity: 0,
                            duration: 2.5,
                            ease: "power1.inOut"
                        }, "expand")
                        .to([targets[2], targets[3]], {
                            x: "+=50vw",
                            opacity: 0,
                            duration: 2.5,
                            ease: "power1.inOut"
                        }, "expand");
                } else {
                    // Mobile-only: One-time automated timeline play on mount without scrub
                    const mobileTl = gsap.timeline();

                    mobileTl.to(".fade-text", { opacity: 0, duration: 0.8, delay: 0.5 });

                    const targets = gsap.utils.toArray(".target-text");
                    const destinations = gsap.utils.toArray(".final-dest");

                    targets.forEach((target, i) => {
                        const fitTween = Flip.fit(target, destinations[i], {
                            duration: 1.2,
                            scale: true,
                            ease: "power2.inOut"
                        });
                        mobileTl.add(fitTween, "move");
                    });

                    mobileTl.to(maskContainerRef.current, {
                        "--mask-size": "5000px",
                        duration: 2,
                        ease: "power2.inOut"
                    }, "expand")
                        .to([targets[0], targets[1]], {
                            x: "-=50vw",
                            opacity: 0,
                            duration: 2,
                            ease: "power1.inOut"
                        }, "expand")
                        .to([targets[2], targets[3]], {
                            x: "+=50vw",
                            opacity: 0,
                            duration: 2,
                            ease: "power1.inOut"
                        }, "expand");
                }
            }
        });

    }, { scope: containerRef });

    const handleSkip = () => {
        if (!containerRef.current) return;
        const containerBottom = containerRef.current.offsetTop + containerRef.current.offsetHeight;
        
        if (window.lenis) {
            window.lenis.scrollTo(containerBottom, { duration: 1.2 });
        } else {
            window.scrollTo({
                top: containerBottom,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div ref={containerRef} className="h-[100vh] md:h-[400vh] w-full bg-[#0B1A2C] relative">
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full bg-[#0B1A2C] overflow-hidden flex items-center justify-center"
            >

                {/* The Masked Image Container */}
                <div
                    ref={maskContainerRef}
                    className="absolute inset-0 w-full h-full z-20 pointer-events-none"
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
                <div className="absolute flex flex-col justify-center gap-y-10 inset-0 w-full h-full p-6 md:p-16  pointer-events-none z-10">

                    <p className=" text-2xl initial-para leading-tight md:absolute top-[20%] left-[10%] md:left-[20%] max-w-md text-[#EAE9E4]">
                        <span className="fade-text">The strongest brands are rarely built overnight. They begin with </span>
                        <span className="target-text inline-block origin-top-left">a clear</span>
                        <span className="fade-text"> conviction</span>
                    </p>

                    <p className=" text-2xl initial-para leading-tight md:absolute top-[45%] right-[5%] md:right-[15%] max-w-md text-[#EAE9E4]">
                        <span className="fade-text">Good strategy isn't about adding more. It's about </span>
                        <span className="target-text inline-block origin-top-left">point of view</span>
                        <span className="fade-text"> that guides every choice.</span>
                    </p>

                    <p className=" text-2xl initial-para leading-tight md:absolute bottom-[35%] left-[5%] md:left-[15%] max-w-md text-[#EAE9E4]">
                        <span className="fade-text">Design is simply the visible result of better thinking. It gives </span>
                        <span className="target-text inline-block origin-top-left">that shapes</span>
                        <span className="fade-text"> every interaction.</span>
                    </p>

                    <p className=" text-2xl initial-para leading-tight md:absolute bottom-[10%] right-[10%] md:right-[20%] max-w-md text-[#EAE9E4]">
                        <span className="fade-text">When every piece moves together, growth feels natural. The outcome is </span>
                        <span className="target-text inline-block origin-top-left">everything else.</span>
                    </p>

                </div>

                {/* Final Destination (invisible placeholders used for Flip calculations) */}
                <div className="w-full whitespace-nowrap  flex items-center justify-center opacity-0 pointer-events-none z-10">
                    {/* Left Text */}
                    <div className="flex-1 flex justify-end gap-2 pr-1.5 ">
                        <p className="final-dest  text-sm md:text-4xl ">a clear</p>
                        <p className="final-dest  text-sm md:text-4xl ">point of view</p>
                    </div>

                    {/* Gap exactly in the center for the mask logo to align perfectly */}
                    <div className="w-[0px] h-[0px] flex-shrink-0"></div>

                    {/* Right Text */}
                    <div className="flex-1 flex justify-start gap-2 pl-1.5">
                        <p className="final-dest  text-sm md:text-4xl ">that shapes</p>
                        <p className="final-dest  text-sm md:text-4xl ">everything else.</p>
                    </div>
                </div>

                {/* Mobile Only Skip Button */}
                <button
                    onClick={handleSkip}
                    className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 uppercase border rounded-full px-4 py-2 leading-none  text-white text-xs "
                >
                    Skip
                </button>

            </div>
        </div>
    );
};

export default AboutHero;