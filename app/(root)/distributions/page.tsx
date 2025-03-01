import DistributionClient from "./DistributionClient";
import { getBrands } from "@/lib/actions/product.classications.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getDistributions } from "@/lib/actions/distribution.actions";
import { getAssets } from "@/lib/actions/asset.actions";
import { getCurrentUser } from "@/auth/currentUser";

export default async function Distributions() {
  const brands = await getBrands();
  const products = await getProducts();
  const distributions = await getDistributions();
  const assets = await getAssets();
  const employee = await getCurrentUser({ withEmployeeProfile: true });

  return (
    <DistributionClient
      user={employee.user}
      employee={employee.first_name || "Admin"}
      distributions={distributions}
      brands={brands}
      products={products}
      assets={assets}
    />
  );
}
