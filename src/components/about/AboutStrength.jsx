"use client";
import Image from 'next/image';
import React, { useState } from 'react'

    const items = [
        {
            id: "strengths",
            title: "Strengths",
            desc: "I know who to call, and they pick up. My taste is in what I leave out. I collect questions faster than answers."
        },
        {
            id: "working",
            title: "Still Working On",
            desc: `I'd rather do twelve takes than trust the first. I find the last ten percent hard to hand over. "Let's figure it out" is my reflex, and "no" still isn't.`
        }
    ];
const AboutStrength = () => {

    const [openItem, setOpenItem] = useState(null);
    
        const toggleItem = (item) => {
            setOpenItem(openItem === item ? null : item);
        };
  return (
    <>
      <div className="w-full py-12 md:py-24 bg-[#0B1A2C] text-white">
                          <div className="container h-fit!">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                                  {/* Left Column: Strengths & Accordion */}
                                  <div className="flex flex-col md:space-y-44 md:max-w-xl">
                                      <div className="space-y-4">
                                          <h2 data-para-effect className="leading-none">
                                              Strengths & Still <br /> Working On
                                          </h2>
                                          <p data-para-effect className="text-white/60 leading-tight">
                                              Building trust requires showing the blueprint, including the stress-points. These are the pillars of the practice and the areas currently undergoing reinforcement.
                                          </p>
                                      </div>
      
                                      {/* Accordion / Toggles */}
                                      <div className="mt-4 md:mt-8 flex flex-col">
                                          {items.map((item) => {
                                              const isOpen = openItem === item.id;
                                              return (
                                                  <div key={item.id} className="border-b border-dashed border-white/20 py-2 md:py-5">
                                                      <button
                                                          onClick={() => toggleItem(item.id)}
                                                          className="w-full flex justify-between items-center text-left py-2 focus:outline-none group cursor-pointer"
                                                      >
                                                          <h5 className="text-white">
                                                              {item.title}
                                                          </h5>
                                                          <h5 className="text-white">
                                                              {isOpen ? "−" : "+"}
                                                          </h5>
                                                      </button>
                                                      <div
                                                          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
                                                              }`}
                                                      >
                                                          <p className=" text-white/70 leading-tight">
                                                              {item.desc}
                                                          </p>
                                                      </div>
                                                  </div>
                                              );
                                          })}
                                      </div>
                                  </div>
      
                                  {/* Right Column: Transparent Cutout exposing sticky city background */}
                                  <div className="flex justify-center md:justify-end">
                                      <div
                                          className="relative w-full max-sm:aspect-square md:w-[80%] aspect-square md:aspect-auto min-h-100 overflow-hidden rounded-xl  flex items-center justify-center pointer-events-none"
                                      >
                                        <Image fill className='cover' src={"/images/aboutpage/piran_pic.png"} alt='Piran Pic' />
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
    </>
  )
}

export default AboutStrength