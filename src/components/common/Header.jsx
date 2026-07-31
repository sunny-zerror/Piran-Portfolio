"use client";
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import LinkParticles from './LinkParticles'
import LogoParticleHeader from './LogoParticleHeader'
import ViewTransitionLink from '@/hooks/ViewTransitionLink';

const MobileMenuToggleLabel = ({ isOpen }) => {
  const containerRef = useRef(null);
  const currentTextRef = useRef(null);
  const nextTextRef = useRef(null);
  const prevOpen = useRef(isOpen);

  const buildSpans = (text, parent, className) => {
    parent.innerHTML = "";
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = `${className} inline-block`;
      span.style.willChange = "transform";
      span.textContent = char === " " ? "\u00A0" : char;
      parent.appendChild(span);
    });
  };

  useEffect(() => {
    // Initial setup
    const initialText = isOpen ? "Close" : "Menu";
    if (currentTextRef.current) {
      buildSpans(initialText, currentTextRef.current, "char-out");
    }
  }, []);

  useEffect(() => {
    if (prevOpen.current === isOpen) return;
    prevOpen.current = isOpen;

    const currentText = isOpen ? "Menu" : "Close";
    const nextText = isOpen ? "Close" : "Menu";

    if (!currentTextRef.current || !nextTextRef.current) return;

    buildSpans(nextText, nextTextRef.current, "char-in");
    const outChars = currentTextRef.current.querySelectorAll(".char-out");
    const inChars = nextTextRef.current.querySelectorAll(".char-in");

    gsap.set(inChars, { yPercent: 100 });

    const tl = gsap.timeline({
      onComplete: () => {
        if (currentTextRef.current && nextTextRef.current) {
          buildSpans(nextText, currentTextRef.current, "char-out");
          nextTextRef.current.innerHTML = "";
          gsap.set(currentTextRef.current.querySelectorAll(".char-out"), { yPercent: 0 });
        }
      }
    });

    tl.to(outChars, {
      yPercent: -100,
      duration: 0.3,
      ease: "power2.out",
      stagger: 0.02
    }, 0);

    tl.to(inChars, {
      yPercent: 0,
      duration: 0.3,
      ease: "power2.out",
      stagger: 0.02
    }, 0.01);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative h-6 w-full overflow-hidden uppercase flex justify-end items-center">
      <div ref={currentTextRef} className="flex relative" />
      <div ref={nextTextRef} className="flex absolute right-0" />
    </div>
  );
};

