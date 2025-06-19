import { useMemo } from "react";
import { useBusiness } from "@/hooks/useBusiness";
import { Category } from "@/types/business";
import { useGetProductsByCategoriesQuery } from "@/lib/api/publicApi";
import CommonLayout from "@/app/layouts/CommonLayout";
import Title from "../../ui/Title";
import CategoryProductCard from "../../ui/CategoryProductCard";
import Banner from "../Banner";
import Link from "next/link";
import { Product } from "@/types/cart";

export default function CategoryProducts() {
  const { businessData, isLoading } = useBusiness();

  // Flatten all categories (including nested)
  const allCategories = useMemo(() => {
    const flat: Category[] = [];
    const flatten = (cats: Category[]) => {
      cats.forEach((cat) => {
        flat.push(cat);
        if (cat.children?.length) flatten(cat.children);
      });
    };
    if (businessData?.categories?.length) {
      flatten(businessData.categories);
    }
    return flat;
  }, [businessData]);
  console.log(allCategories);

  if (isLoading) return <div>Loading...</div>;
  if (!allCategories.length) return <div>No categories found</div>;

  // Child component defined inside to use hook per category
  function CategorySection({
    categoryId,
    categoryName,
  }: {
    categoryId: string;
    categoryName: string;
  }) {
    const {
      data: productsData,
      isLoading,
      error,
    } = useGetProductsByCategoriesQuery(categoryId, {
      skip: !categoryId,
    });

    if (isLoading) return null; // You can add per-category loader here
    if (error || !productsData?.data?.length) return null;

    return (
      <div>
        <CommonLayout>
          <Title title={categoryName} />
          <div className='grid grid-cols-2  mdl:grid-cols-3 lgx:grid-cols-4 gap-2 justify-center p-2'>
            {productsData.data.map((product: Product) => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <CategoryProductCard product={product} />
              </Link>
            ))}
          </div>
        </CommonLayout>
        <Banner />
      </div>
    );
  }

  return (
    <div className='mt-8 space-y-8'>
      {allCategories.map((category) => (
        <CategorySection
          key={category._id}
          categoryId={category._id}
          categoryName={category.name}
        />
      ))}
    </div>
  );
}
