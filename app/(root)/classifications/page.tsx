import { getClassifications } from "@/lib/actions/classification.actions";
import ClassificationsClient from "./ClassificationsClient";
import { getCurrentUser } from "@/auth/currentUser";

export default async function ClassificationsPage() {
  const user = await getCurrentUser();
  const [productBrands, productCategories, productTypes, assetTypes] =
    await Promise.all([
      getClassifications("product_brand"),
      getClassifications("product_category"),
      getClassifications("product_type"),
      getClassifications("asset_type"),
    ]);

  const classifications = {
    productBrands: productBrands,
    productCategories: productCategories,
    productTypes: productTypes,
    assetTypes: assetTypes,
  };

  return (
    <ClassificationsClient user={user!} classifications={classifications} />
  );
}