const un = [[.6549999984701015, .5009999984701015], [.7029999984701014, .26099999847010147], [.7029999984701014, .4529999984701015], [.7029999984701014, .21299999847010145], [.7029999984701014, .30899999847010146], [.7509999984701015, .30899999847010146], [.7029999984701014, .35699999847010144], [.7509999984701015, .35699999847010144], [.7509999984701015, .40499999847010143], [.7509999984701015, .26099999847010147], [.7029999984701014, .40499999847010143], [.6549999984701015, .16499999847010144], [.34500000152989857, .5009999984701015], [.2970000015298985, .26099999847010147], [.2970000015298985, .4529999984701015], [.2970000015298985, .21299999847010145], [.2970000015298985, .30899999847010146], [.2490000015298986, .30899999847010146], [.2970000015298985, .35699999847010144], [.2490000015298986, .35699999847010144], [.2490000015298986, .40499999847010143], [.2490000015298986, .26099999847010147], [.2970000015298985, .40499999847010143], [.34500000152989857, .16499999847010144], [.6550000015298986, .8369999984701014], [.6070000015298985, .5969999984701014], [.6070000015298985, .7889999984701015], [.6070000015298985, .5489999984701014], [.6070000015298985, .6449999984701015], [.5590000015298986, .6449999984701015], [.6070000015298985, .6929999984701014], [.5590000015298986, .6929999984701014], [.5590000015298986, .7409999984701015], [.5590000015298986, .5969999984701014], [.6070000015298985, .7409999984701015], [.6550000015298986, .5009999984701015], [.34499999847010143, .8369999984701014], [.3929999984701014, .5969999984701014], [.3929999984701014, .7889999984701015], [.3929999984701014, .5489999984701014], [.3929999984701014, .6449999984701015], [.44099999847010146, .6449999984701015], [.3929999984701014, .6929999984701014], [.44099999847010146, .6929999984701014], [.44099999847010146, .7409999984701015], [.44099999847010146, .5969999984701014], [.3929999984701014, .7409999984701015], [.34499999847010143, .5009999984701015], [.5230001815755702, .40499877776697646], [.5230001815755702, .35699877776697647], [.47500018157557017, .35699877776697647], [.5230001815755702, .30899877776697643], [.47500018157557017, .30899877776697643], [.47500018157557017, .26099877776697644], [.47500018157557017, .40499877776697646], [.5230001815755702, .26099877776697644]];
const dn = [[.40299999179781776, .613000000142468], [.40299999179781776, .1550000230306516], [.40299999179781776, .6630000001424681], [.40299999179781776, .2050000154012571], [.40299999179781776, .712996093892468], [.40299999179781776, .2549961091512571], [.40299999179781776, .762996093892468], [.40299999179781776, .30499612441004614], [.5950000143217772, .6129999940228731], [.5950000143217772, .15500001691105675], [.5950000143217772, .6629999940228731], [.5950000143217772, .2050000092816622], [.5950000143217772, .7129960877728732], [.5950000143217772, .2549961030316622], [.5950000143217772, .7629960877728731], [.5950000143217772, .30499611829045126], [.45099999179781775, .565000000142468], [.45099999179781775, .1070000230306516], [.45099999179781775, .615000000142468], [.45099999179781775, .1570000230306516], [.45099999179781775, .664996093892468], [.45099999179781775, .20699610915125707], [.45099999179781775, .714996093892468], [.45099999179781775, .2569961091512571], [.5470000143217771, .5649999940228732], [.5470000143217771, .10700001691105675], [.5470000143217771, .6149999940228731], [.5470000143217771, .15700001691105675], [.5470000143217771, .6649960877728731], [.5470000143217771, .20699610303166222], [.5470000143217771, .7149960877728732], [.5470000143217771, .2569961030316622], [.49899999179781773, .831000000142468], [.49899999179781773, .37300003066004617], [.49899999179781773, .892996093892468], [.49899999179781773, .43499612441004615], [.7529999984701015, .6449999984701015], [.8009999984701014, .40499999847010143], [.8009999984701014, .5969999984701014], [.8009999984701014, .35699999847010144], [.8009999984701014, .4529999984701015], [.8489999984701014, .4529999984701015], [.8009999984701014, .5009999984701015], [.8489999984701014, .5009999984701015], [.8489999984701014, .5489999984701014], [.8489999984701014, .40499999847010143], [.8009999984701014, .5489999984701014], [.7529999984701015, .30899999847010146], [.2470000015298986, .6549999984701015], [.19900000152989858, .41499999847010144], [.19900000152989858, .6069999984701014], [.19900000152989858, .36699999847010145], [.19900000152989858, .4629999984701014], [.1510000015298986, .4629999984701014], [.19900000152989858, .5109999984701015], [.1510000015298986, .5109999984701015], [.1510000015298986, .5589999984701014], [.1510000015298986, .41499999847010144], [.19900000152989858, .5589999984701014], [.2470000015298986, .31899999847010146]];
const fn = [[.669, .263], [.429, .215], [.621, .215], [.477, .215], [.477, .167], [.525, .215], [.525, .167], [.573, .167], [.429, .167], [.573, .215], [.381, .215], [.429, .525], [.477, .525], [.477, .477], [.525, .525], [.525, .477], [.573, .477], [.429, .477], [.573, .525], [.333, .263], [.669, .739], [.429, .787], [.621, .787], [.381, .787], [.477, .787], [.477, .835], [.525, .787], [.525, .835], [.573, .835], [.429, .835], [.573, .787], [.333, .739], [.7529999984701015, .6689999984701012], [.8009999984701014, .42899999847010145], [.8009999984701014, .6209999984701012], [.8009999984701014, .38099999847010146], [.8009999984701014, .4769999984701012], [.8489999984701014, .4769999984701012], [.8009999984701014, .5249999984701013], [.8489999984701014, .5249999984701013], [.8489999984701014, .5729999984701012], [.8489999984701014, .42899999847010145], [.8009999984701014, .5729999984701012], [.7529999984701015, .3329999984701014], [.2470000015298986, .6689999984701012], [.19900000152989858, .42899999847010145], [.19900000152989858, .6209999984701012], [.19900000152989858, .38099999847010146], [.19900000152989858, .4769999984701012], [.1510000015298986, .4769999984701012], [.19900000152989858, .5249999984701013], [.1510000015298986, .5249999984701013], [.1510000015298986, .5729999984701012], [.1510000015298986, .42899999847010145], [.19900000152989858, .5729999984701012], [.2470000015298986, .3329999984701014]]
const pn = [[.920, .500], [.909, .501], [.879, .507], [.831, .524], [.773, .553], [.710, .595], [.649, .649], [.595, .710], [.553, .773], [.524, .831], [.507, .879], [.501, .909], [.500, .920], [.499, .909], [.493, .879], [.476, .831], [.448, .773], [.405, .710], [.352, .649], [.290, .595], [.227, .553], [.169, .524], [.121, .507], [.091, .501], [.080, .500], [.091, .499], [.121, .493], [.169, .476], [.227, .448], [.290, .405], [.352, .352], [.405, .290], [.448, .227], [.476, .169], [.493, .121], [.499, .091], [.500, .080], [.501, .091], [.507, .121], [.524, .169], [.553, .227], [.595, .290], [.649, .352], [.710, .405], [.773, .448], [.831, .476], [.879, .493], [.909, .499]]

