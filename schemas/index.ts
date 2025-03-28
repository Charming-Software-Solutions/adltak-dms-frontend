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
  area: z.string().min(1, {
    message: "Area is required.",
  }),
});

export const employeeFormSchema = z.object({
  email: z.string().min(2, {
    message: "Email is required.",
  }),
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  roles: z
    .array(
      z
        .string()
        .min(2, { message: "Each role must be at least 2 characters." }),
    )
    .min(1, {
      message: "At least one user role is required.",
    }),
  profile_image: z.union([z.instanceof(File), z.string()]).optional(),
  status: z.boolean({
    required_error: "Status is required.",
  }),
});

export const projectProductSchema = z.object({
  product: z.string().uuid({
    message: "Item is required.",
  }),
  quantity: z.coerce.number().positive({
    message: "Quantity must be a positive number.",
  }),
  expiration: z.coerce.date(),
});

export const projectFormSchema = z.object({
  name: z.string().min(1, {
    message: "Project name is required.",
  }),
  baReferenceNumber: z.string().min(1, {
    message: "BA reference number is required.",
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
  project: z.string().uuid({
    message: "Project is required.",
  }),
});

export const assetFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  stock: z.coerce.number().positive(),
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
});

export const classificationFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z
    .string()
    .max(255, {
      message: "Description should be only 255 characters long.",
    })
    .optional(),
  classificationType: z.string().optional(),
});

export const changeEmailFormSchema = z
  .object({
    newEmail: z.coerce.string().email(),
    confirmEmail: z.coerce.string().email(),
    password: z.string(),
  })
  .refine((data) => data.newEmail === data.confirmEmail, {
    message: "Emails don't match",
    path: ["confirmEmail"],
  });

export const changePasswordFormSchema = z
  .object({
    newPassword: z.string().min(6, {
      message: "Password length should be at least 6 characters.",
    }),
    confirmPassword: z.string(),
    currentPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: "Password length should be at least 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateProfileFormSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  profileImage: z.union([z.instanceof(File), z.string()]).optional(),
});

export const loginSchema = z.object({
  email: z.coerce.string().email(),
  password: z.string(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
export type EmployeeFormData = z.infer<typeof employeeFormSchema>;
export type ProjectFormData = z.infer<typeof projectFormSchema>;
export type ProjectProductFormdata = z.infer<typeof projectProductSchema>;
export type TaskFormData = z.infer<typeof taskFormSchema>;
export type AssetFormData = z.infer<typeof assetFormSchema>;
export type ClassificationFormData = z.infer<typeof classificationFormSchema>;
export type ChangeEmailFormData = z.infer<typeof changeEmailFormSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;
