"use client";
import CommonLayout from "@/app/layouts/CommonLayout";
import { useBusiness } from "@/hooks/useBusiness";
import { useGetProductsQuery } from "@/lib/api/publicApi";
import { Category } from "@/types/business";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

// Helper function to extract timestamp from MongoDB ObjectId
const getTimestampFromId = (id: string) => {
  return parseInt(id.substring(0, 8), 16) * 1000;
};

export default function ProductsPage() {
  const { businessData } = useBusiness();
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery({});
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortOption, setSortOption] = useState<string>("default");

  // Calculate min and max prices from all products
  const { minPrice, maxPrice } = useMemo(() => {
    if (!products || products.length === 0) return { minPrice: 0, maxPrice: 10000 };
    
    const allPrices = products.flatMap(product => 
      product.variantsId?.map(variant => Number(variant.selling_price)) || []
    ).filter(price => !isNaN(price));
    
    return {
      minPrice: Math.min(...allPrices),
      maxPrice: Math.max(...allPrices)
    };
  }, [products]);

  // Initialize price range when products load
  useEffect(() => {
    if (products && products.length > 0) {
      setCurrentPriceRange([minPrice, maxPrice]);
    }
  }, [products, minPrice, maxPrice]);

  // Flatten all categories (including nested)
  const allCategories = useMemo(() => {
    const flat: Category[] = [];
    const flatten = (cats: Category[] | undefined) => {
      if (!cats) return;
      cats.forEach((cat) => {
        flat.push(cat);
        if (cat.children?.length) flatten(cat.children);
      });
    };
    flatten(businessData?.categories);
    return flat;
  }, [businessData]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products || productsLoading) {
      return [];
    }

    const filtered = products.filter((product: Product) => {
      // Category filter
      if (selectedCategory) {
        if (!product.sub_category || !Array.isArray(product.sub_category)) {
          return false;
        }
        const categoryMatch = product.sub_category.some(
          (subCat) => subCat && subCat._id === selectedCategory
        );
        if (!categoryMatch) return false;
      }

      // Price filter
      const productPrice = Number(product.variantsId?.[0]?.selling_price || 0);
      return productPrice >= currentPriceRange[0] && productPrice <= currentPriceRange[1];
    });

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        filtered.sort((a, b) => 
          Number(a.variantsId?.[0]?.selling_price || 0) - 
          Number(b.variantsId?.[0]?.selling_price || 0)
        );
        break;
      case "price-high-low":
        filtered.sort((a, b) => 
          Number(b.variantsId?.[0]?.selling_price || 0) - 
          Number(a.variantsId?.[0]?.selling_price || 0)
        );
        break;
      case "newest":
        filtered.sort((a, b) => 
          (b.createdAt ? new Date(b.createdAt).getTime() : getTimestampFromId(b._id)) - 
          (a.createdAt ? new Date(a.createdAt).getTime() : getTimestampFromId(a._id))
        );
        break;
      case "oldest":
        filtered.sort((a, b) => 
          (a.createdAt ? new Date(a.createdAt).getTime() : getTimestampFromId(a._id)) - 
          (b.createdAt ? new Date(b.createdAt).getTime() : getTimestampFromId(b._id))
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [products, productsLoading, selectedCategory, currentPriceRange, sortOption]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = Number(e.target.value);
    const newPriceRange = [...currentPriceRange] as [number, number];
    newPriceRange[index] = newValue;
    setCurrentPriceRange(newPriceRange);
  };

  const applyPriceFilter = () => {
    // You can enhance this function later if needed
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  if (productsLoading) {
    return (
      <CommonLayout>
        <div className='p-4 flex justify-center items-center h-screen'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary'></div>
        </div>
      </CommonLayout>
    );
  }

  if (productsError || !products) {
    return (
      <CommonLayout>
        <div className='p-4 text-red-500'>
          Failed to load products:{" "}
          {productsError ? JSON.stringify(productsError) : "No products available"}
        </div>
      </CommonLayout>
    );
  }

  return (
    <div className='p-4'>
      <CommonLayout>
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Sidebar Filters */}
          <div className='w-full md:w-64 flex-shrink-0'>
            {/* Categories Filter */}
            <div className='bg-white p-4 rounded-lg shadow mb-6'>
              <h2 className='font-bold text-lg mb-4'>Filter by Sub-Category</h2>
              <div className='space-y-2'>
                <label className='flex items-center space-x-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    className='form-checkbox text-primary rounded'
                    checked={!selectedCategory}
                    onChange={() => setSelectedCategory(null)}
                  />
                  <span>All Products</span>
                </label>
                {allCategories.map((category) => (
                  <label
                    key={category._id}
                    className='flex items-center space-x-2 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      className='form-checkbox text-primary rounded'
                      checked={selectedCategory === category._id}
                      onChange={() => setSelectedCategory(category._id)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className='bg-white p-4 rounded-lg shadow'>
              <h2 className='font-bold text-lg mb-4'>Filter by Price</h2>
              <div className='flex justify-between mb-2'>
                <span>Min. ৳{currentPriceRange[0].toFixed(2)}</span>
                <span>Max. ৳{currentPriceRange[1].toFixed(2)}</span>
              </div>
              <div className='mb-4 space-y-4'>
                <input
                  type='range'
                  className='w-full'
                  min={minPrice}
                  max={maxPrice}
                  value={currentPriceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                />
                <input
                  type='range'
                  className='w-full'
                  min={minPrice}
                  max={maxPrice}
                  value={currentPriceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                />
              </div>
              <button
                onClick={applyPriceFilter}
                className='w-full py-2 bg-primary text-white rounded hover:bg-primary-dark transition'
              >
                Apply Price Filter
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {/* Products Count and Sort */}
            <div className='mb-4 flex justify-between items-center'>
              <h1 className='text-sm md:text-2xl mr-2 font-bold'>
                {selectedCategory
                  ? `${allCategories.find((c) => c._id === selectedCategory)?.name || "Unknown"} Products`
                  : "All Products"}
              </h1>
              <div className='flex items-center gap-4'>
                <span className='text-sm text-gray-500'>
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                </span>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className='border rounded px-3 py-1 text-sm'
                >
                  <option value="default">Default</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredProducts.map((product: Product) => (
                <Link
                  href={`/products/${product._id}`}
                  key={product._id}
                  className='group block border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'
                >
                  <div className='relative w-full aspect-square bg-gray-100'>
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
                    <h2 className='text-lg font-semibold text-gray-800 group-hover:text-primary truncate'>
                      {product.name}
                    </h2>
                    <div
                      className='prose text-gray-600 text-sm line-clamp-2 mt-1'
                      dangerouslySetInnerHTML={{
                        __html: product.short_description,
                      }}
                    />
                    <div className='mt-3 flex items-center justify-between'>
                      <p className='text-base font-bold text-primary'>
                        BDT{" "}
                        {Number(
                          product.variantsId?.[0]?.selling_price || 0
                        ).toFixed(2)}
                      </p>
                      {product.variantsId?.[0]?.offer_price && (
                        <p className='text-sm text-gray-500 line-through'>
                          BDT{" "}
                          {Number(product.variantsId?.[0]?.offer_price).toFixed(
                            2
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className='text-center py-12'>
                <h3 className='text-lg font-medium text-gray-700'>
                  No products found
                </h3>
                <p className='text-gray-500 mt-2'>
                  {selectedCategory
                    ? "No products in this category and price range. Try adjusting filters."
                    : "No products available in the selected price range."}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPriceRange([minPrice, maxPrice]);
                    setSortOption("default");
                  }}
                  className='mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition'
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </CommonLayout>
    </div>
  );
}
