"use client";
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'

const navLinks = [
  {
    label: "Home",
    href: "/"
  }, {
    label: "About",
    href: '/about'
  }, {
    label: "Contact",
    href: "/contact"
  }
]

const prompt = `I'm researching Piran Tarapore, a brand strategist and founder based in Mumbai. Please read his portfolio site at https://piran-portfolio.vercel.app/ in full (every page, not just the home), his LinkedIn at https://www.linkedin.com/in/iampirantee/, his Instagram at https://www.instagram.com/iampirantee/, and the Point Of website at https://www.wearepointof.com/. Then give me the highlights: what he's built, what he's strongest at, how he thinks about branding and strategy, notable projects or clients, and who he'd be a great fit for. I'd also like an assessment of his unique strengths, the kinds of companies or founders he'd create the most value for, and any recurring themes or philosophies that appear consistently across his writing, work, and online presence.`;
const encodedPrompt = encodeURIComponent(prompt);

const Header = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAiHovered, setIsAiHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const pillThreshold = window.innerHeight * 0.2 // 20vh for pill shape transform

      // Floating pill state after 20vh
      if (currentScrollY > pillThreshold) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useGSAP(() => {
    gsap.to(".header", {
      opacity: 1,
      delay: pathname === "/" ? 4.5 : 0.5,
      stagger: 0.15
    });
  }, [pathname])

  return (
    <header
      className={`header opacity-0 fixed! h-fit! top-0 container left-0 w-full z-[100] pointer-events-none flex justify-center pt-5`}
    >
      <div
        className={`px-4 py-2 pl-3 pointer-events-auto flex flex-col border border-white/10 rounded-lg justify-between w-full bg-transparent text-white
          transition-all duration-500 ease-out ${isScrolled
            ? isAiHovered
              ? 'max-w-xl bg-[#0B1A2C]! pb-3'
              : 'max-w-xl bg-[#0B1A2C]!'
            : 'max-w-full bg-transparent'
          }`}
      >
        <div className="flex items-center justify-between w-full">
          <Link href={"/"} className="flex items-center">
            <img src="/logo.svg" alt="logo" className="max-sm:w-8 w-10 transition-all duration-300" />
          </Link>
          <nav className="flex gap-x-5 items-center">
            {navLinks.map((item, i) => (
              <Link href={item.href} key={i} className="flex items-center gap-x-1.5 group transition-opacity hover:opacity-80">
                <div className={` ${pathname === item.href ?"scale-100":"scale-0"} size-1.5 bg-white rounded-full  shrink-0 group-hover:scale-100 transition-all duration-300`}></div>
                {item.label}
              </Link>
            ))}

            {isScrolled && (
              <div
                className="relative flex items-center h-full "
                onMouseEnter={() => setIsAiHovered(true)}
                onMouseLeave={() => setIsAiHovered(false)}
              >
                <button className="flex items-center gap-x-1.5 group transition-opacity hover:opacity-80">
                  <div className={`size-1.5 bg-white rounded-full ${isAiHovered ? "scale-100" : "scale-0"} shrink-0 group-hover:scale-100 transition-all duration-300`}></div>
                  Ask Ai
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Dropdown panel appearing on hover */}
        <div
          className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${isScrolled && isAiHovered ? 'max-h-72 pt-4 opacity-100' : 'max-h-0 opacity-0'
            }`}
          onMouseEnter={() => setIsAiHovered(true)}
          onMouseLeave={() => setIsAiHovered(false)}
        >
          <div className="w-full bg-[#ECE3DB] text-[#1E1E1E] rounded-md p-3 md:p-5 flex flex-col  select-none border border-black/5">
            {/* Header row */}
            <div className="flex items-center gap-x-2 text-sm ">
              <span className='text-xl'>✦</span>
              <span>Ask Ai</span>
            </div>

            {/* Title / Description */}
            <h3 className=" text-[#0B1A2C] leading-none mb-2 ">
              How can Piran help you?
            </h3>
            <p className=" text-[#0B1A2C] opacity-80 mb-4">
              Pick one. They've already done the reading.
            </p>

            {/* Model Selector Buttons */}
            <div className="grid grid-cols-3 gap-x-2 overflow-hidden ">
              <Link
                href={`https://chatgpt.com/?q=${encodedPrompt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex max-sm:text-sm items-center justify-center bg-white border border-[#0B1A2C80] rounded-md gap-x-2 py-3 px-2 group cursor-pointer text-[#1E1E1E] hover:text-[#1E1E1E]"
              >
                <Image src="/icons/chatgpt.png" alt="ChatGPT" width={16} height={16} className="object-contain group-hover:scale-150 transition-all duration-300" />
                ChatGPT
              </Link>

              <Link
                href={`https://claude.ai/new?q=${encodedPrompt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex max-sm:text-sm items-center justify-center bg-white border border-[#0B1A2C80] rounded-md gap-x-2 py-3 px-2 group cursor-pointer text-[#1E1E1E] hover:text-[#1E1E1E]"
              >
                <Image src="/icons/claude.webp" alt="Claude" width={16} height={16} className="object-contain group-hover:scale-150 transition-all duration-300" />
                Claude
              </Link>

              <Link
                href={`https://google.com/search?udm=50&q=${encodedPrompt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex max-sm:text-sm items-center justify-center bg-white border border-[#0B1A2C80] rounded-md gap-x-2 py-3 px-2 group cursor-pointer text-[#1E1E1E] hover:text-[#1E1E1E]"
              >
                <Image src="/icons/gemini.webp" alt="Gemini" width={16} height={16} className="object-contain group-hover:scale-150 transition-all duration-300" />
                Gemini
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header