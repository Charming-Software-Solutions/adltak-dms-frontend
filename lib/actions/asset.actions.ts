"use server";

import { Asset, AssetStatus } from "@/types/asset";
import { fetchAndHandleResponse } from "../utils";
import { ApiResponse } from "@/types/api";
import { ICreateAsset } from "@/interfaces";

const ASSET_URL = `${process.env.DOMAIN}/asset/`;

async function createAsset(body: ICreateAsset): Promise<ApiResponse<Asset>> {
  return fetchAndHandleResponse({
    url: ASSET_URL,
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function getAssets(): Promise<Asset[]> {
  const response = await fetchAndHandleResponse<Asset[]>({
    url: ASSET_URL,
    method: "GET",
  });
  return response.data ?? [];
}

async function updateAssetStatus({
  id,
  status,
}: {
  id: string;
  status: AssetStatus;
}): Promise<ApiResponse<Asset>> {
  return fetchAndHandleResponse({
    url: `${ASSET_URL}${id}/`,
    method: "PATCH",
    contentType: "application/json",
    body: JSON.stringify({
      status: status,
    }),
  });
}

async function deleteAsset(id: string): Promise<ApiResponse<string>> {
  return fetchAndHandleResponse({
    url: `${ASSET_URL}${id}/`,
    method: "DELETE",
  });
}

export { createAsset, getAssets, updateAssetStatus, deleteAsset };
