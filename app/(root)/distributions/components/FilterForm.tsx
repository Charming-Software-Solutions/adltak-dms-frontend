"use client";

import { ProductFormData } from "@/schemas";
import { Brand } from "@/types/product";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<ProductFormData>;
  brands: Brand[];
};

const FilterForm = ({ brands }: Props) => {
  return <div>tst</div>;
};

export default FilterForm;
