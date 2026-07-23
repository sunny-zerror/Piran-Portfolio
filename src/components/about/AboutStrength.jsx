"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const AboutStrength = () => {
  const [openItem, setOpenItem] = useState("strengths");

  const toggleItem = (item) => {
    setOpenItem(openItem === item ? null : item);
  };

  const items = [
    {
      id: "strengths",
      title: "Strengths",
      desc: "I can dismantle a brand's logic to find the single point of failure within 24 hours of audit."
    },
    {
      id: "working",
      title: "Still Working On",
      desc: "Continually refining design systems, exploring new interactive paradigms, and scaling cross-functional capabilities."
    }
  ];

  return (
    <section className="w-full bg-[#0B1A2C] py-24  text-white">
      <div className="container ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          
          {/* Left Column: Strengths & Accordion */}
          <div className="flex flex-col space-y-44 md:max-w-xl">
            <div className="space-y-4">
              <h2 data-para-effect className="leading-none">
                Strengths & Still <br /> Working On
              </h2>
              <p data-para-effect className="text-white/60 leading-tight">
                Building trust requires showing the blueprint, including the stress-points. These are the pillars of the practice and the areas currently undergoing reinforcement.
              </p>
            </div>

            {/* Accordion / Toggles */}
            <div className="mt-8 flex flex-col">
              {items.map((item) => {
                const isOpen = openItem === item.id;
                return (
                  <div key={item.id} className="border-b border-dashed border-white/20 py-5">
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
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
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

          {/* Right Column: Portrait Image */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-[80%] overflow-hidden rounded-xl  border border-white/10 bg-[#162534]">
              <Image
                src="/images/aboutpage/piran_pic.png"
                alt="Piran Portrait"
                fill
                priority
                className="cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutStrength;