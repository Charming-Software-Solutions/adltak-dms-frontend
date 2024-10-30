"use server";

import { Classification } from "@/types/generics";
import { fetchAndHandleResponse } from "../utils";

const ASSET_TYPES_URL = `${process.env.DOMAIN}/asset/type/`;

async function getAssetTypes(): Promise<Classification[]> {
  const response = await fetchAndHandleResponse<Classification[]>({
    url: ASSET_TYPES_URL,
    method: "GET",
  });
  return response.data ?? [];
}

export { getAssetTypes };
