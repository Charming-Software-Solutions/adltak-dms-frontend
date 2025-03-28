import { getCurrentUser } from "@/auth/currentUser";
import { getProducts } from "@/lib/actions/product.actions";
import {
  getBrands,
  getCategories,
  getTypes,
} from "@/lib/actions/product.classications.actions";
import { getProjectProducts } from "@/lib/actions/project.actions";
import ProductClient from "./ProductClient";

export default async function Products() {
  const products = await getProducts();
  const allocationProducts = await getProjectProducts();
  const brands = await getBrands();
  const categories = await getCategories();
  const types = await getTypes();
  const user = await getCurrentUser();

  return (
    <ProductClient
      user={user!}
      products={products}
      projectProductsa={allocationProducts}
      brands={brands}
      categories={categories}
      types={types}
    />
  );
}
