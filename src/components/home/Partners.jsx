"use client";
import Image from 'next/image';
import React, { useState } from 'react';
const venturesData = Array.from({ length: 5 }).map((_, i) => ({
    id: `venture-${i}`,
    name: "",
    logo: "",
    tags: [],
    founder: "",
    website: "",
    description: ""
}));

const growthPartnersData = Array.from({ length: 18 }).map((_, i) => ({
    id: `growth-${i}`,
    name: "",
    logo: "",
    tags: [],
    founder: "",
    website: "",
    description: ""
}));


const Partners = () => {
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isDescOpen, setIsDescOpen] = useState(false);

    const dummyDetails = {
        name: "UNP",
        tags: ["TECHNOLOGY", "INDAI", "USA"],
        founder: "Robin Charles",
        website: "#",
        desc1: "At its core, UNP is a platform built around people. We believe the strongest businesses are created through trusted relationships, clear thinking, and a shared commitment to long-term success. By bringing together exceptional founders, strategic partners, and growth opportunities, we help create the conditions for meaningful progress.",
        desc2: "More than a network, UNP is a catalyst for collaboration and transformation. We work alongside ambitious leaders to navigate complexity, uncover opportunities, and build stronger foundations for the future. Through strategic guidance, trusted partnerships, and a long-term perspective, we help businesses move forward with greater clarity."
    };

    return (
        <div className="container bg-[#0B1A2C]  text-white font-sans relative h-[200vh]!">

            <div className=" sticky  pt-24 top-0 h-screen ">
                <div className="grid gap-x-20 grid-cols-3">

                    <div className="w-full flex flex-col justify-between col-span-1">
                        <h2 data-para-effect className="leading-none">Ventures Founded</h2>
                        <p data-para-effect className="opacity-60 leading-tight col-span-2 text-lg">Companies built from the <br /> ground up.</p>
                    </div>
                    <div className="w-full col-span-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        {venturesData.map((item,i) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedPartner(item)}
                                className="aspect-square bg-white/5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#253646] transition-colors"
                            >
                               <div className="w-20 h-10 center relative">
                                   <Image fill src={`/images/homepage/partners/ventures/img${i+1}.svg`} alt="" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className=" pt-24 bg-[#0B1A2C] z-10 relative h-screen">
                <div className="grid gap-x-20 grid-cols-3">

                    <div className="w-full col-span-1 flex  flex-col justify-between ">
                        <h2 data-para-effect className="leading-none">Growth Partners</h2>
                        <p data-para-effect className="opacity-60 leading-tight col-span-2 text-lg">Businesses supported <br /> through investment and <br /> strategic growth.</p>
                    </div>
                    <div className="w-full col-span-2  items-start content-start grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {growthPartnersData.map((item,i) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedPartner(item)}
                                className="aspect-4/3 bg-white/5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#253646] transition-colors"
                            >
                               <div className="w-16 h-8 center relative">
                                   <Image fill src={`/images/homepage/partners/ventures/img${(i % 5) + 1}.svg`} alt="" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                className={` ${selectedPartner ? "opacity-100 pointer-events-auto" : " opacity-0 pointer-events-none"} transition-all duration-300 fixed inset-0 z-50 flex items-center justify-center bg-[#0a1118]/80 backdrop-blur-sm p-4 `}
                onClick={() => setSelectedPartner(null)}
            >
                <div
                    className={`bg-white text-black w-full max-w-2xl rounded-3xl overflow-hidden relative flex flex-col max-h-[85vh] shadow-2xl transition-all duration-300 ${selectedPartner ? "translate-y-0" :" translate-y-5"}  `}
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div className="p-6 overflow-y-auto custom-scrollbar">

                        <div className="bg-[#0B1A2C10] rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-[#883F27] rounded-sm transform rotate-45 flex-shrink-0 mt-1"></div>
                                <h3 data-para-effect className="text-4xl font-bold text-[#883F27] tracking-tight">{dummyDetails.name}</h3>
                            </div>

                            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                                <div className="flex flex-wrap gap-2 text-xs font-semibold text-black">
                                    <span className="px-4 py-1.5 border border-black/10 rounded-full flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#883F27]"></div> {dummyDetails.tags[0]}
                                    </span>
                                    <span className="px-4 py-1.5 border border-black/10 rounded-full">{dummyDetails.tags[1]}</span>
                                    <span className="px-4 py-1.5 border border-black/10 rounded-full">{dummyDetails.tags[2]}</span>
                                </div>
                                <a href={dummyDetails.website} className="px-4 py-1.5 pl-3 border-black/10 border rounded-full text-xs font-semibold flex items-center gap-2 hover:bg-[#883F27] hover:text-white transition-colors duration-300 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    WEBSITE
                                </a>
                            </div>

                            <div className="flex flex-wrap text-[#883F27] items-center justify-between border-b border-gray-100  gap-4">
                                <div>
                                    <p className=" text-sm mb-1">Founder</p>
                                    <p className=" font-medium text-lg">{dummyDetails.founder}</p>
                                </div>
                                <div className="flex gap-4">
                                    <a href="#" className="hover:opacity-70 transition-opacity">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    </a>
                                    <a href="#" className="hover:opacity-70 transition-opacity">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div
                                className="flex justify-between items-center pt-5  cursor-pointer group"
                                onClick={() => setIsDescOpen(!isDescOpen)}
                            >
                                <h5 className="">Introducing {dummyDetails.name}</h5>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform duration-300 ${isDescOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            </div>
                            <div className={`grid transition-all duration-300 ease-in-out ${isDescOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className=" text-[#0B1A2C] opacity-70 leading-tight space-y-4  pt-1">
                                        <p>{dummyDetails.desc1}</p>
                                        <p>{dummyDetails.desc2}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
};

export default Partners;