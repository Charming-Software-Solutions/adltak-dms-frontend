import { getCurrentUser } from "@/auth/currentUser";
import { getMaterials } from "@/lib/actions/material.actions";
import { getMaterialTypes } from "@/lib/actions/material.classifcations.actions";
import { getClassifications } from "@/lib/actions/classification.actions";
import MaterialsClient from "./MaterialsClient";
import type { SearchParams } from "nuqs/server";
import { loadMaterialSearchParams } from "@/lib/searchParams";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Materials({ searchParams }: Props) {
  const materials = await getMaterials(
    await loadMaterialSearchParams(searchParams),
  );
  const materialTypes = await getMaterialTypes();
  const brands = await getClassifications("product_brand");
  const user = await getCurrentUser();

  return (
    <MaterialsClient
      user={user!}
      materials={materials}
      materialTypes={materialTypes}
      brands={brands}
    />
  );
}
