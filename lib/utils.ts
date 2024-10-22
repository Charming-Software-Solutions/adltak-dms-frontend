import { TaskStatusEnum } from "@/enums";
import { ErrorResponse } from "@/types/api";
import { ApiResponse } from "@/types/api";
import { Product, ProductSKU } from "@/types/product";
import { User, UserRoleBooleans } from "@/types/user";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const HTTP_METHODS = ["POST", "GET", "PUT", "PATCH", "DELETE"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];
const CONTENT_TYPES = [
  "application/json",
  "application/xml",
  "application/xhtml+xml",
  "application/javascript",
  "application/pdf",
  "application/ld+json",
  "application/octet-stream",
  "application/ogg",
  "application/soap+xml",
  "application/x-www-form-urlencoded",
  "application/zip",
  "application/graphql",
  "audio/mpeg",
  "audio/ogg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "multipart/form-data",
  "text/html",
  "text/plain",
  "text/css",
  "text/csv",
  "text/javascript",
  "text/xml",
] as const;
type ContentType = (typeof CONTENT_TYPES)[number];

export async function fetchAndHandleResponse<T>({
  url,
  method,
  contentType,
  jwt,
  body,
}: {
  url: string;
  method: HttpMethod;
  contentType?: ContentType;
  jwt?: string;
  body?: any;
}): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {};

    if (jwt) {
      headers["Authorization"] = `Bearer ${jwt}`;
    }

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    const requestOptions: RequestInit = {
      cache: "no-store",
      method,
      headers,
      body,
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      return { data: null, errors: errorData };
    }
    const data: T = await response.json();

    return { data, errors: null };
  } catch (error: any) {
    return { data: null, errors: { general: [error.message] } };
  }
}

function getStringSubstring(string: string, range: number): string {
  return string.substring(0, range - 1);
}

// export function generateProductSku(product: Product): string {
//   const separator = "-";
//   const charCount = 3;
//
//   const productName = getStringSubstring(product.name, charCount);
//   const productBrand = getStringSubstring(product.brand.name, charCount);
//   const productCategory = getStringSubstring(product.category.name, charCount);
//   const productType = getStringSubstring(product.type.name, charCount);
//
//   return `${productName}${separator}${productBrand}${separator}${productCategory}${separator}${productType}`;
// }

export function getUserRoleBooleans(selectedRole: string): UserRoleBooleans {
  return {
    is_staff: false,
    is_warehouse: selectedRole === "is_warehouse",
    is_project: selectedRole === "is_project",
    is_logistics: selectedRole === "is_logistics",
  };
}

export function formatUserRole(rawRole: string): string {
  if (rawRole == "") {
    return "Admin";
  }

  return rawRole
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatTaskStatus(status: TaskStatusEnum): string {
  return status
    .replace(/_/g, " ") // Replace underscores with spaces
    .split(" ") // Split the string into words
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    ) // Capitalize the first letter of each word
    .join(" "); // Join the words back together
}

export function formatDateTime(
  dateTime: any,
  includeTime: boolean = false,
): string {
  const dateObject = new Date(dateTime);

  const formattedDate =
    (dateObject.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    dateObject.getDate().toString().padStart(2, "0") +
    "-" +
    dateObject.getFullYear();

  if (!includeTime) {
    return formattedDate;
  }

  const formattedTime =
    dateObject.getHours().toString().padStart(2, "0") +
    ":" +
    dateObject.getMinutes().toString().padStart(2, "0") +
    ":" +
    dateObject.getSeconds().toString().padStart(2, "0");

  return `${formattedDate} ${formattedTime}`;
}

export function generateProductSKU(skuFormat: ProductSKU): string {
  const namePart = skuFormat.name.substring(0, 3).toUpperCase(); // First 3 characters of the product name
  const categoryPart = skuFormat.category.substring(0, 2).toUpperCase(); // First 2 characters of the category
  const typePart = skuFormat.type.substring(0, 2).toUpperCase(); // First 2 characters of the type

  return `${namePart}-${categoryPart}-${typePart}`;
}
