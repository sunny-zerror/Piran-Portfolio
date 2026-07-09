"use client";
import React from 'react';
import Link from 'next/link';
import { RiArrowUpLine } from '@remixicon/react';

const Footer = () => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#883F27] text-white py-12">
      <div className="container ">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          {/* Logo & Name */}
          <div className="flex items-center gap-6">
            <img className='w-22' src="/logo.svg" alt="" />
            <p className="text-8xl">Piran Tarapore</p>
          </div>
          
          {/* Move to Top */}
          <button onClick={scrollToTop} className="flex items-center gap-3 text-[15px] font-medium hover:opacity-80 transition-opacity mt-4 md:mt-0">
            Move to Top
            <div className="w-9 h-9 rounded-full bg-white text-[#883F27] flex items-center justify-center">
            <RiArrowUpLine/>
            </div>
          </button>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10">
          {/* Left Text */}
          <div className="max-w-[340px]">
            <p className="text-lg leading-tight">
              Start Compounding Your Brand Equity<br/> for Long-Term Business Growth.
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex gap-20 md:gap-32 text-[15px] md:mr-10">
            <div className="flex flex-col gap-4 font-medium">
              <Link href="/" className="hover:opacity-70 transition-opacity">Home</Link>
              <Link href="/about" className="hover:opacity-70 transition-opacity">About</Link>
              <Link href="/contact" className="hover:opacity-70 transition-opacity">Contact</Link>
            </div>
            <div className="flex flex-col gap-4 font-medium">
              <a href="#" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </a>
              <a href="#" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Linkedin
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/20 mb-5"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-70">
          <p>© Copy Right 2026 - Piran Tarapore. All Rights Reserved.</p>
          <p>Designed & Developed by Point Of.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;