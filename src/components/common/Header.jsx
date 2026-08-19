"use client";
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import LinkParticles from './LinkParticles'
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

const prompt = `I'm looking into Piran Tarapore (pirantee.com). Reliable context: Piran is a brand architect and strategic catalyst from Bombay. He founded Point Of, an independent creative consultancy behind 170+ brands across five continents. He works pre-seed to seed, where positioning is the bottleneck; home ground: wellness, healthcare, and financial services. More: linkedin.com/in/iampirantee. Do two things: first, give me a tight brief on who Piran is and how he works, browsing pirantee.com or the LinkedIn only if you need more. Then ask me what I'm building, so you can tell me whether he's the right partner, how to approach him, and what to prepare.`;
const encodedPrompt = encodeURIComponent(prompt);

const Header = () => {
  const pathname = usePathname()
  const headerRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isForcedScrolled, setIsForcedScrolled] = useState(false)
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [isAiHovered, setIsAiHovered] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleAiClick = () => {
    if (isAiOpen) {
      setIsAiOpen(false)
      if (isForcedScrolled) {
        setTimeout(() => {
          setIsForcedScrolled(false)
        }, 500)
      }
    } else {
      if (!isScrolled) {
        setIsForcedScrolled(true)
        setTimeout(() => {
          setIsAiOpen(true)
        }, 500)
      } else {
        setIsAiOpen(true)
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const pillThreshold = window.innerHeight * 0.2 // 20vh for pill shape transform
      setIsAiOpen(false)
      setIsForcedScrolled(false)
      if (currentScrollY > pillThreshold) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        if (isAiOpen) {
          setIsAiOpen(false)
          if (isForcedScrolled) {
            setTimeout(() => {
              setIsForcedScrolled(false)
            }, 500)
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isAiOpen, isForcedScrolled])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  useGSAP(() => {
    let animDelay = 1
    if(pathname==="/") animDelay = 4.5
    if(pathname==="/about") animDelay = 1.5
    gsap.fromTo(".header", 
      { yPercent: -150, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: animDelay,
      }
    );
  }, [pathname])

  return (
    <>
      <header
        className={`header   fixed! h-fit! top-0 container left-0! w-full z-[10000] pointer-events-none hidden md:flex justify-center pt-5`}
      >
        <div
          ref={headerRef}
          className={`px-4 py-2 pl-3 pointer-events-auto flex flex-col border border-white/10 rounded-lg justify-between w-full bg-transparent text-white
            transition-all duration-500 ease-out ${(isScrolled || isForcedScrolled || isAiOpen)
              ? isAiOpen
                ? 'max-w-xl bg-[#0B1A2C]! pb-3'
                : 'max-w-xl bg-[#0B1A2C]!'
              : 'max-w-full bg-transparent'
            }`}
        >
          <div className="flex items-center justify-between w-full">
            <Link href={"/"} className="flex items-center group" aria-label="Piran Tarapore Home">
              <Image src="/logo.svg" alt="logo" className="w-10 transition-all duration-300 group-hover:scale-110" width={40} height={40} />
            </Link>
            <nav className="flex gap-x-5 items-center">
              {navLinks.map((item, i) => (
                <Link
                  href={item.href}
                  key={i}
                  className="flex group items-center gap-x-1"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="transition-all duration-300">
                    <LinkParticles
                      shape={item.shape}
                      active={true}
                      hovered={hoveredIndex === i}
                    />
                  </div>
                  <div className="relative">
                    {item.label}
                    <div
                      className={`absolute bottom-0 left-0 w-full h-px bg-white transition-transform duration-300 rounded-full ${
                        pathname === item.href
                          ? "scale-x-100"
                          : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"
                      }`}
                    ></div>
                  </div>
                </Link>
              ))}

              <div
                className="relative flex items-center h-full"
                onMouseEnter={() => setIsAiHovered(true)}
                onMouseLeave={() => setIsAiHovered(false)}
              >
                <button
                  onClick={handleAiClick}
                  className="flex items-center gap-x-1 border  px-3 rounded-full py-1 bg-[#E3E2DC] text-[#883F27] border-[#883F27] hover:bg-[#883F27] hover:text-[#E3E2DC] transition-all duration-120"
                >
                  <div className="transition-all duration-300">
                    <LinkParticles
                      shape={pn}
                      active={true}
                      hovered={isAiHovered}
                      color={isAiHovered ? "236, 227, 219" : "136, 63, 39"}
                      size={22}
                    />
                  </div>
                  <span>Ask AI</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Dropdown panel appearing on click */}
          <div
            className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${isAiOpen ? 'max-h-72 pt-4 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="w-full bg-[#E3E2DC] text-[#1E1E1E] rounded-md p-3 md:p-5 flex flex-col  select-none border border-black/5">
              {/* Header row */}
              <div className="flex items-center  text-sm mb-4 ">
                <Image src="/icons/ai-icon.gif" className='w-5 invert-100' alt="AI helper" width={20} height={20} />
                <span>Ask AI</span>
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
                  className="flex max-sm:text-sm items-center justify-center bg-white border border-[#0B1A2C80]  rounded-md gap-x-2 py-3 px-2 group cursor-pointer"
                >
                  <Image src="/icons/chatgpt.png" alt="ChatGPT" width={16} height={16} className="object-contain group-hover:scale-150 transition-all duration-300" />
                  ChatGPT
                </Link>

                <Link
                  href={`https://claude.ai/new?q=${encodedPrompt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex max-sm:text-sm items-center justify-center bg-white border border-[#0B1A2C80]  rounded-md gap-x-2 py-3 px-2 group cursor-pointer"
                >
                  <Image src="/icons/claude.webp" alt="Claude" width={16} height={16} className="object-contain group-hover:scale-150 transition-all duration-300" />
                  Claude
                </Link>

                <Link
                  href={`https://google.com/search?udm=50&q=${encodedPrompt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex max-sm:text-sm items-center justify-center bg-white border border-[#0B1A2C80]  rounded-md gap-x-2 py-3 px-2 group cursor-pointer"
                >
                  <Image src="/icons/gemini.webp" alt="Gemini" width={16} height={16} className="object-contain group-hover:scale-150 transition-all duration-300" />
                  Gemini
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ MOBILE HEADER expandable (hidden on desktop) ═══════════ */}
      <header
        className={`header opacity-0 fixed! border border-white/10 rounded-lg top-0 left-1/2 -translate-x-1/2! w-[calc(100%-2rem)]  z-[200] pointer-events-none flex md:hidden flex-col mt-5 px-4 transition-all duration-500 ease-out bg-[#0B1A2C]`}
      >
        {/* Top bar  logo + menu/close toggle (always visible) */}
        <div
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="pointer-events-auto py-2 flex items-center justify-between w-full text-white shrink-0 cursor-pointer"
        >
          <ViewTransitionLink
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(false);
            }}
            delay={600} href={"/"} className="flex items-center group" aria-label="Piran Tarapore Home">
            <Image src="/logo.svg" alt="logo" className="w-8 transition-all duration-300 group-hover:scale-110" width={32} height={32} />
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
      </header>
      <div
        className={` fixed! z-[100] pt-20 container top-0 w-full pointer-events-auto flex flex-col  h-dvh bg-[#0B1A2C] overflow-hidden transition-all duration-500 ${isMobileMenuOpen
          ? 'left-0'
          : 'left-[101%]'
          }`}
      >

        <nav className=" mb-5">
          {navLinks.map((item, i) => (
            <ViewTransitionLink
              delay={600}
              href={item.href}
              key={i}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between py-3 px-4 rounded-lg  uppercase  transition-all duration-300 ${pathname === item.href
                ? 'bg-white/10'
                : 'bg-transparent'
                }`}
            >
              <span className={`text-white text-2xl grotesk`}>
                {item.label}
              </span>
              <LinkParticles
                shape={item.shape}
                active={true}
                hovered={true}
                size={28}
              />
            </ViewTransitionLink>
          ))}
        </nav>

        <div className="pb-4 pt-4 shrink-0">
          <div className="w-full text-white rounded-md border border-white/50 p-5 flex flex-col select-none ">
            <div className="flex items-center text-sm mb-3">
              <Image src="/icons/ai-icon.gif" className='w-5' alt="AI helper" width={20} height={20} />
              <span>Ask AI</span>
            </div>
            <h3 className="text-[#ffffff] leading-none">
              How can Piran help you?
            </h3>
            <p className="text-[#ffffff] opacity-80 mt-2 mb-3">
              Pick one. They've already done the reading.
            </p>
            <div className="grid grid-cols-3 pt-20 gap-x-1 md:gap-x-2 overflow-hidden">
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
        <div className="absolute bottom-10 left-5 text-sm text-white border rounded-full px-4 py-2">
          <button>Mumbai, In</button>
        </div>
      </div>
    </>
  )
}

export default Header