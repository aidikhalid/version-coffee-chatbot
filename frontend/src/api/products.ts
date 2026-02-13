import axios from "../lib/axios";

export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  ingredients: string[];
  price: number;
  rating: number;
  image_path: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get("/products");
  return res.data.products;
};
