export interface ICreateProduct {
  sku: string;
  name: string;
  brand: string;
  category: string;
  type: string;
  area: string;
  discontinued: boolean;
}

export interface ICreateEmployee {
  name: string;
  user: {
    email: string;
    role: string;
  };
  profile_image: string | undefined;
}

export interface ICreateProjectProduct {
  product: string;
  quantity: number;
}

export interface ICreateProject {
  name: string;
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
