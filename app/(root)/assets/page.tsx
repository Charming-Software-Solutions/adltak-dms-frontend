import React from "react";
import AssetsClient from "./AssetsClient";
import { getAssets } from "@/lib/actions/asset.actions";
import { getAssetTypes } from "@/lib/actions/asset.classifcations.actions";
import { getSession } from "@/lib/session";
import { getProducts } from "@/lib/actions/product.actions";

export default async function Assets() {
  const assets = await getAssets();
  const assetTypes = await getAssetTypes();
  const products = await getProducts();
  const user = (await getSession())!.user;

  return (
    <AssetsClient
      user={user}
      assets={assets}
      assetTypes={assetTypes}
      products={products}
    />
  );
}
