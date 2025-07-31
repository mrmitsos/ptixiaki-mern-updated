import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

// Επέκταση του apiSlice με endpoints που αφορούν τα προϊόντα
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Δημιουργία endpoint για λήψη όλων των προϊόντων
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL, // Π.χ. '/api/products'
      }),
      providesTags: ["Products"],
      keepUnusedDataFor: 5, // Κρατά τα δεδομένα cache για 5 δευτερόλεπτα αν δεν χρησιμοποιούνται
    }),

    // Δημιουργία endpoint για λήψη λεπτομερειών ενός προϊόντος με βάση το ID
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`, // Π.χ. '/api/products/123'
      }),
      keepUnusedDataFor: 5, // Κρατά επίσης το αποτέλεσμα προσωρινά στην cache
    }),

    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
} = productsApiSlice;
