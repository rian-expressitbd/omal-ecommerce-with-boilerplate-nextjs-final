"use client";

import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  removeItem,
  toggleCart,
  updateQuantity,
} from "@/lib/features/cart/cartSlice";

import Navbar from "@/components/Navbar/Navbar";
import Banner from "@/components/HomePageComponents/Banner";
import CategoryProducts from "@/components/HomePageComponents/CategoryProducts/CategoryProducts";
import CartDrawer from "@/components/HomePageComponents/CartDrawer";
import Footer from "@/components/Footer/Footer";
import ProductsSection from "@/components/HomePageComponents/ProductsSections";
// ✅ new client component

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: cartItems, isCartOpen } = useSelector(
    (state: RootState) => state.cart
  );

  const handleUpdateCartItem = () => {
    dispatch(updateQuantity());
  };

  const handleRemoveCartItem = () => {
    dispatch(removeItem());
  };

  return (
    <>
      <Navbar
        isCartOpen={isCartOpen}
        setIsCartOpen={(isOpen) => dispatch(toggleCart(isOpen))}
      />
      <Banner />
      <ProductsSection />
      <Banner />
      <CategoryProducts />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => dispatch(toggleCart(false))}
        cartItems={cartItems}
        updateCartItem={handleUpdateCartItem}
        removeCartItem={handleRemoveCartItem}
      />
      <Toaster />
      <Footer />
    </>
  );
}
