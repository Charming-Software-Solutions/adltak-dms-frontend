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
  expiration: z.coerce.date({
    required_error: "A date of expiration is required.",
  }),
  area: z.string().min(1, {
    message: "Area is required.",
  }),
  baReferenceNumber: z.string().min(1, {
    message: "BA reference number is required.",
  }),
});

export const employeeFormSchema = z.object({
  email: z.string().min(2, {
    message: "Email is required.",
  }),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  role: z.string().min(2, {
    message: "User role is required.",
  }),
  profile_image: z.union([z.instanceof(File), z.string()]).optional(),
});

export const distributionItemSchema = z.object({
  item: z.string().uuid({
    message: "Item is required.",
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
});

export const taskFormSchema = z.object({
  warehousePerson: z.string().uuid({
    message: "Warehouse person is required.",
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
  product: z.string().uuid({
    message: "Product is required.",
  }),
  area: z.string().min(1, {
    message: "Area is required.",
  }),
  baReferenceNumber: z.string().min(1, {
    message: "BA reference number is required.",
  }),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
export type DistributionFormData = z.infer<typeof distributionFormSchema>;
export type DistributionItemFormData = z.infer<typeof distributionItemSchema>;
export type TaskFormData = z.infer<typeof taskFormSchema>;
export type AssetFormData = z.infer<typeof assetFormSchema>;
