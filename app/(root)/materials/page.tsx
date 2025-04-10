import { getCurrentUser } from "@/auth/currentUser";
import { getMaterials } from "@/lib/actions/material.actions";
import { getMaterialTypes } from "@/lib/actions/material.classifcations.actions";
import { getClassifications } from "@/lib/actions/classification.actions";
import MaterialsClient from "./MaterialsClient";
import type { SearchParams } from "nuqs/server";
import { loadMaterialSearchParams } from "@/lib/searchParams";
import { Suspense } from "react";
import LoadingSpinnerIcon from "@/components/ui/loading-spinner";

type Props = {
  searchParams: Promise<SearchParams>;
};

async function MaterialsServer({ searchParams }: Props) {
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

export default function MaterialsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<LoadingSpinnerIcon />}>
      <MaterialsServer searchParams={searchParams} />
    </Suspense>
  );
}
