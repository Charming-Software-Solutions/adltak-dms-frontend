import { getClassifications } from "@/lib/actions/classification.actions";
import ClassificationsClient from "./ClassificationsClient";
import { getCurrentUser } from "@/auth/currentUser";
import { Suspense } from "react";
import LoadingSpinnerIcon from "@/components/ui/loading-spinner";

async function ClassificationsServer() {
  const user = await getCurrentUser();
  const [productBrands, productCategories, productTypes, materialTypes] =
    await Promise.all([
      getClassifications("product_brand"),
      getClassifications("product_category"),
      getClassifications("product_type"),
      getClassifications("material_type"),
    ]);

  const classifications = {
    productBrands: productBrands,
    productCategories: productCategories,
    productTypes: productTypes,
    materialTypes: materialTypes,
  };

  return (
    <ClassificationsClient user={user!} classifications={classifications} />
  );
}

export default function ClassificationsPage() {
  return (
    <Suspense fallback={<LoadingSpinnerIcon />}>
      <ClassificationsServer />
    </Suspense>
  );
}
