"use client";

import Footer from "@/components/Footer/Footer";
import NavbarLower from "@/components/Navbar/NavbarLower";
import { NavbarMiddle } from "@/components/Navbar/NavbarMiddle";
import NavbarUpper from "@/components/Navbar/NavbarUpper";
import { useSidebar } from "@/hooks/useSidebar";
import { navbarRef, sidebarRef } from "@/lib/refs";
import { easeInOut, motion } from "motion/react";
import { useEffect, useState } from "react";

// Animation configuration for consistent transitions
const transitionConfig = {
  type: "tween",
  ease: easeInOut,
  duration: 0.3,
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, isDesktop } = useSidebar();
  const navbarHeight = navbarRef.current?.offsetHeight || 0;
  const sidebarWidth = sidebarRef.current?.offsetWidth || 0;
  const [isSidebarAnimating, setIsSidebarAnimating] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      setIsSidebarAnimating(true);
    }
  }, [isSidebarOpen]);

  const [layoutStyles, setLayoutStyles] = useState({
    navbar: {
      width: "100vw",
      transform: "translateX(0)",
    },
    sidebar: {
      height: "100vh",
      top: "0",
      bottom: "auto",
    },
    content: {
      width: "100vw",
      height: "100svh",
      top: navbarHeight,
      left: 0,
    },
  });

  useEffect(() => {
    const updateLayout = () => {
      if (isDesktop) {
        // On desktop, sidebar is hidden (mobile-only)
        setLayoutStyles({
          navbar: {
            width: "100vw",
            transform: "translateX(0)",
          },
          sidebar: {
            height: "100dvh",
            top: "0",
            bottom: "auto",
          },
          content: {
            width: "100vw",
            height: `calc(100svh - ${navbarHeight}px)`,
            top: navbarHeight,
            left: 0,
          },
        });
      } else {
        // On mobile, sidebar can be toggled
        setLayoutStyles({
          navbar: {
            width: "100vw",
            transform: "translateX(0)",
          },
          sidebar: {
            height: `calc(100dvh - ${navbarHeight}px)`,
            top: "auto",
            bottom: "0",
          },
          content: {
            width: "100vw",
            height: `calc(100svh - ${navbarHeight}px)`,
            top: navbarHeight,
            left: 0,
          },
        });
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
    };
  }, [isSidebarOpen, isDesktop, sidebarWidth, navbarHeight]);

  return (
    <div className='relative min-h-dvh bg-[#EDEBEB] dark:bg-gray-800 overflow-hidden'>
      {/* Mobile-only sidebar */}
      {!isDesktop && (
        <motion.div
          ref={sidebarRef}
          initial={false}
          animate={{
            x: isSidebarOpen ? 0 : "-100%",
          }}
          transition={transitionConfig}
          className='fixed left-0 z-50 bg-transparent'
          style={{
            ...layoutStyles.sidebar,
            willChange: "transform",
          }}
        ></motion.div>
      )}

      {/* Navbar */}
      <motion.div
        ref={navbarRef}
        className='fixed top-0 left-0 right-0 z-50 w-full dark:bg-gray-700 transition-colors duration-300'
        initial={false}
        animate={isSidebarAnimating ? layoutStyles.navbar : false}
        transition={transitionConfig}
        style={{
          ...layoutStyles.navbar,
          willChange: "transform",
        }}
      >
        <NavbarUpper />
        <NavbarMiddle />
        <NavbarLower />
      </motion.div>

      {/* <div className='relative flex flex-col w-svw'> */}
      {/* Content container */}
      <motion.div
        className='absolute w-full p-2 overflow-y-scroll scrollbar-thin'
        initial={false}
        animate={isSidebarAnimating ? layoutStyles.content : false}
        style={{
          ...layoutStyles.content,
          top: navbarHeight,
          willChange: "transform",
        }}
        transition={transitionConfig}
      >
        <div className='w-full'>{children}</div>
        <Footer />
      </motion.div>
      {/* </div> */}
    </div>
  );
}
