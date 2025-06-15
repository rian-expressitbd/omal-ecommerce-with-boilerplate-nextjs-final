"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";


import CommonLayout from "@/app/layouts/CommonLayout";

import { Toaster, toast } from "react-hot-toast";
import { Order } from "@/types/cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppDispatch, RootState } from "@/lib/store";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { clearCart, toggleCart } from "@/lib/features/cart/cartSlice";

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isCartOpen, items } = useSelector((state: RootState) => state.cart);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryArea: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart items and verify data
  useEffect(() => {
    setIsLoading(false); // Set loading to false after Redux state is available
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.phone.match(/^\d{11}$/)) {
      toast.error("Phone number must be 11 digits");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!formData.deliveryArea) {
      toast.error("Delivery area is required");
      return false;
    }
    if (paymentMethod !== "cod" && !transactionId.trim()) {
      toast.error("Transaction ID is required for bKash/Nagad");
      return false;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call to place order
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const orderPayload: Order = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        delivery_area: formData.deliveryArea,
        products: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        total_amount: totalDue,
        payment_method: paymentMethod,
        transaction_id: paymentMethod !== "cod" ? transactionId : null,
        status: "pending",
        created_at: new Date().toISOString()
      };

      console.log("Order placed:", orderPayload);

      // Clear cart
      dispatch(clearCart());

      toast.success("Order placed successfully!");
      setTimeout(() => router.push("/order-confirmation"), 2000);
    } catch (error) {
      toast.error("Failed to place order");
      console.error("Order error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total due
  const totalDue = items.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        isCartOpen={isCartOpen}
        setIsCartOpen={(isOpen: boolean) => dispatch(toggleCart(isOpen))}
      />
      <CommonLayout>
        <Toaster position="top-center" />
        <div className="mx-auto py-8 px-0 md:px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Details Form */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Shipping Information
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
                    required
                    placeholder="Enter your full name..."
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
                    required
                    placeholder="Enter your phone number..."
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
                    required
                    placeholder="Enter your address..."
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="deliveryArea"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Delivery Area
                  </label>
                  <select
                    id="deliveryArea"
                    name="deliveryArea"
                    value={formData.deliveryArea}
                    onChange={handleInputChange}
                    className="mt-1 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="" disabled>
                      Select delivery area
                    </option>
                    <option value="inside_dhaka">Inside Dhaka</option>
                    <option value="outside_dhaka">Outside Dhaka</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Order Summary and Payment Options */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              {items.length === 0 ? (
                <p className="text-red-500 text-sm">Your cart is empty</p>
              ) : (
                <div className="space-y-4 w-full">
                  {items.map((item, index) => (
                    <div
                      key={`${item.productId}-${item.variantId || index}`}
                      className="flex justify-between border-b pb-4"
                    >
                      <div className="flex items-start gap-4 w-full">
                        <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name || "Product image"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {item.name || `Product #${item.productId}`}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Price: BDT {item.price?.toLocaleString() || "0"}
                          </p>
                        </div>
                        <div className="text-gray-800 font-medium">
                          BDT {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4">
                    <div className="flex justify-between font-semibold text-gray-800 text-lg">
                      <p>Total Due</p>
                      <p>BDT {totalDue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor="cod"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Cash on Delivery
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="bkash"
                    name="paymentMethod"
                    value="bkash"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor="bkash"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    bKash
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="nagad"
                    name="paymentMethod"
                    value="nagad"
                    checked={paymentMethod === "nagad"}
                    onChange={() => setPaymentMethod("nagad")}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor="nagad"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Nagad
                  </label>
                </div>
                {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                  <div className="mt-4">
                    <label
                      htmlFor="transactionId"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      id="transactionId"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
                      placeholder="Enter transaction ID"
                      required
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || items.length === 0}
                className={`mt-6 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                  isSubmitting || items.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </CommonLayout>
      <Footer />
    </>
  );
}