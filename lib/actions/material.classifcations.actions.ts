"use server";

import { Classification } from "@/types/generics";
import { fetchAndHandleResponse } from "../utils";
import { getSession } from "@/auth/session";

const MATERIAL_TYPES_URL = `${process.env.DOMAIN}/material/type/`;

async function getMaterialTypes(): Promise<Classification[]> {
  const response = await fetchAndHandleResponse<Classification[]>({
    jwt: (await getSession())?.access,
    url: MATERIAL_TYPES_URL,
    method: "GET",
  });
  return response.data ?? [];
}

export { getMaterialTypes };
