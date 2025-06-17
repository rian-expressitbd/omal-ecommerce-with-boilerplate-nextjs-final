"use client";
import { notificationsData } from "@/config/notification.config";
import { navbarRef } from "@/lib/refs";
import Link from "next/link";
import Logo from "../ui/atoms/logo";
import { CartSheet } from "../ui/organisms/cart-sheet";
import NotificationsDropdown from "../ui/molecules/notification-btn";
import ThemeToggler from "../ui/molecules/themeToggler";

export interface NavbarProps {
  className?: string;
}

export const NavbarMiddle = ({ className }: NavbarProps) => {
  return (
    <header
      ref={navbarRef}
      className={`${className} p-3 sm:p-4 md:p-5 flex bg-white dark:bg-gray-700 z-50 justify-between items-center transition-all duration-200`}
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
          name=''
          id=''
          className='p-3  border hidden md:block w-[375px]'
        />
        <button className='text-white bg-[#7E22CE] p-3 hidden md:block'>
          Search
        </button>
      </div>
      <div className='flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4'>
        {/* <Button
          title='Cart Button'
          className='p-2 rounded-full bg-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-500 cursor-pointer transition-colors text-primary dark:text-white'
          onClick={() => {
            console.log("Cart Clicked");
          }}
        >
          <Icon icon={TbShoppingCart} size={18} className='sm:size-5' />
        </Button> */}
        <CartSheet />

        <NotificationsDropdown notifications={notificationsData} />
        <ThemeToggler />
      </div>
    </header>
  );
};
