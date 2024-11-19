import DistributionClient from "./DistributionClient";
import { getBrands } from "@/lib/actions/product.classications.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getDistributions } from "@/lib/actions/distribution.actions";
import { getSession } from "@/lib/session";

export default async function Distributions() {
  const brands = await getBrands();
  const products = await getProducts();
  const distributions = await getDistributions();
  const user = (await getSession())!.user;

  return (
    <DistributionClient
      user={user}
      distributions={distributions}
      brands={brands}
      products={products}
    />
  );
}
