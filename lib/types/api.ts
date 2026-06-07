/** Backend role values — normalize with `normalizeRole()`. */
export type UserRole = "user" | "admin" | "superadmin" | (string & {});

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  img?: string;
  profileImage?: string;
}

export interface Category {
  id: number | string;
  slug: string;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  img: string;
  rate: string;
  quantity: string;
  logo: string;
  Description: string;
  categorySlug: string;
}

export type ProductCore = Omit<Product, "categorySlug">;

export interface Review {
  id: number | string;
  productId: number;
  userId?: number | string;
  userName?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}
