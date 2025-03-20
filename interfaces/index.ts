export interface ICreateProduct {
  sku: string;
  name: string;
  brand: string;
  category: string;
  type: string;
  stock: number;
}

export interface ICreateEmployee {
  name: string;
  user: {
    email: string;
    role: string;
  };
  profile_image: string | undefined;
}

export interface ICreateDistributionProduct {
  product: string;
  quantity: number;
}

export interface ICreateDistribution {
  employee: string;
  products: {
    product: string;
    quantity: number;
    expiration: string;
  }[];
  assets?: {
    asset: string;
    quantity: number;
  }[];
  ba_reference_number: string;
  type: string;
  status: string;
  client: string;
}

export interface ICreateTask {
  employee: string;
  distribution: string;
}

export interface ICreateAsset {
  name: string;
  code: string;
  type: string;
}
