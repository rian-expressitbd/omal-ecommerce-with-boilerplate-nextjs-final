"use client";
import CommonLayout from "@/app/layouts/CommonLayout";
import { useBusiness } from "@/hooks/useBusiness";
import { useGetProductsQuery } from "@/lib/api/publicApi";
import { Category } from "@/types/business";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

export default function ProductsPage() {
  const { businessData } = useBusiness();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([
    0, 10000,
  ]);
  const [sortOption, setSortOption] = useState<string>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 2; // 3 pages for 5 products

  // Map sort options to API sort parameters
  const sortMap: { [key: string]: string } = {
    newest: "-createdAt",
    oldest: "createdAt",
    "name-asc": "name",
    "name-desc": "-name",
  };

  // Fetch paginated products
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery({
    sort: sortMap[sortOption] || undefined,
    page: currentPage,
    limit: productsPerPage,
  });
  const { data: totalProduct } = useGetProductsQuery({});

  // Define totalProducts early
  const totalProducts = totalProduct?.length; // Hardcoded since you confirmed 5 products
  const totalPages = Math.ceil(totalProducts || 0 / productsPerPage);

  // Debug API products
  useEffect(() => {
    console.log("API Products:", products?.length, products);
  }, [products]);

  // Calculate min and max prices
  const { minPrice, maxPrice } = useMemo(() => {
    if (!products || products.length === 0)
      return { minPrice: 0, maxPrice: 10000 };

    const allPrices = products
      .flatMap(
        (product: Product) =>
          product.variantsId?.map((variant) => Number(variant.selling_price)) ||
          []
      )
      .filter((price) => !isNaN(price));

    return {
      minPrice: allPrices.length ? Math.min(...allPrices) : 0,
      maxPrice: allPrices.length ? Math.max(...allPrices) : 10000,
    };
  }, [products]);

  // Initialize price range
  useEffect(() => {
    if (products && products.length > 0) {
      setCurrentPriceRange([minPrice, maxPrice]);
    }
  }, [products, minPrice, maxPrice]);

  // Flatten categories
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

  // Filter and sort products (client-side)
  const filteredProducts = useMemo(() => {
    if (!products || productsLoading) {
      return [];
    }

    // Temporarily bypass filtering for debugging (uncomment to test)
    // let filtered = products;
    let filtered = products.filter((product: Product) => {
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
      return (
        productPrice >= currentPriceRange[0] &&
        productPrice <= currentPriceRange[1]
      );
    });

    // Client-side price sorting
    if (sortOption === "price-low-high") {
      filtered = filtered.sort(
        (a, b) =>
          Number(a.variantsId?.[0]?.selling_price || 0) -
          Number(b.variantsId?.[0]?.selling_price || 0)
      );
    } else if (sortOption === "price-high-low") {
      filtered = filtered.sort(
        (a, b) =>
          Number(b.variantsId?.[0]?.selling_price || 0) -
          Number(a.variantsId?.[0]?.selling_price || 0)
      );
    }

    // Debug filtered products and total pages
    console.log("Filtered Products:", filtered.length, filtered);
    console.log("Total Pages:", totalPages);

    return filtered;
  }, [
    products,
    productsLoading,
    selectedCategory,
    currentPriceRange,
    sortOption,
    totalPages,
  ]);

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isMin: boolean
  ) => {
    const newValue = Number(e.target.value);
    setCurrentPriceRange((prev) => {
      const [min, max] = prev;
      if (isMin) {
        return [Math.min(newValue, max), max];
      } else {
        return [min, Math.max(newValue, min)];
      }
    });
  };

  const applyPriceFilter = () => {
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  // const displayedProducts = filteredProducts.slice(
  //   (currentPage - 1) * productsPerPage,
  //   currentPage * productsPerPage
  // );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
          {productsError
            ? JSON.stringify(productsError)
            : "No products available"}
        </div>
      </CommonLayout>
    );
  }

  return (
    <div className='p-4'>
      <CommonLayout>
        <style jsx>{`
          .range-slider {
            position: relative;
            width: 100%;
            height: 16px;
            margin-bottom: 16px;
          }
          .range-track {
            position: absolute;
            width: 100%;
            height: 4px;
            background: #e5e7eb;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 2px;
          }
          .range-filled {
            position: absolute;
            height: 4px;
            background: #3b82f6;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 2px;
          }
          .range-input {
            position: absolute;
            width: 100%;
            height: 16px;
            top: 0;
            background: transparent;
            pointer-events: none;
            -webkit-appearance: none;
            appearance: none;
          }
          .range-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: #3b82f6;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: auto;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
          }
          .range-input::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #3b82f6;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: auto;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
            border: none;
          }
          .range-input:focus {
            outline: none;
          }
          .pagination-button {
            padding: 8px 12px;
            margin: 0 4px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
          }
          .pagination-button:hover:not(.disabled) {
            background: #f3f4f6;
          }
          .pagination-button.active {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }
          .pagination-button.disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }
        `}</style>
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
                    onChange={() => handleCategoryChange(null)}
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
                      onChange={() => handleCategoryChange(category._id)}
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
              <div className='range-slider'>
                <div className='range-track'></div>
                <div
                  className='range-filled'
                  style={{
                    left: `${((currentPriceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    width: `${((currentPriceRange[1] - currentPriceRange[0]) / (maxPrice - minPrice)) * 100}%`,
                  }}
                ></div>
                <input
                  type='range'
                  className='range-input'
                  min={minPrice}
                  max={maxPrice}
                  value={currentPriceRange[0]}
                  onChange={(e) => handlePriceChange(e, true)}
                />
                <input
                  type='range'
                  className='range-input'
                  min={minPrice}
                  max={maxPrice}
                  value={currentPriceRange[1]}
                  onChange={(e) => handlePriceChange(e, false)}
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
                  {totalProducts}{" "}
                  {totalProducts && totalProducts > 1 ? "products" : "product"}
                </span>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className='border rounded px-3 py-1 text-sm'
                >
                  <option value='default'>Default</option>
                  <option value='price-low-high'>Price: Low to High</option>
                  <option value='price-high-low'>Price: High to Low</option>
                  <option value='newest'>Newest First</option>
                  <option value='oldest'>Oldest First</option>
                  <option value='name-asc'>Name: A to Z</option>
                  <option value='name-desc'>Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredProducts?.map((product: Product) => (
                <Link
                  href={`/products/${product._id}`}
                  key={product._id}
                  className='group block border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300'
                >
                  <div className='relative w-full aspect-square bg-gray-200'>
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

            {/* Pagination Controls */}
            <div className='flex justify-center items-center mt-8 space-x-2'>
              <button
                className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    className={`pagination-button ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
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
                    setCurrentPage(1);
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
