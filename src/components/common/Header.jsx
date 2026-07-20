import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import React from 'react'

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

  useGSAP(() => {
    gsap.to(".header", {
      opacity: 1,
      delay: pathname === "/" ? 3 : 0.5,
      stagger: 0.15
    });
  })
  return (
    <>
      <div className=" header opacity-0 w-full top-0 py-5 h-fit! z-100  text-white fixed">
        <div className="container w-full flex items-center justify-between">
          <Link href={"/"}>
            <img src="/logo.svg" alt="logo" className='max-sm:w-10' />
          </Link>
          <nav className="flex gap-x-5 uppercase">
            {navLinks.map((item, i) => (
              <Link href={item.href} key={i} className="max-sm:text-sm flex items-center gap-x-1 group">
                <div className='size-2 bg-white rounded-full scale-0 group-hover:scale-100 transition-all duration-300'></div>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Header