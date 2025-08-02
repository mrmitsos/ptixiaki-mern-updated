import { createSlice } from "@reduxjs/toolkit";

// Αρχική κατάσταση: προσπαθούμε να φορτώσουμε τα userInfo από το localStorage, αν υπάρχουν
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth", // Όνομα slice
  initialState, // Αρχική κατάσταση
  reducers: {
    // Μέθοδος για να αποθηκεύσουμε τα credentials (π.χ. μετά το login)
    setCredentials: (state, action) => {
      state.userInfo = action.payload; // Αποθηκεύουμε τα δεδομένα χρήστη στο state
      localStorage.setItem("userInfo", JSON.stringify(action.payload)); // Αποθηκεύουμε και στο localStorage
    },
    // Μέθοδος για αποσύνδεση χρήστη (logout)
    logout: (state, action) => {
      state.userInfo = null; // Καθαρίζουμε το userInfo στο state
      localStorage.removeItem("userInfo"); // Καθαρίζουμε το localStorage
    },
  },
});

// Εξάγουμε τις ενέργειες (actions) για χρήση από άλλα μέρη της εφαρμογής
export const { setCredentials, logout } = authSlice.actions;

// Εξάγουμε το reducer για να το προσθέσουμε στο store
export default authSlice.reducer;
