"use client";

import { useTransitionRouter } from "next-view-transitions";

export default function ViewTransitionLink({
  href,
  delay = 0,
  onClick,
  className,
  children,
}) {
  const router = useTransitionRouter();

  const handleClick = (e) => {
    e.preventDefault();
    onClick?.();
    setTimeout(() => {
      router.push(href);
    }, delay);
  };


  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
