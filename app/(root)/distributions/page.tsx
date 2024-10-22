import { getSession } from "@/lib/auth";
import DistributionClient from "./DistributionClient";
import { getBrands } from "@/lib/actions/product.classications.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getDistributions } from "@/lib/actions/distribution.actions";

export default async function Distributions() {
  const user = (await getSession()).user;
  const brands = await getBrands();
  const products = await getProducts();
  const distributions = await getDistributions();

  return (
    <DistributionClient
      distributions={distributions}
      brands={brands}
      products={products}
      user={user}
    />
  );
}
