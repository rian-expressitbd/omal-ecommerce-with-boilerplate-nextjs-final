"use client";

import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { toggleCart } from "@/lib/features/cart/cartSlice";

import Navbar from "@/components/Navbar/Navbar";
import Banner from "@/components/HomePageComponents/Banner";
import CategoryProducts from "@/components/HomePageComponents/CategoryProducts/CategoryProducts";
import Footer from "@/components/Footer/Footer";
import ProductsSection from "@/components/HomePageComponents/ProductsSections";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { isCartOpen } = useSelector((state: RootState) => state.cart);

  return (
    <>
      <Navbar
        isCartOpen={isCartOpen}
        setIsCartOpen={() => dispatch(toggleCart())}
      />
      <Banner />
      <ProductsSection />
      <Banner />
      <CategoryProducts />

      <Toaster />
      <Footer />
    </>
  );
}
