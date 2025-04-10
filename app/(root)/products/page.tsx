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
  const [projectProducts, brands, categories, types] = await Promise.all([
    getProjectProducts(),
    getClassifications("product_brand"),
    getClassifications("product_category"),
    getClassifications("product_type"),
  ]);
  const user = await getCurrentUser();

  return (
    <ProductClient
      user={user!}
      products={products}
      projectProducts={projectProducts}
      classifications={{ brands, categories, types }}
    />
  );
}
