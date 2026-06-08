import type { Category, Product, Review, User } from "@/lib/types/api";

export const mockUser: User = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  role: "user",
};

export const mockAdmin: User = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
};

export const mockSuperadmin: User = {
  id: "super-1",
  name: "Super Admin",
  email: "super@example.com",
  role: "superadmin",
};

export const mockCategory: Category = {
  id: "cat-1",
  name: "Electronics",
  description: "Gadgets and devices",
  image: "https://example.com/cat.jpg",
};

export const mockProduct: Product = {
  id: "prod-1",
  name: "Wireless Earbuds",
  price: 2500,
  description: "High quality wireless earbuds with noise cancellation",
  minimumOrder: 10,
  stock: 100,
  images: ["https://example.com/earbuds.jpg"],
  categoryId: "cat-1",
  category: mockCategory,
  reviews: [
    {
      id: "rev-1",
      productId: "prod-1",
      userId: "user-1",
      rating: 4,
      comment: "Great product",
      reviewer: { name: "Alice" },
    },
    {
      id: "rev-2",
      productId: "prod-1",
      userId: "user-2",
      rating: 5,
      comment: "Excellent",
      reviewer: { name: "Bob" },
    },
  ],
};

export const mockProductTwo: Product = {
  id: "prod-2",
  name: "USB Cable",
  price: "NPR 150",
  description: "Durable USB-C cable",
  minimumOrder: 1,
  stock: 50,
  images: [],
  categoryId: "cat-1",
  category: mockCategory,
};

export const mockProductOtherCategory: Product = {
  id: "prod-3",
  name: "Notebook",
  price: 120,
  description: "Spiral notebook",
  minimumOrder: 5,
  categoryId: "cat-2",
};

export const mockReview: Review = {
  id: "rev-1",
  productId: "prod-1",
  userId: "user-1",
  rating: 5,
  comment: "Loved it",
  reviewer: { name: "Alice", profileImage: null },
  createdAt: "2025-01-01T00:00:00Z",
};
