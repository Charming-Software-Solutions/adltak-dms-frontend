import React from "react";
import AssetsClient from "./AssetsClient";
import { getAssets } from "@/lib/actions/asset.actions";
import { getAssetTypes } from "@/lib/actions/asset.classifcations.actions";

export default async function Assets() {
  const assets = await getAssets();
  const assetTypes = await getAssetTypes();

  return <AssetsClient assets={assets} assetTypes={assetTypes} />;
}
