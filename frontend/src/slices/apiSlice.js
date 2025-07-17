import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

// creating a base query function that sets the base URL for all API requests
const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

// creating an API slice using Redux Toolkit Query
export const apiSlice = createApi({
  // base query function used for all endpoints
  baseQuery,
  // defining tag types for cache invalidation and automatic refetching
  tagTypes: ["Product", "Order", "User"],
  // placeholder for defining endpoints (queries and mutations)
  endpoints: (builder) => ({}),
});
