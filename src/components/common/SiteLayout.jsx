"use client";

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LenisScroll from "@/components/common/LenisScroll";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useGSAP } from '@gsap/react';
import { ViewTransitions } from "next-view-transitions";
import GlobalParaReveal from "../animation/GlobalParaReveal";

gsap.registerPlugin(ScrollTrigger);

export default function SiteLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  useGSAP(() => {
    window.scrollTo(0, 0);

    if (window.lenis) {
      window.lenis.scrollTo(0, {
        immediate: true,
        force: true,
      });
    }

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();

      if (window.lenis) {
        window.lenis.resize();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <ViewTransitions>
      <LenisScroll>

        <GlobalParaReveal />

        <header>
          <Header />
        </header>

        <main>
          {children}
        </main>

        {pathname !== '/contact' && (
          <footer>
            <Footer />
          </footer>
        )}
      </LenisScroll>
    </ViewTransitions>

  );
}
