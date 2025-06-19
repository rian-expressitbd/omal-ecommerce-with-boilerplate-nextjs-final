"use client";
import { navbarRef } from "@/lib/refs";
import Link from "next/link";
import Logo from "../ui/atoms/logo";
import { CartSheet } from "../ui/organisms/cart-sheet";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { MobileMenu } from "../MobileMenu/MobileMenu";
import { RiShoppingBag3Fill } from "react-icons/ri";

export interface NavbarProps {
  className?: string;
}

export const NavbarMiddle = ({ className }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        ref={navbarRef}
        className={`${className} mx-auto w-full  p-3 py-3 sm:py-4 md:py-5 flex bg-white dark:bg-gray-700 z-50 justify-between items-center transition-all duration-200`}
      >
        <div className='flex gap-2 sm:gap-3 items-center dark:text-white'>
          <Link href={"/"}>
            <Logo />
          </Link>
        </div>
        <div className='flex items-center'>
          <input
            placeholder='Search Products...'
            type='text'
            className='p-3 border hidden md:block w-[375px]'
          />
          <button className='text-white bg-[#7E22CE] p-3 hidden md:block'>
            Search
          </button>
        </div>
        <div className='flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4'>
          <Link href='/products'>
            <div className='flex items-center gap-2'>
              <h3 className='text-md'>Shop</h3>
              <RiShoppingBag3Fill size={25} className='text-[#7E22CE]' />
            </div>
          </Link>
          <CartSheet />
          <GiHamburgerMenu
            size={20}
            className='block lg:hidden cursor-pointer'
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};
