"use client";

import { Toaster } from "react-hot-toast";

import Navbar from "@/components/Navbar/Navbar";
import Banner from "@/components/HomePageComponents/Banner";
import Footer from "@/components/Footer/Footer";
import ProductsSection from "@/components/HomePageComponents/ProductsSections";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <ProductsSection />
      <Banner />
      {/* <CategoryProducts /> */}

      <Toaster />
      <Footer />
    </>
  );
}
