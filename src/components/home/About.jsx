"use client";
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

const About = () => {

    const containerRef = useRef()
    const [currentImg, setCurrentImg] = useState("/images/homepage/about_section/piran_pic_3.png")

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
            stagger: 0.5,
            duration:0.25,
        })
        tl.to(".int_hd", {
            y: -200,
            duration:1
        })
        tl.to(".int_hd", {
            opacity: 0,
            duration:0.5
        })
        tl.to(".piran_img", {
            opacity: 1,
            duration:0.25,
        }, "<")
        tl.to(".intro_txt", {
            opacity: 0,
            duration:0.25,
        }, "<")
        tl.to(".above_img_txt", {
            opacity: 1,
            duration:0.25,
            delay:0.5,
        })
        tl.to([".above_img_txt",".piran_img", ".img_toggle_btns"], {
            opacity: 0,
            duration:0.25,
            delay:0.5,
        })
        tl.to(".abt_txt_1", {
            opacity: 1,
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
            <div ref={containerRef} className="w-full relative h-[350vh] bg-[#0B1A2C]">
                <div className=" sticky_bg sticky top-0 w-full h-screen center flex-col text-center leading-none overflow-hidden">
                    <div className="text-white int_hd">
                        <h2 className=''> <span className=' intro_txt_a intro_txt opacity-0'>Piran</span> <span className='intro_txt opacity-0'>Tarapore</span></h2>
                        <div className="intro_txt opacity-0">
                            <p className='text-lg  opacity-70'>Brand Architect & Strategic Catalyst</p>
                        </div>
                    </div>

                    <div className="w-full h-full absolute top-0 inset-0">
                        <div className=" above_img_txt absolute! container  top-[16%] opacity-0 text-white z-10 ">
                            <h4 className='md:w-[70%] mx-auto'>Piran Tarapore has spent seven years turning founders' ambiguity into brands the world can understand, trust, and want. He is building a practice where brand thinking is infrastructure, not a service layer on top of execution.</h4>
                        </div>
                        <div className="h-[70vh] absolute z-99 aspect-video left-1/2 -translate-x-1/2 bottom-0">
                            <Image fill src={currentImg} className='cover piran_img grayscale-100 opacity-0' alt='Piran Tarapore' />
                            
                            {/* Image Switcher Buttons */}
                            <div className="img_toggle_btns absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center  bg-black/40 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/20 pointer-events-auto cursor-pointer z-99999">
                                <button
                                    onClick={() => setCurrentImg("/images/homepage/about_section/piran_pic.png")}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                        currentImg.includes("piran_pic.png")
                                            ? "bg-white text-[#0B1A2C] shadow-sm"
                                            : "text-white/70 hover:text-white"
                                    }`}
                                >
                                    Img 1
                                </button>
                                <button
                                    onClick={() => setCurrentImg("/images/homepage/about_section/piran_pic_3.png")}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                                        currentImg.includes("piran_pic_3.png")
                                            ? "bg-white text-[#0B1A2C] shadow-sm"
                                            : "text-white/70 hover:text-white"
                                    }`}
                                >
                                    Img 2
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full container absolute! space-y-12 text-white inset-0 h-full center flex-col">
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_1'>In service of that, he founded Point Of, the independent creative consultancy behind 170+ brands across five continents.</h4>
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_2'>Where the alignment runs deep, he invests strategic equity in the brands he builds with, and positions in the businesses he believes in.</h4>
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_3'>Piran is dedicated to the long game work that means something, people who grow together, and things built carefully enough to last.</h4>
                    </div>

                </div>
            </div>
        </>
    )
}

export default About