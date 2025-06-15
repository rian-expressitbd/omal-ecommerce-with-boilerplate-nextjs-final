"use client";
import CommonLayout from "@/app/layouts/CommonLayout";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useGetProductsQuery } from "@/lib/api/productsApi";
import Title from "../ui/Title";
import Skeleton from "../ui/Skeleton";
import Card from "../ui/Card";

export default function ProductsClientComponent() {
  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetProductsQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
  });

  // Initialize with empty array and properly handle the response structure
  const [productsToShow, setProductsToShow] = useState<any[]>([]);

  useEffect(() => {
    // Check if productsResponse exists and has data property
    if (productsResponse?.data) {
      setProductsToShow(productsResponse.data);
    }
  }, [productsResponse]);

  if (isError) return <p>Failed to load products.</p>;

  return (
    <div className='mt-5'>
      <CommonLayout>
        <Title title='All Products' />
        <div className='mt-3'>
          {isLoading ? (
            // Skeleton loader while loading
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-x-14 justify-center'>
              {[...Array(8)].map((_, index) => (
                <div key={index} className='flex flex-col space-y-3'>
                  <Skeleton className='h-64 w-full rounded-lg' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                </div>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-x-14 justify-center'>
              {productsToShow.map((product) => (
                <Link key={product._id} href={`/product/${product._id}`}>
                  <Card product={product} />
                </Link>
              ))}
            </div>
          )}
          {productsToShow.length === 0 && !isLoading && (
            <p>No products available.</p>
          )}
        </div>
      </CommonLayout>
    </div>
  );
}
