export type Product = {
  id: string;
  sku: string;
  name: string;
  brand: Brand;
  category: Category;
  type: Type;
  description: string | null;
  thumbnail: string;
  status: string;
  stock: number;
  expiration: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Brand = {
  id: string;
  name: string;
};

export type Type = {
  id: string;
  name: string;
};

export type ProductSKU = {
  name: strin;
  category: string;
  type: string;
};

export type ProductClientProps = {
  brands: Brand[];
  categories: Category[];
  types: Type[];
};
