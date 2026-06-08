import { configureStore } from "@reduxjs/toolkit";
import { adminProductApi } from "@/lib/api/admin/admin-product-api";
import { categoryApi } from "@/lib/api/admin/admin-category-api";
import { userAuthApi } from "@/lib/api/auth/user-auth-api";
import { adminAuthApi } from "@/lib/api/auth/admin-auth-api";
import { reviewApi } from "@/lib/api/review-api";
import authReducer from "./auth-slice";

export const makeStore = () => {
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
      getDefaultMiddleware().concat([
        adminProductApi.middleware,
        categoryApi.middleware,
        userAuthApi.middleware,
        adminAuthApi.middleware,
        reviewApi.middleware,
      ]),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
