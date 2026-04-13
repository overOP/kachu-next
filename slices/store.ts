import { configureStore } from '@reduxjs/toolkit'
import { productApi } from './ProductSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productApi.middleware),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
