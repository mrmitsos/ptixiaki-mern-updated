import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

// Δημιουργία βασικής query function που ορίζει τη βασική διεύθυνση URL για όλα τα API αιτήματα
const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

// Δημιουργία ενός API slice χρησιμοποιώντας το Redux Toolkit Query
export const apiSlice = createApi({
  // Χρήση της baseQuery για όλα τα endpoints (αιτήματα)
  baseQuery,
  // Ορισμός τύπων tags για τη διαχείριση cache (ανανέωση δεδομένων όταν αλλάζουν)
  tagTypes: ["Product", "Order", "User"],
  // Εδώ θα δηλωθούν όλα τα endpoints (queries και mutations)
  endpoints: (builder) => ({}),
});
