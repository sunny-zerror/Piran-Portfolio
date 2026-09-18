"use client";
import React, { useRef } from 'react';
import CustomButton from '../common/CustomButton';
import ThesisOverlay from './ThesisOverlay';
import { useThesisStore } from '@/store/useThesisStore';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Thesis = () => {
    const { openThesis } = useThesisStore();
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        // Desktop / Laptop only (min-width: 1024px)
        mm.add("(min-width: 1024px)", () => {
            gsap.fromTo(
                imgRef.current,
                { y: -200 },
                {
                    y: 200,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                }
            );
        });
    }, { scope: containerRef });

    return (
        <>
            <div ref={containerRef} className="w-full h-screen md:h-auto md:aspect-square  overflow-hidden relative">
                <div ref={imgRef} className="w-full h-full relative">
                    <Image fill src="/images/homepage/partners/full_img.webp" className='cover' alt="Thesis background" />
                </div>

                <div className="absolute! z-99 h-fit! top-12 md:top-[10%] text-white container">
                    <h2 data-para-effect className="">
                        Nobody stays. <br /> I stay.
                    </h2>
                </div>

                <div className="absolute! z-99 h-fit! bottom-12 md:bottom-[10%] space-y-10 md:max-w-xl! right-0 text-white container">
                    <div className="space-y-4 opacity-70 leading-tight text-xl">
                        <p data-para-effect>
                            Consultants leave after the recommendation. Agencies leave after the deliverable. Investors show up for board meetings.
                        </p>
                        <p data-para-effect>
                            Nobody stays. I stay. I come in before the institutions do, usually pre-seed to seed, where positioning is the bottleneck rather than the product.
                        </p>
                        <p data-para-effect>
                            Home ground: wellness, healthcare, and financial services. The ask is simple and documented: strategic equity, agreed before the work begins.
                        </p>
                    </div>

                    <CustomButton icon='add' onClick={openThesis} className='w-fit'>
                        Read the full thesis
                    </CustomButton>
                </div>
            </div>
            <ThesisOverlay />
        </>
    );
};

export default Thesis;
