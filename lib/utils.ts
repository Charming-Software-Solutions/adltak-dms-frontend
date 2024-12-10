import { FormModeEnum } from "@/enums";
import { ApiResponse, ErrorResponse } from "@/types/api";
import { DistributionProduct } from "@/types/distribution";
import { SelectItemType } from "@/types/primitives";
import { Product, ProductSKU } from "@/types/product";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { toast } from "sonner";
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

export function formatUserRole(rawRole: string): string {
  if (rawRole === "admin") {
    return "Admin";
  }

  return rawRole
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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

export function filterDataTable<T>(
  items: T[],
  query: (item: T) => boolean,
): T[] {
  return items.filter(query);
}

export function toPSTDate(date: Date | null | undefined): Date | undefined {
  return date ? new Date(date.getTime() + 8 * 60 * 60 * 1000) : undefined;
}

export function monthsFromNow(date: Date, n: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + n);
  return result;
}

export function formatFilterValue(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("FileReader result is not a string."));
      }
    };

    reader.onerror = () => {
      reject(new Error("FileReader encountered an error."));
    };

    reader.readAsDataURL(file);
  });
};

export function filterProductsByExpiration(products: DistributionProduct[]): {
  nearExpiration: DistributionProduct[];
  expired: DistributionProduct[];
} {
  const currentDate = new Date();

  const nextMonthDate = new Date(currentDate);
  nextMonthDate.setMonth(currentDate.getMonth() + 1);

  const nearExpiration: DistributionProduct[] = [];
  const expired: DistributionProduct[] = [];

  products.forEach((product) => {
    const productExpiration = new Date(product.expiration);

    if (productExpiration <= currentDate) {
      expired.push(product);
    } else if (
      productExpiration >= currentDate &&
      productExpiration <= nextMonthDate
    ) {
      nearExpiration.push(product);
    }
  });

  return { nearExpiration, expired };
}

export function convertRecordsToArray(
  record: Record<string, string>,
): SelectItemType[] {
  return Object.entries(record).map(([key, label]) => ({
    label,
    value: key,
  }));
}

export function showSuccessMessage(mode: FormModeEnum, object: string) {
  if (mode === FormModeEnum.CREATE) {
    toast.success(`Successfully created ${object}.`, {
      position: "top-center",
    });
  } else {
    toast.success(`Successfully updated ${object}.`, {
      position: "top-center",
    });
  }
}

export function formatExpiration(expiration: string): string {
  return format(new Date(expiration), "ddMMMyyyy").toUpperCase();
}
