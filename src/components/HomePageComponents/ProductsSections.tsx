'use client';

import { useGetProductsQuery } from "@/lib/api/publicApi";
import CommonLayout from "@/app/layouts/CommonLayout";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

export default function ProductsSection() {
  const { data: products, error, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 5,
  });

  if (isLoading) return <div className="p-4">Loading products...</div>;
  if (error || !products) return <div className="p-4">Failed to load products.</div>;

  return (
    <div className='p-4'>
      <CommonLayout>
        <h1 className='text-2xl font-bold mb-6'>All Products</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 mdl:grid-cols-3 lgx:grid-cols-4 gap-6'>
          {products.map((product: Product) => (
            <Link
              href={`/products/${product._id}`}
              key={product._id}
              className='group block border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'
            >
              <div className='relative w-full h-48 bg-gray-100'>
                <Image
                  src={
                    product.images?.[0]?.image.secure_url ||
                    "https://via.placeholder.com/300"
                  }
                  alt={product.name}
                  fill
                  className='object-cover'
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
      </CommonLayout>
    </div>
  );
}
