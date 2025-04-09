import { getCurrentUser } from "@/auth/currentUser";
import { getMaterials } from "@/lib/actions/material.actions";
import { getMaterialTypes } from "@/lib/actions/material.classifcations.actions";
import { getClassifications } from "@/lib/actions/classification.actions";
import MaterialsClient from "./MaterialsClient";

export default async function Materials() {
  const materials = await getMaterials();
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
