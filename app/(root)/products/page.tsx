import { getProducts } from "@/lib/actions/product.actions";
import {
  getBrands,
  getCategories,
  getTypes,
} from "@/lib/actions/product.classications.actions";
import ProductClient from "./ProductClient";
import { getDistributionProducts } from "@/lib/actions/distribution.actions";
import { getCurrentUser } from "@/auth/currentUser";

export default async function Products() {
  const products = await getProducts();
  const allocationProducts = await getDistributionProducts();
  const brands = await getBrands();
  const categories = await getCategories();
  const types = await getTypes();
  const user = await getCurrentUser();

  return (
    <ProductClient
      user={user!}
      products={products}
      allocationProducts={allocationProducts}
      brands={brands}
      categories={categories}
      types={types}
    />
  );
}
