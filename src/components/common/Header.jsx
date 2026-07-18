import { Link } from 'next-view-transitions'
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
  return (
    <div>
      <div className=" header opacity-0 w-full top-0 py-5 h-fit! z-100  text-white fixed">
        <div className="container w-full flex items-center justify-between">

        <img src="/logo.svg" alt="logo" className='max-sm:w-10' />
        <div className="flex gap-x-5 uppercase">
          {navLinks.map((item, i) => (
            <Link href={item.href} key={i} className="max-sm:text-sm">
              {item.label}
            </Link>
          ))}
        </div>
          </div>
      </div>
    </div>
  )
}

export default Header