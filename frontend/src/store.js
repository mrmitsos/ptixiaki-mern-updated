import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";

// creating and configuring the Redux store
const store = configureStore({
  // registering reducers for the store
  reducer: {
    // dynamically assigning the reducer using the slice's reducerPath as the key
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
  },
  // adding the API middleware to the default middleware stack
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // enabling Redux DevTools for debugging
  devTools: true,
});

export default store;
