export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  stock: number | null;
  limited: boolean;
  discount: boolean;
  discountText: string | null;
}
