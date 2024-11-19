import React from "react";
import AssetsClient from "./AssetsClient";
import { getAssets } from "@/lib/actions/asset.actions";
import { getAssetTypes } from "@/lib/actions/asset.classifcations.actions";
import { getSession } from "@/lib/session";

export default async function Assets() {
  const assets = await getAssets();
  const assetTypes = await getAssetTypes();
  const user = (await getSession())!.user;

  return <AssetsClient user={user} assets={assets} assetTypes={assetTypes} />;
}
