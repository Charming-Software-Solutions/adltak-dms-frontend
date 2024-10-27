import { getProducts } from "@/lib/actions/product.actions";
import {
  getBrands,
  getCategories,
  getTypes,
} from "@/lib/actions/product.classications.actions";
import ProductClient from "./ProductClient";

export default async function Products() {
  const products = await getProducts();
  const brands = await getBrands();
  const categories = await getCategories();
  const types = await getTypes();

  return (
    <ProductClient
      products={products}
      brands={brands}
      categories={categories}
      types={types}
    />
  );
}
