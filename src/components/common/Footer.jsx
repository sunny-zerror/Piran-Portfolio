"use client";
import React from 'react';
import Link from 'next/link';
import { RiArrowRightUpLine, RiArrowUpLine, RiInstagramFill, RiInstallFill, RiLinkedinFill } from '@remixicon/react';
import FooterPhysicsBalls from './FooterPhysicsBalls';
import Image from 'next/image';
import { RotatingText } from './RotatingText';

const Footer = () => {

  return (
    <div className="w-full h-screen flex flex-col justify-between bg-[#883F27] text-white relative z-[100000]">
      <div className="w-full  relative  flex-1  flex flex-col items-center  py-12 md:py-24 text-center overflow-hidden">
        <div className="relative pointer-events-none z-10 flex flex-col items-center gap-y-4 md:gap-y-5">
          <p data-para-effect className="text-sm font-medium opacity-90">Whenever you're ready</p>
          <h2 data-para-effect className="leading-none">Things that matter <br /> should begin. </h2>
          <button className="bg-white uppercase text-[#883F27] rounded-full  px-6 hover:pl-1 leading-none h-10 text-sm group   transition-all duration-300 pointer-events-auto flex items-center gap-2">
            <span className="w-2 h-2 center text-white group-hover:h-8 group-hover:w-8 rounded-full bg-[#883F27] transition-all duration-300">
              <RiArrowRightUpLine size={18} className={` scale-0 group-hover:scale-100 transition-all duration-300`} />
            </span>
            Begin
          </button>
        </div>
        <FooterPhysicsBalls />
      </div>

      <div className="container h-fit! py-6 md:py-12 pb-2 md:pb-5 relative z-10 space-y-6 md:space-y-6">
        <div className="flex flex-col md:grid md:grid-cols-8 gap-y-6 md:gap-y-0">
          <div className="col-span-8 md:col-span-6 md:space-y-6">
            <RotatingText />
            <div className="flex items-center gap-3">
              <Link href={"/"} aria-label="Piran Tarapore Home">
                <Image className="w-14 h-14 shrink-0 md:w-15 md:h-15" width={60} height={60} src="/logo.svg" alt="Piran Tarapore Logo" />
              </Link>
              <p className="text-[12vw] whitespace-nowrap md:text-7xl">Piran Tarapore</p>
            </div>

            <p className="text-lg leading-tight opacity-90 max-w-xs md:max-w-none">
              Some things compound quietly.
            </p>
          </div>

          <div className="col-span-8 md:col-span-2 grid grid-cols-2 gap-4 text-sm md:text-base mt-2 md:mt-0">
            <div className=" flex md:justify-end">
              <div className="flex flex-col gap-2 font-medium">
                <Link href="/" className="group flex items-center gap-1"> <div className="size-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div> Home</Link>
                <Link href="/about" className="group flex items-center gap-1"> <div className="size-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div> About</Link>
                <Link href="/contact" className="group flex items-center gap-1"> <div className="size-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div> Contact</Link>
              </div>
            </div>
            <div className=" flex md:justify-end">
              <div className="flex flex-col gap-2 font-medium">
                <a href="#" className="flex items-center gap-1 group"> <div className="size-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div>
                  Instagram
                </a>
                <a href="#" className="flex items-center gap-1 group "> <div className="size-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full"></div>
                  Linkedin
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/20 my-2 md:my-5"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm">
          <p className='opacity-70'>© Piran Tarapore, {new Date().getFullYear()}. All rights reserved.</p>
          <Link href={"https://www.wearepointof.com"} target='_blank' className='group opacity-70 hover:opacity-100 transition-opacity duration-150'>
            <p>An experience by  <span className='group-hover:underline'> Point Of.</span></p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;