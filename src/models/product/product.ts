export interface ProductVariant {
  id: number;
  label: string;
  price: number;
  stock: number | null;
}

export interface ProductCategory {
  key: string;
  label: string;
}

export interface BasketItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface Product {
  id: number;
  name: string;
  price: number | null;
  unit: string;
  inter: number | null;
  image: string;
  hasStock: boolean;
  stock: number | null;
  limited: boolean;
  discount: boolean;
  discountText: string | null;
  hasVariants: boolean;
  variants: ProductVariant[];
  category: ProductCategory | null;
  isBasket: boolean;
  basketItems: BasketItem[];
}
