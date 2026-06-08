/** Backend role values — normalize with `normalizeRole()`. */
export type UserRole = "user" | "admin" | "superadmin" | (string & {});

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string | null;
  /** @deprecated use profileImage */
  img?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
}

export interface Reviewer {
  name: string;
  profileImage?: string | null;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  rating: number;
  comment?: string | null;
  reviewer?: Reviewer;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number | string;
  description: string;
  minimumOrder: number;
  stock?: number | null;
  images?: string[];
  categoryId: string;
  category?: Category;
  reviews?: Review[];
}

export type CreateProductPayload = {
  name: string;
  price: number;
  description: string;
  minimumOrder: number;
  stock?: number;
  images?: string[];
  categoryId: string;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type CreateCategoryPayload = {
  name: string;
  description?: string;
  image?: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type CreateReviewPayload = {
  productId: string;
  rating: number;
  comment?: string;
};