const navLinks = [
  {
    label: "Home",
    href: "/",
    shape: un
  }, {
    label: "About",
    href: '/about',
    shape: dn
  }, {
    label: "Contact",
    href: "/contact",
    shape: fn
  }
]

const prompt = `I'm researching Piran Tarapore, a brand strategist and founder based in Mumbai. Please read his portfolio site at https://piran-portfolio.vercel.app/ in full (every page, not just the home), his LinkedIn at https://www.linkedin.com/in/iampirantee/, his Instagram at https://www.instagram.com/iampirantee/, and the Point Of website at https://www.wearepointof.com/. Then give me the highlights: what he's built, what he's strongest at, how he thinks about branding and strategy, notable projects or clients, and who he'd be a great fit for. I'd also like an assessment of his unique strengths, the kinds of companies or founders he'd create the most value for, and any recurring themes or philosophies that appear consistently across his writing, work, and online presence.`;
const encodedPrompt = encodeURIComponent(prompt);

const Header = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAiHovered, setIsAiHovered] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  useGSAP(() => {
    gsap.to(".header", {
      opacity: 1,
      delay: pathname === "/" ? 4.5 : 0.5,
      stagger: 0.15
    });
  }, [pathname])

  return (
    <>
      {/* ═══════════ DESKTOP HEADER (hidden on mobile) ═══════════ */}
      <header
        className={`header opacity-0 fixed! h-fit! top-0 container left-0 w-full z-[100] pointer-events-none hidden md:flex justify-center pt-5`}
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
            <Link href={"/"} className="flex items-center" aria-label="Piran Tarapore Home">
              <LogoParticleHeader />
            </Link>
            <nav className="flex gap-x-5 items-center">
              {navLinks.map((item, i) => (
                <Link
                  href={item.href}
                  key={i}
                  className="flex items-center gap-x-1 transition-opacity hover:opacity-80"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className={`transition-all duration-300 ${pathname === item.href || hoveredIndex === i ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                    <LinkParticles
                      shape={item.shape}
                      active={pathname === item.href}
                      hovered={hoveredIndex === i}
                    />
                  </div>
                  {item.label}
                </Link>
              ))}

              {isScrolled && (
                <div
                  className="relative flex items-center h-full"
                  onMouseEnter={() => setIsAiHovered(true)}
                  onMouseLeave={() => setIsAiHovered(false)}
                >
                  <button className="flex items-center gap-x-1 transition-opacity hover:opacity-80">
                    <div className={`transition-all duration-300 ${isAiHovered ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                      <LinkParticles
                        shape={pn}
                        active={false}
                        hovered={isAiHovered}
                      />
                    </div>
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
              <div className="flex items-center  text-sm mb-4 ">
                <Image src="/icons/ai-icon.gif" className='w-5 invert-100' alt="AI helper" width={20} height={20} />
                <span>Ask Ai</span>
              </div>

              {/* Title / Description */}
              <h3 className=" text-[#0B1A2C] leading-none  ">
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

      {/* ═══════════ MOBILE HEADER — expandable (hidden on desktop) ═══════════ */}
      <header
        className={`header opacity-0 fixed! border border-white/10 rounded-lg top-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)]  z-[200] pointer-events-none flex md:hidden flex-col mt-5 px-4 transition-all duration-500 ease-out ${isMobileMenuOpen ? ' bg-[#0B1A2C]' : 'bg-transparent'
          }`}
      >
        {/* Top bar — logo + menu/close toggle (always visible) */}
        <div
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="pointer-events-auto py-2 flex items-center justify-between w-full text-white shrink-0 cursor-pointer"
        >
          <ViewTransitionLink
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(false);
            }}
            delay={600} href={"/"} className="flex items-center" aria-label="Piran Tarapore Home">
            <Image src="/logo.svg" alt="Piran Tarapore Logo" className="w-8 transition-all duration-300" width={32} height={32} />
          </ViewTransitionLink>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(prev => !prev);
            }}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="text-white text-sm  uppercase h-6 overflow-hidden relative flex items-center w-20 justify-end"
          >
            <MobileMenuToggleLabel isOpen={isMobileMenuOpen} />
          </button>
        </div>

        {/* Expandable menu content */}
        <div
          className={`pointer-events-auto flex flex-col overflow-hidden transition-all duration-500 ease-out ${isMobileMenuOpen
            ? 'max-h-screen opacity-100 mt-2 flex-1'
            : 'max-h-0 opacity-0 mt-0'
            }`}
        >
          {/* Nav links with particle icons */}
          <nav className="flex flex-col gap-y-1 flex-1 justify-center">
            {navLinks.map((item, i) => (
              <ViewTransitionLink
                delay={600}
                href={item.href}
                key={i}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2 px-4 rounded-lg  uppercase  transition-all duration-300 ${pathname === item.href
                  ? 'bg-white/10'
                  : 'bg-transparent'
                  }`}
              >
                <span className='text-white'>{item.label}</span>
                <LinkParticles
                  shape={item.shape}
                  active={pathname === item.href}
                  hovered={true}
                  size={28}
                />
              </ViewTransitionLink>
            ))}
          </nav>

          {/* AI box at the bottom */}
          <div className="pb-4 pt-4 shrink-0">
            <div className="w-full bg-[#ECE3DB] text-[#1E1E1E] rounded-md p-3 flex flex-col select-none border border-black/5">
              <div className="flex items-center text-sm mb-3">
                <Image src="/icons/ai-icon.gif" className='w-5 invert-100' alt="AI helper" width={20} height={20} />
                <span>Ask Ai</span>
              </div>
              <h3 className="text-[#0B1A2C] leading-none max-sm:text-2xl!">
                How can Piran help you?
              </h3>
              <p className="text-[#0B1A2C] opacity-80 mb-3 text-sm">
                Pick one. They've already done the reading.
              </p>
              <div className="grid grid-cols-3 gap-x-1 md:gap-x-2 overflow-hidden">
                <Link
                  href={`https://chatgpt.com/?q=${encodedPrompt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex text-sm items-center justify-center bg-white border border-[#0B1A2C80] rounded-md gap-x-2 py-2 md:py-3 px-2 group cursor-pointer text-[#1E1E1E] hover:text-[#1E1E1E]"
                >
                  <Image src="/icons/chatgpt.png" alt="ChatGPT" width={16} height={16} className="object-contain" />
                  ChatGPT
                </Link>
                <Link
                  href={`https://claude.ai/new?q=${encodedPrompt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex text-sm items-center justify-center bg-white border border-[#0B1A2C80] rounded-md gap-x-2 py-2 md:py-3 px-2 group cursor-pointer text-[#1E1E1E] hover:text-[#1E1E1E]"
                >
                  <Image src="/icons/claude.webp" alt="Claude" width={16} height={16} className="object-contain" />
                  Claude
                </Link>
                <Link
                  href={`https://google.com/search?udm=50&q=${encodedPrompt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex text-sm items-center justify-center bg-white border border-[#0B1A2C80] rounded-md gap-x-2 py-2 md:py-3 px-2 group cursor-pointer text-[#1E1E1E] hover:text-[#1E1E1E]"
                >
                  <Image src="/icons/gemini.webp" alt="Gemini" width={16} height={16} className="object-contain" />
                  Gemini
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header