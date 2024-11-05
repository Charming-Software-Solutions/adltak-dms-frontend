import { z } from "zod";

export const productFormSchema = z.object({
  sku: z.string().min(2, {
    message: "Product SKU is required.",
  }),
  name: z.string().min(2, {
    message: "Product name should be at least 2 characters.",
  }),
  brand: z.string().uuid({
    message: "Bran is required",
  }),
  category: z.string().uuid({
    message: "Category is required.",
  }),
  type: z.string().uuid({
    message: "Product type is required.",
  }),
  // description: z
  //   .string()
  //   .max(255, {
  //     message: "Description should be only 255 characters long.",
  //   })
  //   .optional(),
  thumbnail: z.union([z.instanceof(File), z.string()]).optional(),
  // status: z.string().min(1, {
  //   message: "Status is required.",
  // }),
  stock: z.coerce.number().positive(),
});

export const userFormSchema = z.object({
  email: z.string().min(2, {
    message: "Email is required.",
  }),
  password: z.string().min(6, {
    message: "Password should be at least 6 characters.",
  }),
  role: z.string().min(2, {
    message: "User role is required.",
  }),
});

export const distributionProductSchema = z.object({
  product: z.string().uuid({
    message: "Product is required.",
  }),
  quantity: z.coerce.number().positive(),
});

export const distributionFormSchema = z.object({
  type: z.string().min(1, {
    message: "Product type is required.",
  }),
  client: z.string().min(1, {
    message: "Client name is required.",
  }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),
  // logisticsPerson: z.string().min(1, {
  //   message: "Logitics person is required.",
  // }),
});

export const taskFormSchema = z.object({
  employee: z.string().min(1, {
    message: "Employee is required.",
  }),
  distribution: z.string().uuid({
    message: "Distribution is required.",
  }),
});

export const assetFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  thumbnail: z.union([z.instanceof(File), z.string()]).optional(),
  code: z.string().min(1, {
    message: "Code is required.",
  }),
  type: z.string().uuid({
    message: "Type is required.",
  }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;
export type DistributionFormData = z.infer<typeof distributionFormSchema>;
export type DistributionProductFormData = z.infer<
  typeof distributionProductSchema
>;
export type TaskFormData = z.infer<typeof taskFormSchema>;
export type AssetFormData = z.infer<typeof assetFormSchema>;
