import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";
import { identityApi, type CurrentUser } from "./api/identity";
import { signOut, TOKEN_STORAGE_KEY } from "./features/auth/authSlice";
import { makeStore } from "./store";

function token(payload: Record<string, unknown>): string {
  const encoded = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `header.${encoded}.signature`;
}

function renderApp() {
  return render(
    <Provider store={makeStore()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
  );
}

function persistEmployeeToken() {
  localStorage.setItem(
    TOKEN_STORAGE_KEY,
    token({
      sub: "10000000-0000-4000-8000-000000000002",
      roles: ["EMPLOYEE"],
      mgr: "10000000-0000-4000-8000-000000000001",
      email: "ada@atlas.dev",
      iat: 1,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  );
}

const currentEmployee = {
  id: "10000000-0000-4000-8000-000000000002",
  email: "ada@atlas.dev",
  full_name: "Ada Lovelace",
  grade: "IC4",
  cost_center: "CC-100",
  manager_id: "10000000-0000-4000-8000-000000000001",
  home_currency: "GBP",
  pto_entitlement_days: 22,
  status: "ACTIVE",
  roles: ["EMPLOYEE"],
  created_at: "2026-09-06T12:00:00Z",
  updated_at: "2026-09-06T12:00:00Z",
};

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, "", "/");
    vi.restoreAllMocks();
  });

  it("redirects an unauthenticated user to login", async () => {
    renderApp();
    expect(await screen.findByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  });

  it("renders the protected shell for a persisted session", async () => {
    persistEmployeeToken();
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(currentEmployee), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );

    renderApp();
    expect(
      await screen.findByRole("heading", { name: "Welcome, Ada Lovelace" }),
    ).toBeInTheDocument();
  });

  it("renders the timesheet workspace", async () => {
    persistEmployeeToken();
    window.history.replaceState({}, "", "/time");
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = input instanceof Request ? input.url : String(input);
      const body = url.includes("/identity/me")
        ? currentEmployee
        : url.includes("/pto/balance")
          ? {
              employee_id: currentEmployee.id,
              entitlement_days: 22,
              accrued_days: 0,
              taken_days: 0,
              pending_days: 0,
              balance_days: 22,
            }
          : { items: [], total: 0 };
      return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    });

    renderApp();
    expect(await screen.findByRole("heading", { name: "Timesheets" })).toBeInTheDocument();
    expect(await screen.findByText("22 days")).toBeInTheDocument();
    expect(await screen.findByText(/No timesheets yet/)).toBeInTheDocument();
  });

  it("saves edited timesheet entries before submitting", async () => {
    persistEmployeeToken();
    window.history.replaceState({}, "", "/time");
    const mutationRequests: Request[] = [];
    const timesheet = {
      id: "20000000-0000-4000-8000-000000000001",
      employee_id: currentEmployee.id,
      period_start: "2026-09-07",
      period_end: "2026-09-13",
      status: "DRAFT",
      total_hours: 8,
      overtime_hours: 0,
      entries: [
        {
          id: "30000000-0000-4000-8000-000000000001",
          work_date: "2026-09-07",
          hours: 8,
          project_code: "ATLAS",
          note: null,
        },
      ],
      created_at: "2026-09-07T12:00:00Z",
      updated_at: "2026-09-07T12:00:00Z",
    };
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const request = input instanceof Request ? input : new Request(input);
      const url = request.url;
      if (request.method !== "GET") {
        mutationRequests.push(request.clone());
      }
      const body = url.includes("/identity/me")
        ? currentEmployee
        : url.includes("/pto/balance")
          ? {
              employee_id: currentEmployee.id,
              entitlement_days: 22,
              accrued_days: 0,
              taken_days: 0,
              pending_days: 0,
              balance_days: 22,
            }
          : url.endsWith("/submit")
            ? { ...timesheet, status: "PENDING_APPROVAL", total_hours: 9 }
            : request.method === "PUT"
              ? { ...timesheet, total_hours: 9 }
              : { items: [timesheet], total: 1 };
      return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    });

    renderApp();
    const hours = await screen.findByRole("spinbutton", { name: "Hours" });
    fireEvent.change(hours, { target: { value: "9" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await vi.waitFor(() => expect(mutationRequests).toHaveLength(2));
    expect(mutationRequests.map(({ method }) => method)).toEqual(["PUT", "POST"]);
    await expect(mutationRequests[0]?.json()).resolves.toMatchObject({
      entries: [{ hours: 9 }],
    });
  });

  it("renders the expense workspace", async () => {
    persistEmployeeToken();
    window.history.replaceState({}, "", "/expenses");
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = input instanceof Request ? input.url : String(input);
      const body = url.includes("/identity/me")
        ? currentEmployee
        : url.includes("/categories")
          ? []
          : { items: [], total: 0 };
      return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    });

    renderApp();
    expect(
      await screen.findByRole("heading", { name: "Expense reports" }),
    ).toBeInTheDocument();
    expect(await screen.findByText(/No expense reports yet/)).toBeInTheDocument();
  });

  it("renders the approvals queue for a manager and lets them decide", async () => {
    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      token({
        sub: "10000000-0000-4000-8000-000000000001",
        roles: ["MANAGER"],
        mgr: null,
        email: "grace@atlas.dev",
        iat: 1,
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    );
    window.history.replaceState({}, "", "/approvals");
    const managerEmployee = {
      ...currentEmployee,
      id: "10000000-0000-4000-8000-000000000001",
      email: "grace@atlas.dev",
      full_name: "Grace Hopper",
      manager_id: null,
      roles: ["MANAGER"],
    };
    const approval = {
      id: "40000000-0000-4000-8000-000000000001",
      subject_type: "TIMESHEET",
      subject_id: "20000000-0000-4000-8000-000000000001",
      requester_id: "10000000-0000-4000-8000-000000000002",
      approver_id: managerEmployee.id,
      status: "PENDING",
      reason: null,
      policy_flags: [{ type: "OVERTIME_THRESHOLD", message: "Overtime of 45h exceeds cap." }],
      created_at: "2026-09-07T12:00:00Z",
      decided_at: null,
    };
    const mutationRequests: Request[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const request = input instanceof Request ? input : new Request(input);
      const url = request.url;
      if (request.method !== "GET") {
        mutationRequests.push(request.clone());
      }
      const body = url.includes("/identity/me")
        ? managerEmployee
        : url.includes("/decision")
          ? { ...approval, status: "APPROVED", decided_at: "2026-09-07T13:00:00Z" }
          : { items: [approval], total: 1 };
      return new Response(JSON.stringify(body), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    });

    renderApp();
    expect(await screen.findByRole("heading", { name: "Approvals" })).toBeInTheDocument();
    expect(await screen.findByText(/Overtime of 45h exceeds cap/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    await vi.waitFor(() => expect(mutationRequests).toHaveLength(1));
    expect(mutationRequests[0]?.method).toBe("POST");
    await expect(mutationRequests[0]?.json()).resolves.toMatchObject({ decision: "APPROVE" });
  });

  it("clears employee API cache on sign out", async () => {
    const store = makeStore();
    const employee: CurrentUser = {
      id: "10000000-0000-4000-8000-000000000002",
      email: "ada@atlas.dev",
      full_name: "Ada Lovelace",
      grade: "IC4",
      cost_center: "CC-100",
      manager_id: "10000000-0000-4000-8000-000000000001",
      home_currency: "GBP",
      pto_entitlement_days: 22,
      status: "ACTIVE",
      roles: ["EMPLOYEE"],
      created_at: "2026-09-06T12:00:00Z",
      updated_at: "2026-09-06T12:00:00Z",
    };
    await store.dispatch(
      identityApi.util.upsertQueryData("currentUser", undefined, employee),
    );
    expect(Object.keys(store.getState().api.queries)).toHaveLength(1);

    store.dispatch(signOut());
    await vi.waitFor(() => expect(Object.keys(store.getState().api.queries)).toHaveLength(0));
  });
});
