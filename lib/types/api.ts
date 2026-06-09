/** Backend role values — normalize with `normalizeRole()`. */
export type UserRole = "user" | "admin" | "superadmin" | (string & {});

export type UserGender = "male" | "female" | "other" | (string & {});

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string | null;
  /** @deprecated use profileImage */
  img?: string;
  phone?: string | null;
  /** Backend alias for phone on some responses */
  number?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: UserGender | null;
  createdAt?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  isActive?: boolean;
  products?: Product[];
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
  user?: Reviewer;
  product?: { id: string; name: string };
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
  isActive?: boolean;
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

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  isActive?: boolean;
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
  image?: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload> & {
  isActive?: boolean;
};

export type UpdateUserPayload = {
  name?: string;
  email?: string;
  phone?: string;
  number?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: UserGender;
  profileImage?: string;
  role?: UserRole;
};

export type CreateReviewPayload = {
  productId: string;
  rating: number;
  comment?: string;
};
