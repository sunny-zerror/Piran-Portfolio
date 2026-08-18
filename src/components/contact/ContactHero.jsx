"use client";
import React, { useState } from 'react';
import { RiMailLine, RiPhoneLine, RiLinkedinFill, RiInstagramLine, RiInstagramFill, RiArrowRightUpLine, RiArrowDownSLine } from '@remixicon/react';
import Link from 'next/link';
import SuccessPopup from './SuccessPopup';

const ContactHero = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        email: '',
        message: '',
        about: 'Strategic Equity'
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
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

    return (
        <section className="w-full pt-44 pb-24">
            <div className="container ">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-8 border-b border-dashed border-[#0B1A2C30] pb-5">
                    <h1 className="leading-none text-[#0B1A2C] tracking-tight m-0 p-0">
                        Let's Talk
                    </h1>
                    <p className="text-[#0B1A2C] opacity-70 max-w-[22rem] md:text-right pb-3">
                        Whatever brings you here, I read everything myself, and you'll hear back within two days.
                    </p>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-5 pt-16">

                    {/* Left: Contact Info */}
                    <div className="flex flex-col col-span-2 justify-between h-full">
                        <div className="space-y-8">
                            <a href="mailto:piran@wearepointof.com" className="flex group items-center gap-5 w-fit text-[#0B1A2C]">
                                <div className="w-12 h-12 rounded-full border border-dashed border-[#0B1A2C30] flex items-center group-hover:bg-[#883F27] group-hover:text-white transition-all duration-300 justify-center text-[#883F27]">
                                    <RiMailLine size={20} />
                                </div>
                                <span className="text-2xl group-hover:underline cursor-pointer">piran@wearepointof.com </span>
                            </a>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-16 md:mt-0">
                            <Link href="#" className="flex items-center gap-2 bg-white px-6 py-3 pl-4 leading-none rounded-full text-[#0B1A2C] hover:bg-[#883F27] hover:text-white transition-all duration-300 group">
                                <RiLinkedinFill className="size-4 text-[#883F27] group-hover:text-white transition-colors" />
                                <span className="text-sm font-medium">Linkedin</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-2 bg-white px-6 py-3 pl-4 leading-none rounded-full text-[#0B1A2C] hover:bg-[#883F27] hover:text-white transition-all duration-300 group">
                                <RiInstagramFill className="size-4 text-[#883F27] group-hover:text-white transition-colors" />
                                <span className="text-sm font-medium">Instagram</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Natural Language Form */}
                    <div className="bg-white col-span-3  p-8 md:p-12 max-sm:mt-10 rounded-xl">
                        <form onSubmit={handleSubmit} className="text-2xl text-[#0B1A2C]">
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
                                            className={`w-full border-b ${errors.name ? 'border-red-500 text-red-500' : 'border-[#0B1A2C15] focus:border-[#883F27]'} bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 transition-colors`}
                                        />
                                        {errors.name && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">This one I need.</span>}
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
                                            className={`w-full border-b ${errors.location ? 'border-red-500 text-red-500' : 'border-[#0B1A2C15] focus:border-[#883F27]'} bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 transition-colors`}
                                        />
                                        {errors.location && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">This one I need.</span>}
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
                                            className={`w-full border-b ${errors.email ? 'border-red-500 text-red-500' : 'border-[#0B1A2C15] focus:border-[#883F27]'} bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 transition-colors`}
                                        />
                                        {errors.email === 'empty' && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">This one I need.</span>}
                                        {errors.email === 'invalid' && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-red-500 whitespace-nowrap">That address doesn't look reachable.</span>}
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
                                            className="w-full border-b border-[#0B1A2C15] bg-transparent outline-none  text-center placeholder:text-base placeholder:opacity-40 focus:border-[#883F27] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-6 mt-10">
                                    <span className="whitespace-nowrap">This is about:</span>
                                    <div className="relative flex-1 min-w-50">
                                        <div 
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full border-b border-[#0B1A2C15] hover:border-[#883F27] bg-transparent outline-none  text-center transition-colors cursor-pointer"
                                        >
                                            {formData.about}
                                            <RiArrowDownSLine className={`size-5 absolute right-2 top-1/2 -translate-y-1/2 ${isDropdownOpen ? "rotate-180":"rotate-0"} transition-all duration-300`}/>
                                        </div>
                                        
                                        {isDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-[#0B1A2C15] rounded-xl shadow-lg z-20 overflow-hidden flex flex-col text-lg md:text-xl">
                                                    {['Strategic Equity', 'Press', 'Meet & Greet'].map(option => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, about: option });
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className={`px-4 py-3 text-center hover:bg-[#883F27] hover:text-white transition-colors ${formData.about === option ? 'bg-[#EAE9E4]/50 font-bold' : ''}`}
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
                                    <div className="mt-8 text-red-500 text-sm">
                                        Submit failure: Something broke on my side, not yours. Try once more.
                                    </div>
                                )}

                                <button disabled={status === 'submitting'}
                                    type="submit" className=" uppercase mt-10 bg-[#883F27] text-[#ffffff] rounded-full  px-6 hover:pl-1 leading-none h-10 text-sm group   transition-all duration-300 pointer-events-auto flex items-center gap-2">
                                    <span className="w-2 h-2 center text-[#883F27] group-hover:h-8 group-hover:w-8 rounded-full bg-[#ffffff] transition-all duration-300">
                                        <RiArrowRightUpLine size={18} className={` scale-0 group-hover:scale-100 transition-all duration-300`} />
                                    </span>
                                    {status === 'submitting' ? 'SENDING...' : "Let's figure it out"}
                                </button>
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
