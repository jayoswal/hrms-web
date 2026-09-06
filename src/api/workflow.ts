import type { components } from "./generated/workflow";
import { baseApi } from "./baseApi";

export type Approval = components["schemas"]["Approval"];
export type ApprovalList = components["schemas"]["ApprovalList"];
export type ApprovalDecisionInput = components["schemas"]["ApprovalDecisionInput"];
export type Policy = components["schemas"]["Policy"];
export type PolicyList = components["schemas"]["PolicyList"];

export const workflowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listApprovals: builder.query<ApprovalList, { status?: string } | void>({
      query: (args) => ({
        url: "/api/v1/approvals",
        params: args?.status ? { status: args.status } : undefined,
      }),
      providesTags: (result) => [
        "Approval",
        ...(result?.items.map(({ id }) => ({ type: "Approval" as const, id })) ?? []),
      ],
    }),
    getApproval: builder.query<Approval, string>({
      query: (id) => `/api/v1/approvals/${id}`,
      providesTags: (_, __, id) => [{ type: "Approval", id }],
    }),
    decideApproval: builder.mutation<
      Approval,
      { id: string; body: ApprovalDecisionInput }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/approvals/${id}/decision`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Approval", id }, "Approval"],
    }),
    listPolicies: builder.query<PolicyList, void>({
      query: () => "/api/v1/workflow/policies",
    }),
  }),
});

export const {
  useListApprovalsQuery,
  useGetApprovalQuery,
  useDecideApprovalMutation,
  useListPoliciesQuery,
} = workflowApi;
