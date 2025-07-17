import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

// Επέκταση του apiSlice με endpoints που αφορούν τα προϊόντα
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Δημιουργία endpoint για λήψη όλων των προϊόντων
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL, // Π.χ. '/api/products'
      }),
      keepUnusedDataFor: 5, // Κρατά τα δεδομένα cache για 5 δευτερόλεπτα αν δεν χρησιμοποιούνται
    }),

    // Δημιουργία endpoint για λήψη λεπτομερειών ενός προϊόντος με βάση το ID
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`, // Π.χ. '/api/products/123'
      }),
      keepUnusedDataFor: 5, // Κρατά επίσης το αποτέλεσμα προσωρινά στην cache
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } =
  productsApiSlice;
