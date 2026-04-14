import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "@/lib/api/user/product-api";
import { factoryApi } from "@/lib/api/user/factory-api";
import { adminProductApi } from "@/lib/api/admin/admin-product-api";
import { adminFactoryApi } from "@/lib/api/admin/admin-factory-api";
import { categoryApi } from "@/lib/api/admin/admin-category-api";
import { userAuthApi } from "@/lib/api/auth/user-auth-api";
import { adminAuthApi } from "@/lib/api/auth/admin-auth-api";
import authReducer from "./auth-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [productApi.reducerPath]: productApi.reducer,
      [factoryApi.reducerPath]: factoryApi.reducer,
      [adminProductApi.reducerPath]: adminProductApi.reducer,
      [adminFactoryApi.reducerPath]: adminFactoryApi.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [userAuthApi.reducerPath]: userAuthApi.reducer,
      [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        productApi.middleware,
        factoryApi.middleware,
        adminProductApi.middleware,
        adminFactoryApi.middleware,
        categoryApi.middleware,
        userAuthApi.middleware,
        adminAuthApi.middleware,
      ]),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
