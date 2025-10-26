export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image_uri: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  quantity: number;
  price: number;
  image_uri: string | null;
}

export interface ProductUpdate extends ProductInput {
  id: number;
}