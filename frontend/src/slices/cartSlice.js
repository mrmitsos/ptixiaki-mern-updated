import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

// Αρχικό state του καλάθιου. Αν υπάρχει αποθηκευμένο στο localStorage, το φορτώνουμε, αλλιώς ξεκινάμε με κενό καλάθι.
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

// Δημιουργία slice για τη διαχείριση του καλάθιου
const cartSlice = createSlice({
  name: "cart", // Όνομα slice
  initialState, // Αρχική κατάσταση
  reducers: {
    // Προσθήκη ή ενημέρωση προϊόντος στο καλάθι
    addToCart: (state, action) => {
      const item = action.payload; // Το προϊόν προς προσθήκη/ενημέρωση

      // Ελέγχουμε αν το προϊόν υπάρχει ήδη με βάση το _id
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Αν υπάρχει, αντικαθιστούμε το παλιό με το νέο (π.χ. για να αλλάξει ποσότητα)
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // Αν δεν υπάρχει, προσθέτουμε το νέο προϊόν στο καλάθι
        state.cartItems = [...state.cartItems, item];
      }

      // Καλούμε τη βοηθητική updateCart για ενημέρωση των τιμών και αποθήκευση στο localStorage
      return updateCart(state);
    },

    // Αφαίρεση προϊόντος από το καλάθι
    removeFromCart: (state, action) => {
      // Φιλτράρουμε τα προϊόντα κρατώντας μόνο αυτά που ΔΕΝ έχουν το δοθέν _id
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      // Ενημέρωση μέσω της updateCart
      return updateCart(state);
    },

    // Αποθήκευση της διεύθυνσης αποστολής
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    // Αποθήκευση της μεθόδου πληρωμής
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    // Καθαρισμός του καλάθιου (π.χ. μετά από ολοκλήρωση παραγγελίας)
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
    resetCart: (state) => (state = initialState),
  },
});

// Εξαγωγή των actions για χρήση στις components
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

// Εξαγωγή του reducer για το store
export default cartSlice.reducer;
