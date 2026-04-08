import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./productSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      // reducer as a specific top-level slice
      [productApi.reducerPath]: productApi.reducer,
    },
    // api middleware enables caching, invalidation, polling,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
