import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

// Επέκταση του βασικού apiSlice με endpoints για προϊόντα
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Λήψη όλων των προϊόντων, με προαιρετικά φίλτρα για λέξη-κλειδί και αριθμό σελίδας
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL, // π.χ. '/api/products'
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["Products"], // tag για αυτόματη invalidation cache
      keepUnusedDataFor: 5, // κρατάει τα δεδομένα στο cache 5 δευτερόλεπτα μετά τη χρήση
    }),

    // Λήψη λεπτομερειών για ένα συγκεκριμένο προϊόν με βάση το productId
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`, // π.χ. '/api/products/123'
      }),
      keepUnusedDataFor: 5,
    }),

    // Δημιουργία νέου προϊόντος (POST /api/products)
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"], // invalidates για να ανανεωθούν τα προϊόντα
    }),

    // Ενημέρωση προϊόντος με βάση το productId (PUT /api/products/:id)
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    // Αποστολή εικόνας προϊόντος (POST /api/upload)
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data, // συνήθως FormData με την εικόνα
      }),
    }),

    // Διαγραφή προϊόντος με βάση το productId (DELETE /api/products/:id)
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
    }),

    // Δημιουργία νέας κριτικής για προϊόν (POST /api/products/:id/reviews)
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Λήψη top προϊόντων (GET /api/products/top)
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
      }),
      keepUnusedDataFor: 5,
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
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
