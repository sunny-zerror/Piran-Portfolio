"use client"

import { usePathname } from "next/navigation"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

const GlobalParaReveal = () => {
  const pathname = usePathname()

  useGSAP(() => {

    const splits = []

    const ctx = gsap.context(async () => {

      await document.fonts.ready

      const elements = gsap.utils.toArray("[data-para-effect]")

      elements.forEach((el) => {

        if (el.dataset.splitInitialized) return

        el.dataset.splitInitialized = "true"

        const split = new SplitText(el, {
          type: "lines",
          linesClass: "split-line",
        })

        splits.push(split)

        split.lines.forEach((line) => {

          const wrapper = document.createElement("div")

          wrapper.style.overflow = "hidden"

          line.parentNode.insertBefore(wrapper, line)

          wrapper.appendChild(line)
        })

        gsap.set(split.lines, {
          yPercent: 100,
          rotateX: -80,
          transformOrigin: "center top",
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        })

        gsap.to(split.lines, {
          yPercent: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",

          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      })

    })

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 500)

    return () => {

      clearTimeout(timeout)

      splits.forEach((split) => split.revert())

      document
        .querySelectorAll("[data-para-effect]")
        .forEach((el) => {
          delete el.dataset.splitInitialized
        })

      ctx.revert()
    }

  }, [pathname])

  return null
}

export default GlobalParaReveal