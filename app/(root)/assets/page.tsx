import React from "react";
import AssetsClient from "./AssetsClient";
import { getAssets } from "@/lib/actions/asset.actions";
import { getAssetTypes } from "@/lib/actions/asset.classifcations.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getCurrentUser } from "@/auth/currentUser";

export default async function Assets() {
  const assets = await getAssets();
  const assetTypes = await getAssetTypes();
  const products = await getProducts();
  const user = await getCurrentUser();

  return (
    <AssetsClient
      user={user!}
      assets={assets}
      assetTypes={assetTypes}
      products={products}
    />
  );
}
