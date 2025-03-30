import { getCurrentUser } from "@/auth/currentUser";
import { getClassifications } from "@/lib/actions/classification.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getProjectProducts } from "@/lib/actions/project.actions";
import ProductClient from "./ProductClient";
import type { SearchParams } from "nuqs/server";
import { loadProductSearchParams } from "@/lib/searchParams";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Products({ searchParams }: Props) {
  const products = await getProducts(
    await loadProductSearchParams(searchParams),
  );
  const projectProducts = await getProjectProducts();
  const brands = await getClassifications("product_brand");
  const categories = await getClassifications("product_category");
  const types = await getClassifications("product_type");
  const user = await getCurrentUser();

  return (
    <ProductClient
      user={user!}
      products={products}
      projectProducts={projectProducts}
      brands={brands}
      categories={categories}
      types={types}
    />
  );
}
