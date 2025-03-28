import { getCurrentUser } from "@/auth/currentUser";
import { getAssets } from "@/lib/actions/asset.actions";
import { getAssetTypes } from "@/lib/actions/asset.classifcations.actions";
import { getClassifications } from "@/lib/actions/classification.actions";
import AssetsClient from "./AssetsClient";

export default async function Assets() {
  const assets = await getAssets();
  const assetTypes = await getAssetTypes();
  const brands = await getClassifications("product_brand");
  const user = await getCurrentUser();

  return (
    <AssetsClient
      user={user!}
      assets={assets}
      assetTypes={assetTypes}
      brands={brands}
    />
  );
}
