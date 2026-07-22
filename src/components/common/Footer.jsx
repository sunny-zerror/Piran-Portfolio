"use client";
import React from 'react';
import Link from 'next/link';
import { RiArrowRightUpLine, RiArrowUpLine, RiInstagramFill, RiInstallFill, RiLinkedinFill } from '@remixicon/react';
import FooterPhysicsBalls from './FooterPhysicsBalls';
import Image from 'next/image';

const Footer = () => {

  return (
    <div className="w-full h-screen flex flex-col justify-between bg-[#883F27] text-white relative">
      <div className="w-full  relative  flex-1  flex flex-col items-center py-24 text-center overflow-hidden">
        <div className="relative pointer-events-none z-10 flex flex-col items-center gap-y-5">
          <p data-para-effect className="text-sm font-medium opacity-90">Get Started Now</p>
          <h2 data-para-effect className="leading-none">Building Something<br />Worth Lasting?</h2>
          <button className="bg-white text-[#883F27] rounded-full  px-6 hover:pl-2 leading-none h-12 text-sm group   transition-all duration-300 pointer-events-auto flex items-center gap-2">
            <span className="w-2 h-2 center text-white group-hover:h-8 group-hover:w-8 rounded-full bg-[#883F27] transition-all duration-300">
              <RiArrowRightUpLine className={` scale-0 group-hover:scale-100 transition-all duration-300`} />
            </span>
            START A CONVERSATION
          </button>
        </div>
        <FooterPhysicsBalls />
      </div>

      <div className="container h-fit! py-12 pb-5 relative z-10">

        <div className="grid grid-cols-8">

          <div className="col-span-6 space-y-10 ">
            <div className="flex items-center gap-3">
              <Link href={"/"}>
                <Image width={60} height={60} src="/logo.svg" alt="" />
              </Link>
              <p className="text-7xl">Piran Tarapore</p>
            </div>
            <p data-para-effect className="text-lg leading-tight">
              Start Compounding Your Brand Equity<br /> for Long-Term Business Growth.
            </p>
          </div>

          <div className="col-span-2  grid grid-cols-2">
            <div className="flex flex-col gap-2 font-medium">
              <Link href="/" className="hover:opacity-70 transition-opacity">Home</Link>
              <Link href="/about" className="hover:opacity-70 transition-opacity">About</Link>
              <Link href="/contact" className="hover:opacity-70 transition-opacity">Contact</Link>
            </div>
            <div className="flex flex-col gap-2 font-medium">
              <a href="#" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                Instagram
              </a>
              <a href="#" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                Linkedin
              </a>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/20 my-5"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-70">
          <p>© Copy Right 2026 - Piran Tarapore. All Rights Reserved.</p>
          <Link href={"https://www.wearepointof.com"} target='_blank' className='group'>
            <p>Designed & Developed by <span className='group-hover:underline'> Point Of.</span></p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;