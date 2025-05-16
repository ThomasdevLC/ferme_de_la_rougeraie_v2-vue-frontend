export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  inter: number | null;
  image: string;
  stock: number | null;
  limited: boolean;
  discount: boolean;
  discountText: string | null;
}
