"use client";
import React from 'react';
import { Link } from 'next-view-transitions';
import { RiArrowRightUpLine } from '@remixicon/react';

const CustomButton = ({ 
  children, 
  href, 
  onClick, 
  type = "button",
  className = "", 
  disabled = false,
  theme = "light" // "light" or "dark"
}) => {
  const isLight = theme === "light";
  
  const btnThemeClass = isLight ? "bg-white text-[#883F27]" : "bg-[#883F27] text-[#ffffff]";
  const dotThemeClass = isLight ? "text-white bg-[#883F27]" : "text-[#883F27] bg-[#ffffff]";

  const content = (
    <>
      <span className={`w-2 h-2 flex items-center justify-center ${dotThemeClass} group-hover:h-8 group-hover:w-8 rounded-full transition-all duration-300`}>
        <RiArrowRightUpLine size={18} className={`scale-0 group-hover:scale-100 transition-all duration-300`} />
      </span>
      {children}
    </>
  );

  const baseClasses = `uppercase rounded-full px-6 hover:pl-1 leading-none h-10 text-sm group transition-all duration-300 pointer-events-auto flex items-center gap-2 ${btnThemeClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClasses}>
      {content}
    </button>
  );
};

export default CustomButton;
