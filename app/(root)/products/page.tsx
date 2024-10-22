import ProductClient from "./ProductClient";
import { getProducts } from "@/lib/actions/product.actions";
import {
  getBrands,
  getCategories,
  getTypes,
} from "@/lib/actions/product.classications.actions";
import { getSession } from "@/lib/auth";
import { Suspense } from "react";

export default async function Products() {
  const products = await getProducts();
  const brands = await getBrands();
  const categories = await getCategories();
  const types = await getTypes();
  const user = (await getSession()).user;

  return (
    <Suspense fallback={<p>loading...</p>}>
      <ProductClient
        products={products}
        brands={brands}
        categories={categories}
        types={types}
        user={user}
      />
    </Suspense>
  );
}
