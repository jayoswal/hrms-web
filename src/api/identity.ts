import type { components } from "./generated/identity";
import { baseApi } from "./baseApi";

export type LoginRequest = components["schemas"]["LoginRequest"];
export type TokenResponse = components["schemas"]["TokenResponse"];
export type CurrentUser = components["schemas"]["CurrentUser"];
export type ApiError = components["schemas"]["ErrorResponse"];

export const identityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (body) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body,
      }),
    }),
    currentUser: builder.query<CurrentUser, void>({
      query: () => "/api/v1/identity/me",
    }),
  }),
});

export const { useLoginMutation, useCurrentUserQuery } = identityApi;

