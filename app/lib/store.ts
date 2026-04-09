import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./User/productSlice";
import { factoryApi } from "./User/factorySlice";
import { adminProductApi } from "./Admin/adminProductSlice";
import { adminFactoryApi } from "./Admin/adminFactorySlice";
import { categoryApi } from "./Admin/adminCategorySlice";
import { userAuthApi } from "./Auth/useAurh";
import { adminAuthApi } from "./Auth/adminAuth";
import authReducer from "./Auth/stateAuth";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth:authReducer,
      // reducer as a specific top-level slice
      [productApi.reducerPath]: productApi.reducer,
      [factoryApi.reducerPath]:factoryApi.reducer,
      [adminProductApi.reducerPath]:adminProductApi.reducer,
      [adminFactoryApi.reducerPath]:adminFactoryApi.reducer,
      [categoryApi.reducerPath]:categoryApi.reducer,
      [userAuthApi.reducerPath ]:userAuthApi.reducer,
      [adminAuthApi.reducerPath]:adminAuthApi.reducer,
    },
    // api middleware enables caching, invalidation
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        // user
        productApi.middleware,
        factoryApi.middleware,

        // admin 
        adminProductApi.middleware,
        adminFactoryApi.middleware,
        categoryApi.middleware
      ]
      ),
    
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
