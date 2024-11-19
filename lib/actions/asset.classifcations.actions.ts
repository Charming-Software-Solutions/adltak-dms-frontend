"use server";

import { Classification } from "@/types/generics";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "../session";

const ASSET_TYPES_URL = `${process.env.DOMAIN}/asset/type/`;

async function getAssetTypes(): Promise<Classification[]> {
  const response = await fetchAndHandleResponse<Classification[]>({
    jwt: (await getSession())?.access,
    url: ASSET_TYPES_URL,
    method: "GET",
  });
  return response.data ?? [];
}

export { getAssetTypes };
