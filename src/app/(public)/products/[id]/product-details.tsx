// src/components/ProductDetail.tsx (Client Component)
"use client";

import AddToCartBtn from "@/components/ui/molecules/addToCartBtn";
import type { Product, Variant } from "@/types/product";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const hasVariants = product.hasVariants;
  const variants = product.variantsId;

  // If no variants (but one in array), treat that as only option
  const defaultVariant =
    !hasVariants && variants.length === 1 ? variants[0] : null;

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    defaultVariant
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // initialize selection when product loads
    if (!hasVariants && variants.length === 1) {
      setSelectedVariant(variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1);
  }, [hasVariants, product, variants]);

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vid = e.target.value;
    const v = variants.find((x) => x._id === vid) || null;
    setSelectedVariant(v);
    setQuantity(1);
  };

  const price = selectedVariant
    ? Number(selectedVariant.selling_price)
    : Number(variants[0]?.selling_price || 0);
  const stock = selectedVariant?.variants_stock ?? product.total_stock ?? 0;
  const imageUrl =
    selectedVariant?.image?.image?.secure_url ||
    product.images[0]?.image?.secure_url;

  return (
    <article className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      <div className='relative aspect-square bg-gray-100 rounded-lg overflow-hidden'>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className='object-cover'
          priority
        />
      </div>

      <div className='space-y-4'>
        <h1 className='text-3xl font-bold'>{product.name}</h1>

        <div className='flex items-center gap-4'>
          <span className='text-2xl font-semibold text-primary'>
            ${price.toFixed(2)}
          </span>
          <span
            className={`px-2 py-1 rounded text-sm ${
              stock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {hasVariants && variants.length > 1 && (
          <div>
            <label htmlFor='variant' className='block mb-1 font-medium'>
              Select Option
            </label>
            <select
              id='variant'
              value={selectedVariant?._id || ""}
              onChange={handleVariantChange}
              className='w-full border rounded px-3 py-2'
            >
              <option value='' disabled>
                -- choose --
              </option>
              {variants.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className='flex items-center space-x-2'>
          <label htmlFor='quantity' className='font-medium'>
            Qty:
          </label>
          <input
            id='quantity'
            type='number'
            min={1}
            max={stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className='w-20 border rounded px-2 py-1'
          />
        </div>

        <AddToCartBtn
          item={product}
          variant={selectedVariant || undefined}
          quantity={quantity}
        />

        {product.short_description && (
          <div
            className='prose max-w-none text-gray-600 pt-4 border-t truncate'
            dangerouslySetInnerHTML={{ __html: product.short_description }}
          />
        )}

        {product.long_description && (
          <section className='pt-6 border-t'>
            <h2 className='text-xl font-semibold mb-2'>Product Details</h2>
            <div
              className='prose max-w-none text-gray-600'
              dangerouslySetInnerHTML={{ __html: product.long_description }}
            />
          </section>
        )}
      </div>
    </article>
  );
}
