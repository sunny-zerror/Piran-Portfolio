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
            stagger: 0.5,
            duration:0.25,
        })
        tl.to(".int_hd", {
            y: -25,
            opacity: 0,
            duration:0.25,
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
        tl.to([".above_img_txt",".piran_img"], {
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
                <div className=" sticky_bg sticky top-0 w-full h-screen center flex-col text-center leading-none">
                    <div className="text-white int_hd">
                        <h2 className=''> <span className=' intro_txt_a intro_txt opacity-0'>Piran</span> <span className='intro_txt opacity-0'>Tarapore</span></h2>
                        <div className="intro_txt opacity-0">
                            <p className='text-lg  opacity-70'>Brand Architect & Strategic Catalyst</p>
                        </div>
                    </div>

                    <div className="w-full h-full absolute top-0 inset-0">
                        <div className=" above_img_txt absolute! container  top-[16%] opacity-0 text-white z-10 ">
                            <h4 className='md:w-[70%] mx-auto'>I've spent seven years turning founders' ambiguity into brands the world can understand, trust, and want. He is building a practice where brand thinking is infrastructure, not a service layer on top of execution.</h4>
                        </div>
                        <Image fill src={"/images/homepage/piran_pic.png"} className='cover piran_img opacity-0' alt='piran pic' />
                    </div>

                    <div className="w-full container absolute! space-y-12 text-white inset-0 h-full center flex-col">
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_1'>In service of that, he founded Point Of, the independent creative consultancy behind 170+ brands across five continents.</h4>
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_2'>Where the alignment runs deep, he invests: strategic equity in the brands he builds with, and positions in the businesses he believes in.</h4>
                        <h4 className=' md:w-[70%] mx-auto z-10 opacity-0 abt_txt_3'>Piran is dedicated to the long game: work that means something, people who grow together, and things built carefully enough to last.</h4>
                    </div>

                </div>
            </div>
        </>
    )
}

export default About