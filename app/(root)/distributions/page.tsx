import DistributionClient from "./DistributionClient";
import { getBrands } from "@/lib/actions/product.classications.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getDistributions } from "@/lib/actions/distribution.actions";
import { getSession } from "@/lib/session";
import { getAssets } from "@/lib/actions/asset.actions";

export default async function Distributions() {
  const brands = await getBrands();
  const products = await getProducts();
  const distributions = await getDistributions();
  const assets = await getAssets();
  const userSession = await getSession();

  return (
    <DistributionClient
      user={userSession!.user}
      employee={userSession?.employee?.name || "Admin"}
      distributions={distributions}
      brands={brands}
      products={products}
      assets={assets}
    />
  );
}
