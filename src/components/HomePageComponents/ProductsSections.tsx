"use client";

import { useGetProductsQuery } from "@/lib/api/publicApi";
import CommonLayout from "@/app/layouts/CommonLayout";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProductsSection() {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const limit = 10; // Fetch 10 products per page
  const [hasMore, setHasMore] = useState(true); // Track if more products exist

  // Fetch products for the current page
  const {
    data: products,
    error,
    isLoading,
    isFetching,
  } = useGetProductsQuery({
    page,
    limit,
  });

  // Append new products to allProducts when data changes
  useEffect(() => {
    if (products && products.length > 0) {
      setAllProducts((prev) => {
        // Avoid duplicates by checking _id
        const newProducts = products.filter(
          (p: Product) => !prev.some((existing) => existing._id === p._id)
        );
        return [...prev, ...newProducts];
      });
      // If fewer products than limit, assume no more products
      if (products.length < limit) {
        setHasMore(false);
      }
    } else if (products && products.length === 0) {
      setHasMore(false);
    }
  }, [products, limit]);

  // Handle Load More button click
  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  // Initial loading state
  if (isLoading && page === 1) {
    return (
      <div className='p-4'>
        <CommonLayout>
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600'></div>
          </div>
        </CommonLayout>
      </div>
    );
  }

  // Error state
  if (error || (!products && !isLoading)) {
    return (
      <div className='p-4'>
        <CommonLayout>
          <div className='text-red-500 text-center'>
            Failed to load products:{" "}
            {error ? JSON.stringify(error) : "No products available"}
          </div>
        </CommonLayout>
      </div>
    );
  }

  return (
    <div className='p-4'>
      <CommonLayout>
        <h1 className='text-2xl font-bold mb-6'>All Products</h1>
        <div className='grid grid-cols-2 mdl:grid-cols-3 lgx:grid-cols-4 gap-2'>
          {allProducts.map((product: Product) => (
            <Link
              href={`/products/${product._id}`}
              key={product._id}
              className='group block border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'
            >
              <div className='relative w-full h-[320px] bg-gray-100'>
                <Image
                  src={
                    product.images?.[0]?.image.secure_url ||
                    "https://via.placeholder.com/300"
                  }
                  alt={product.name}
                  fill
                  className='object-cover h-[348px]'
                  priority
                  sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                />
              </div>
              <div className='p-4'>
                <h2 className='text-lg font-semibold text-gray-800 group-hover:text-blue-600 truncate'>
                  {product.name}
                </h2>
                <div
                  className='prose w-full text-gray-600 text-sm flex truncate gap-1'
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
                <p className='text-base font-bold text-blue-600'>
                  BDT{" "}
                  {Number(product.variantsId?.[0]?.selling_price || 0).toFixed(
                    2
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className='mt-8 flex justify-center'>
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ${
                isFetching ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isFetching ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {/* Empty State */}
        {allProducts.length === 0 && !isLoading && (
          <div className='mt-8 text-center text-gray-600'>
            No products available.
          </div>
        )}
      </CommonLayout>
    </div>
  );
}
