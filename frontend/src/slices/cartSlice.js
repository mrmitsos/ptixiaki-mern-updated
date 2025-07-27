import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

// Αρχικό state του cart. Αν υπάρχει στο localStorage, το διαβάζουμε, αλλιώς ξεκινάμε με άδειο καλάθι.
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

// Δημιουργία slice για το καλάθι (cart)
const cartSlice = createSlice({
  name: "cart", // Όνομα του slice
  initialState, // Αρχική τιμή του state
  reducers: {
    // Προσθήκη ή ενημέρωση προϊόντος στο καλάθι
    addToCart: (state, action) => {
      const item = action.payload; // Το προϊόν που θέλουμε να προσθέσουμε

      // Ελέγχουμε αν το προϊόν υπάρχει ήδη στο καλάθι (με βάση το _id)
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Αν υπάρχει, το αντικαθιστούμε με το νέο (π.χ. αλλαγή ποσότητας)
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // Αν δεν υπάρχει, το προσθέτουμε στο καλάθι
        state.cartItems = [...state.cartItems, item];
      }

      // Ενημέρωση (π.χ. του localStorage) μέσω της συνάρτησης updateCart
      return updateCart(state);
    },

    // Αφαίρεση προϊόντος από το καλάθι
    removeFromCart: (state, action) => {
      // Φιλτράρουμε και κρατάμε μόνο όσα προϊόντα ΔΕΝ έχουν το _id που δόθηκε
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      // Ενημέρωση του state ή του localStorage
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
