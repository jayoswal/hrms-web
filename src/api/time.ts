import type { components } from "./generated/time";
import { baseApi } from "./baseApi";

export type Timesheet = components["schemas"]["Timesheet"];
export type TimesheetCreate = components["schemas"]["TimesheetCreate"];
export type TimesheetUpdate = components["schemas"]["TimesheetUpdate"];
export type TimeEntryInput = components["schemas"]["TimeEntryInput"];
export type TimesheetList = components["schemas"]["TimesheetList"];
export type PtoBalance = components["schemas"]["PtoBalance"];

export const timeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTimesheets: builder.query<TimesheetList, void>({
      query: () => "/api/v1/time/timesheets",
      providesTags: (result) => [
        "Timesheet",
        ...(result?.items.map(({ id }) => ({ type: "Timesheet" as const, id })) ?? []),
      ],
    }),
    createTimesheet: builder.mutation<Timesheet, TimesheetCreate>({
      query: (body) => ({
        url: "/api/v1/time/timesheets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Timesheet"],
    }),
    updateTimesheet: builder.mutation<
      Timesheet,
      { id: string; body: TimesheetUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/api/v1/time/timesheets/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Timesheet", id }, "Timesheet"],
    }),
    submitTimesheet: builder.mutation<Timesheet, string>({
      query: (id) => ({
        url: `/api/v1/time/timesheets/${id}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Timesheet", id }, "Timesheet"],
    }),
    ptoBalance: builder.query<PtoBalance, void>({
      query: () => "/api/v1/time/pto/balance",
    }),
  }),
});

export const {
  useListTimesheetsQuery,
  useCreateTimesheetMutation,
  useUpdateTimesheetMutation,
  useSubmitTimesheetMutation,
  usePtoBalanceQuery,
} = timeApi;
