import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";

// Δημιουργία και ρύθμιση του Redux store
const store = configureStore({
  // Δήλωση των reducers που θα χρησιμοποιεί το store
  reducer: {
    // Καταχώρηση του API reducer με το όνομα του reducerPath από το apiSlice
    [apiSlice.reducerPath]: apiSlice.reducer,

    // Reducer για το καλάθι αγορών
    cart: cartSliceReducer,

    // Reducer για την αυθεντικοποίηση χρήστη
    auth: authSliceReducer,
  },

  // Προσθήκη του middleware του RTK Query στην προεπιλεγμένη λίστα middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  // Ενεργοποίηση των εργαλείων ανάπτυξης Redux (Redux DevTools)
  devTools: true,
});

export default store;
