import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Δημιουργία νέας παραγγελίας (POST /api/orders)
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
    }),

    // Λήψη λεπτομερειών παραγγελίας με βάση το ID (GET /api/orders/:orderId)
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5, // κρατάει τα δεδομένα στο cache για 5 δευτερόλεπτα μετά τη χρήση
    }),

    // Ενημέρωση πληρωμής παραγγελίας (PUT /api/orders/:orderId/pay)
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: { ...details },
      }),
    }),

    // Λήψη client ID για PayPal (GET /api/config/paypal)
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    // Λήψη των παραγγελιών του τρέχοντα χρήστη (GET /api/orders/mine)
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Λήψη όλων των παραγγελιών (για admin) (GET /api/orders)
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    // Ενημέρωση κατάστασης παράδοσης παραγγελίας (PUT /api/orders/:orderId/deliver)
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),
  }),
});

// Εξαγωγή hooks για χρήση στα components
export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
} = ordersApiSlice;
