import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { signOut } from "../features/auth/authSlice";

interface AuthStateShape {
  auth: {
    token: string | null;
  };
}

const baseUrl = typeof window === "undefined" ? "http://localhost" : window.location.origin;

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as AuthStateShape;
    if (state.auth.token) {
      headers.set("Authorization", `Bearer ${state.auth.token}`);
    }
    headers.set("X-Correlation-Id", crypto.randomUUID());
    return headers;
  },
});

const authenticatedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(signOut());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: authenticatedBaseQuery,
  tagTypes: ["Timesheet", "ExpenseReport", "Approval"],
  endpoints: () => ({}),
});
