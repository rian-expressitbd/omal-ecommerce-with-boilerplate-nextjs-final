// src/components/AddToCartBtn.tsx (Client Component)
"use client";

import { useCart } from "@/hooks/useCart";
import { TCartItem } from "@/lib/features/cart/cartSlice";
import type { Product, Variant } from "@/types/product";
import { Button } from "../atoms/button";

interface AddToCartBtnProps {
  item: Product;
  variant?: Variant;
  quantity?: number;
}

export default function AddToCartBtn({
  item,
  variant,
  quantity = 1,
}: AddToCartBtnProps) {
  const cart = useCart();

  const handleAdd = () => {
    const selected = variant || item.variantsId[0]; // Changed from variantsId to variants assuming it's the correct property
    if (!selected) return;

    const variantName = variant?.name
      ? ` - ${variant.name.split("/").pop()?.trim()}`
      : "";
    const cartItem: TCartItem = {
      _id: selected._id,
      name: `${item.name}${variantName}`,
      price: Number(selected.selling_price),
      image:
        variant?.image?.image?.secure_url ||
        item.images[0]?.image?.secure_url ||
        "",
      quantity,
      maxStock: item.total_stock || 0, // Changed from variants_stock to stock assuming it's the correct property
    };
    cart.addItem(cartItem);
  };

  const disabled = variant
    ? (variant.variants_stock || 0) <= 0
    : (item.total_stock || 0) <= 0;

  return (
    <Button
      title='Add to Cart'
      onClick={handleAdd}
      disabled={disabled}
      size='md'
    >
      Add to Cart
    </Button>
  );
}
