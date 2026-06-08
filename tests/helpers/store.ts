import { configureStore } from "@reduxjs/toolkit";
import { adminAuthApi } from "@/lib/api/auth/admin-auth-api";
import { userAuthApi } from "@/lib/api/auth/user-auth-api";
import { adminProductApi } from "@/lib/api/admin/admin-product-api";
import { categoryApi } from "@/lib/api/admin/admin-category-api";
import { reviewApi } from "@/lib/api/review-api";
import authReducer from "@/lib/store/auth-slice";

export function createTestStore(preloadedAuth?: {
  token: string | null;
  user: ReturnType<typeof authReducer>["user"];
  isAuthenticated: boolean;
}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      [adminProductApi.reducerPath]: adminProductApi.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [userAuthApi.reducerPath]: userAuthApi.reducer,
      [adminAuthApi.reducerPath]: adminAuthApi.reducer,
      [reviewApi.reducerPath]: reviewApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        adminProductApi.middleware,
        categoryApi.middleware,
        userAuthApi.middleware,
        adminAuthApi.middleware,
        reviewApi.middleware
      ),
    preloadedState: preloadedAuth
      ? {
          auth: {
            token: preloadedAuth.token,
            user: preloadedAuth.user,
            isAuthenticated: preloadedAuth.isAuthenticated,
          },
        }
      : undefined,
  });
}

export type TestStore = ReturnType<typeof createTestStore>;
