import { getProducts } from "@/lib/actions/product.actions";
import {
  getBrands,
  getCategories,
  getTypes,
} from "@/lib/actions/product.classications.actions";
import ProductClient from "./ProductClient";
import { getSession } from "@/lib/session";
import { getDistributionProducts } from "@/lib/actions/distribution.actions";

export default async function Products() {
  const products = await getProducts();
  const allocationProducts = await getDistributionProducts();
  const brands = await getBrands();
  const categories = await getCategories();
  const types = await getTypes();
  const user = (await getSession())!.user;
  console.log(allocationProducts);

  return (
    <ProductClient
      user={user}
      products={products}
      allocationProducts={allocationProducts}
      brands={brands}
      categories={categories}
      types={types}
    />
  );
}
