"use client";
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

const Header = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const pillThreshold = window.innerHeight * 0.2 // 20vh for pill shape transform
      const hideThreshold = window.innerHeight * 0.5 // 50vh for headroom hide

      // Floating pill state after 20vh
      if (currentScrollY > pillThreshold) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Headroom logic: Hide when scrolling down past 50vh, show when scrolling up
      if (currentScrollY > hideThreshold && currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 5) {
        setIsVisible(false) // Scrolling down past 50vh -> hide
      } else if (currentScrollY < lastScrollY.current || currentScrollY <= hideThreshold) {
        setIsVisible(true) // Scrolling up or above 50vh -> show
      }

      lastScrollY.current = currentScrollY
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
      className={`header opacity-0 fixed top-0 left-0 w-full z-[100] transition-transform duration-500 pointer-events-none flex justify-center ${
        isScrolled ? 'pt-4' : 'pt-5'
      } ${
        isScrolled && !isVisible ? '-translate-y-full ' : 'translate-y-0'
      }`}
    >
      <div
        className={`pointer-events-auto transition-all duration-500 ease-out flex items-center border border-transparent justify-between ${
          isScrolled
            ? 'w-[90%] max-w-lg px-4 py-2 pl-3 rounded-lg bg-[#0B1A2C]  border-white/10 text-white'
            : 'container w-full py-2 bg-transparent text-white'
        }`}
      >
        <Link href={"/"} className="flex items-center">
          <img src="/logo.svg" alt="logo" className="max-sm:w-8 w-10 transition-all duration-300" />
        </Link>
        <nav className="flex gap-x-5 uppercase text-xs md:text-sm">
          {navLinks.map((item, i) => (
            <Link href={item.href} key={i} className="flex items-center gap-x-1.5 group transition-opacity hover:opacity-80">
              <div className="size-1.5 bg-white rounded-full scale-0 shrink-0 group-hover:scale-100 transition-all duration-300"></div>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header