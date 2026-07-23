"use client";
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import React, { useRef } from 'react'

const About = () => {

    const containerRef = useRef()
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
            }
        })
        tl.to(".intro_txt", {
            opacity: 1,
            stagger: 0.2
        })
        tl.to(".int_hd", {
            y: -50,
            opacity: 0
        })
        tl.to(".piran_img", {
            opacity: 1
        }, "<")
        tl.to(".intro_txt", {
            opacity: 0
        }, "<")
        tl.to(".above_img_txt", {
            opacity: 1
        })
        tl.to([".above_img_txt"], {
            opacity: 0
        })
        tl.to(".piran_img", {
            top: "-100%",
            duration: 1.5,
            ease: "none"
        }, "<")
        tl.to([".about_bg"], {
            transform: "translateY(0)",
            duration: 1.5,
            ease: "none"
        }, "<")
        tl.to(".abt_txt_1", {
            opacity: 1
        }, "<+=0.4")
        tl.to(".abt_txt_2", {
            opacity: 1
        }, "<+=0.4")
        tl.to(".abt_txt_3", {
            opacity: 1
        }, "<+=0.4")
    })

    return (
        <>
            <div ref={containerRef} className="w-full relative h-[300vh] bg-[#0B1A2C]">
                <div className=" sticky_bg sticky top-0 w-full h-screen center flex-col text-center leading-none">
                    <div className="text-white int_hd">
                        <h2 className=''> <span className=' intro_txt_a intro_txt'>Meet</span> <span className='intro_txt opacity-0'> Piran</span></h2>
                        <div className="intro_txt opacity-0">
                            <p className='text-lg  opacity-70'>Brand Architect & Strategic Catalyst</p>
                        </div>
                    </div>

                    <div className="w-full h-full absolute top-0 inset-0">
                        <div className=" above_img_txt absolute! container  top-[16%] opacity-0 text-white z-10 ">
                            <h4 className='md:w-[70%] mx-auto'>I help founders, operators, and investors build businesses with stronger foundations, clearer positioning, and the strategic alignment required for long-term growth.</h4>
                        </div>
                        <Image fill src={"/images/homepage/piran_pic.png"} className='cover piran_img opacity-0' alt='piran pic' />
                    </div>

                    <div className="w-full container absolute! space-y-16 text-white inset-0 h-full center flex-col">
                        <Image fill src={"/images/homepage/about_bg_img.png"} className='cover about_bg translate-y-full ' alt='piran pic' />
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_1'>The Shift Usually Starts Here, Most founders don't come looking for strategy. They come because something feels misaligned. Growth becomes harder. Teams move in different directions. Opportunities appear but don't compound. The business evolves, but the underlying foundations don't evolve with it. The challenge is rarely effort. It's clarity.</h4>
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_2'>For more than two decades, I've worked alongside founders, leadership teams, and investors helping them navigate the moments that determine what a business becomes. Not by adding complexity.</h4>
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_3'>By creating alignment between strategy, execution, capital, and narrative.</h4>
                    </div>

                </div>
            </div>
        </>
    )
}

export default About