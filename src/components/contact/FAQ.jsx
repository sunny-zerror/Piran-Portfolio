"use client";
import React, { useState } from 'react';

const faqs = [
    {
        question: "What exactly do you help founders with?",
        answer: "Clarity first: positioning, direction, and the narrative that holds it together. Then execution through Point Of and its brand partners, and for the right founders, backing. The order matters."
    },
    {
        question: "Who do you typically work with?",
        answer: "Founders early in the journey. The equity work leans brand-led; the investments sit in wellness, healthcare, and financial services. A handful at a time, never more."
    },
    {
        question: "Is this coaching, consulting, or advisory work?",
        answer: "None of those, quite. I work embedded: weekly at the start, steady state for the long arc, usually structured around strategic equity. The relationship is the model."
    },
    {
        question: "What outcomes can I expect?",
        answer: "Positioning that's clear and defensible. A narrative that holds with customers, investors, and your own team. Materials ready for scrutiny before scrutiny arrives. And a partner still there after it ships."
    },
    {
        question: "How do engagements typically work?",
        answer: "A first conversation, then a structured questionnaire, then alignment on scope, involvement, equity, and milestones. Deliberate, not slow."
    },
    {
        question: "Do you work with early-stage startups?",
        answer: "That's where I do my best work: early enough that the foundations are still wet, when clarity is cheapest and worth most."
    },
    {
        question: "Do you invest capital?",
        answer: "Rarely, and only where conviction runs deep. The anchor is strategic equity earned through the work; capital, when it happens, follows it."
    },
    {
        question: "What don't you do?",
        answer: "Templates, takeovers, passive cheques, and quick flips. If speed at any cost is the plan, we're not aligned."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null); // Set second item open by default to match screenshot, or just null. Let's do 1.

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className=" faq_paren w-full py-12 md:py-24 md:relative z-10 bg-[#E3E2DC]">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-5 ">
                    
                    {/* Left: Title */}
                    <div className='col-span-2'>
                        <h2 className="leading-tight text-[#0B1A2C] sticky top-32 m-0">
                            Frequently Asked<br/>Questions
                        </h2>
                    </div>

                    {/* Right: Accordion */}
                    <div className=" col-span-3 max-sm:mt-5 flex flex-col space-y-2">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div 
                                    key={index} 
                                    className={` group border border-dashed border-[#0B1A2C30] transition-colors duration-300 ${isOpen ? 'bg-[#ffffff]' : 'bg-transparent'}`}
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex justify-between items-center text-left px-6 py-6  focus:outline-none group cursor-pointer"
                                    >
                                        <h5 className={`m-0 leading-tight transition-colors duration-300 ${isOpen ? 'text-[#883F27]' : 'text-[#0B1A2C]'}`}>
                                            {index + 1}. {faq.question}
                                        </h5>
                                        <div className={`w-6 h-6 text-[#883F27] rounded-full border border-[#0B1A2C30] flex items-center justify-center shrink-0 ${isOpen && "bg-[#883F27] text-white"} group-hover:bg-[#883F27] group-hover:text-white transition-all duration-300`}>
                                            <span className={`  transition-transform  duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                {isOpen ? '−' : '+'}
                                            </span>
                                        </div>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out px-6  ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="text-[#0B1A2C] opacity-70 w-[80%] pb-6">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FAQ;
