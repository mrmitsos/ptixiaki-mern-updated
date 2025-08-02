import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

// Επέκταση του βασικού apiSlice με endpoints για διαχείριση χρηστών
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login χρήστη (POST /api/users/auth)
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    // Εγγραφή νέου χρήστη (POST /api/users)
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // Logout χρήστη (POST /api/users/logout)
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    // Ενημέρωση προφίλ χρήστη (PUT /api/users/profile)
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    // Λήψη λίστας χρηστών (GET /api/users)
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ["Users"], // tag για cache invalidation
      keepUnusedDataFor: 5, // κρατάει τα δεδομένα στο cache 5 δευτερόλεπτα
    }),
    // Διαγραφή χρήστη με βάση το userId (DELETE /api/users/:id)
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    // Λήψη λεπτομερειών χρήστη (GET /api/users/:id)
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    // Ενημέρωση χρήστη με βάση το userId (PUT /api/users/:id)
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"], // invalidates ώστε να ανανεωθεί η λίστα
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = usersApiSlice;
