"use client";
import React, { useRef, useState } from 'react';
import { RiMailLine, RiPhoneLine, RiLinkedinFill, RiInstagramLine, RiInstagramFill, RiArrowRightUpLine, RiArrowDownSLine } from '@remixicon/react';
import Link from 'next/link';
import SuccessPopup from './SuccessPopup';
import CustomButton from '../common/CustomButton';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ContactHero = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        email: '',
        message: '',
        about: 'Strategic Equity'
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = true;
        if (!formData.location.trim()) newErrors.location = true;
        if (!formData.email.trim()) {
            newErrors.email = 'empty';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'invalid';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setStatus('submitting');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.2 });
        tl.from(".hero-anim-fade-up", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
        });

        let mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            gsap.to(contentRef.current, {
                scrollTrigger: {
                    trigger: ".faq_paren",
                    start: "top bottom",
                    end: "top top",
                    scrub: true,
                },
                filter: "blur(4px)",
            });
        });
    });

    return (
        <section ref={heroRef} className="w-full md:h-screen pb-12 md:pb-24 flex items-end bg-[#0B1A2C] md:fixed top-0 z-0">
            <div ref={contentRef} className="container h-fit!">
                <div className="flex max-sm:pt-[30vh] flex-col md:flex-row justify-between md:items-end gap-8 border-b border-dashed border-[#ffffff30] pb-5">
                    <h1 className="hero-anim-fade-up leading-none text-[#ffffff] tracking-tight m-0 p-0">
                        Let's Talk
                    </h1>
                    <p className="hero-anim-fade-up text-[#ffffff] opacity-70 max-w-[22rem] md:text-right pb-3">
                        Whatever brings you here, I read everything myself, and you'll hear back within two days.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 pt-8 md:pt-16">
                    <div className="hero-anim-fade-up flex flex-col col-span-2 justify-between h-full max-sm:space-y-4">
                        <div className="space-y-8">
                            <a href="mailto:piran@wearepointof.com" className="flex group items-center gap-3 w-fit text-[#ffffff]">
                                <div className="w-10 h-10 rounded-full border border-dashed border-[#ffffff30] flex items-center group-hover:bg-[#ffffff] group-hover:text-[#0B1A2C] transition-all duration-300 justify-center text-[#ffffff]">
                                    <RiMailLine className='size-4' />
                                </div>
                                <div className="text-2xl relative  cursor-pointer">piran@wearepointof.com
                                    <div
                                        className={`absolute bottom-0 left-0 w-full h-px bg-[#ffffff] transition-transform duration-300 rounded-full 
                      scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left`}
                                    ></div>
                                </div>
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link target="_blank" href="https://in.linkedin.com/in/iampirantee" aria-label="LinkedIn Profile" className="w-10 h-10 rounded-full border border-dashed border-[#ffffff30] flex items-center hover:bg-[#ffffff] hover:text-[#0B1A2C] transition-all duration-300 justify-center text-[#ffffff]">
                                <RiLinkedinFill className="size-4 " />
                            </Link>
                            <Link target="_blank" href="https://www.instagram.com/iampirantee/" aria-label="Instagram Profile" className="w-10 h-10 rounded-full border border-dashed border-[#ffffff30] flex items-center hover:bg-[#ffffff] hover:text-[#0B1A2C] transition-all duration-300 justify-center text-[#ffffff]">
                                <RiInstagramFill className="size-4 " />
                            </Link>
                        </div>
                    </div>
                    <div className="hero-anim-fade-up col-span-3  max-sm:mt-20 rounded-xl">
                        <form onSubmit={handleSubmit} className="text-2xl text-[#ffffff]">
                            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-6">
                                <span className="whitespace-nowrap">My name is</span>
                                <div className="relative flex-1 min-w-50">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                            if (errors.name) setErrors({ ...errors, name: false });
                                        }}
                                        placeholder="( your name ) *"
                                        className={`w-full border-b ${errors.name ? 'border-white text-white' : 'border-[#ffffff15] focus:border-[#ffffff]'} bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 transition-colors`}
                                    />
                                    {errors.name && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap">This one I need.</span>}
                                </div>
                                <span className="whitespace-nowrap">from</span>
                                <div className="relative flex-1 min-w-62.5">
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => {
                                            setFormData({ ...formData, location: e.target.value });
                                            if (errors.location) setErrors({ ...errors, location: false });
                                        }}
                                        placeholder="( your company or city ) *"
                                        className={`w-full border-b ${errors.location ? 'border-white text-white' : 'border-[#ffffff15] focus:border-[#ffffff]'} bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 transition-colors`}
                                    />
                                    {errors.location && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap">This one I need.</span>}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-6 mt-10">
                                <span className="whitespace-nowrap">You can reach me at</span>
                                <div className="relative flex-1 min-w-62.5">
                                    <input
                                        type="text"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (errors.email) setErrors({ ...errors, email: false });
                                        }}
                                        placeholder="( your@email.com ) *"
                                        className={`w-full border-b ${errors.email ? 'border-white text-white' : 'border-[#ffffff15] focus:border-[#ffffff]'} bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 transition-colors`}
                                    />
                                    {errors.email === 'empty' && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap">This one I need.</span>}
                                    {errors.email === 'invalid' && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap">That address doesn't look reachable.</span>}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-6 mt-10">
                                <span className="whitespace-nowrap">In short, I'm here to</span>
                                <div className="relative flex-1 min-w-75">
                                    <input
                                        type="text"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="( start the right conversation )"
                                        className="w-full border-b border-[#ffffff15] bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 focus:border-[#ffffff] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-6 mt-10">
                                <span className="whitespace-nowrap">This is about:</span>
                                <div className="relative flex-1 min-w-50">
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full border-b border-[#ffffff15] hover:border-[#ffffff] bg-transparent outline-none  text-center transition-colors cursor-pointer"
                                    >
                                        {formData.about}
                                        <RiArrowDownSLine className={`size-5 absolute right-2 top-1/2 -translate-y-1/2 ${isDropdownOpen ? "rotate-180" : "rotate-0"} transition-all duration-300`} />
                                    </div>

                                    {isDropdownOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-[#ffffff15] rounded-xl shadow-lg z-20 overflow-hidden flex flex-col text-lg md:text-xl">
                                                {['Strategic Equity', 'Press', 'Meet & Greet'].map(option => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, about: option });
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`px-4 py-3 text-center text-[#0B1A2C] hover:bg-[#0B1A2C] border-t border-[#0B1A2C50]  hover:text-white transition-colors ${formData.about === option ? 'bg-[#0B1A2C] text-white' : ''}`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="mt-8 text-white text-sm">
                                    Submit failure: Something broke on my side, not yours. Try once more.
                                </div>
                            )}

                            <CustomButton disabled={status === 'submitting'} type="submit" theme="light" className="mt-10">
                                {status === 'submitting' ? 'SENDING...' : "Let's figure it out"}
                            </CustomButton>
                        </form>
                    </div>
                </div>
            </div>

            <SuccessPopup
                isOpen={status === 'success'}
                onClose={() => {
                    setStatus('idle');
                    setFormData({ name: '', location: '', email: '', message: '', about: 'Strategic Equity' });
                }}
            />
        </section>
    );
};

export default ContactHero;
