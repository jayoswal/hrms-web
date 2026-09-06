import type { components } from "./generated/expense";
import { baseApi } from "./baseApi";

export type Category = components["schemas"]["Category"];
export type ExpenseLineCreate = components["schemas"]["ExpenseLineCreate"];
export type ExpenseReport = components["schemas"]["ExpenseReport"];
export type ExpenseReportCreate = components["schemas"]["ExpenseReportCreate"];
export type ExpenseReportUpdate = components["schemas"]["ExpenseReportUpdate"];
export type ExpenseReportList = components["schemas"]["ExpenseReportList"];
export type ExpenseProfile = components["schemas"]["Profile"];

export const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query<Category[], void>({
      query: () => "/api/v1/expense/categories",
    }),
    listExpenseReports: builder.query<ExpenseReportList, void>({
      query: () => "/api/v1/expense/reports",
      providesTags: (result) => [
        "ExpenseReport",
        ...(result?.items.map(({ id }) => ({
          type: "ExpenseReport" as const,
          id,
        })) ?? []),
      ],
    }),
    createExpenseReport: builder.mutation<ExpenseReport, ExpenseReportCreate>({
      query: (body) => ({
        url: "/api/v1/expense/reports",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ExpenseReport"],
    }),
    updateExpenseReport: builder.mutation<
      ExpenseReport,
      { id: string; body: ExpenseReportUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/expense/reports/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "ExpenseReport", id },
        "ExpenseReport",
      ],
    }),
    addExpenseLine: builder.mutation<
      ExpenseReport,
      { id: string; body: ExpenseLineCreate }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/expense/reports/${id}/lines`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "ExpenseReport", id },
        "ExpenseReport",
      ],
    }),
    submitExpenseReport: builder.mutation<ExpenseReport, string>({
      query: (id) => ({
        url: `/api/v1/expense/reports/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "ExpenseReport", id },
        "ExpenseReport",
      ],
    }),
    getExpenseProfile: builder.query<ExpenseProfile, string>({
      query: (employeeId) => `/api/v1/expense/profiles/${employeeId}`,
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useListExpenseReportsQuery,
  useCreateExpenseReportMutation,
  useUpdateExpenseReportMutation,
  useAddExpenseLineMutation,
  useSubmitExpenseReportMutation,
  useGetExpenseProfileQuery,
} = expenseApi;
