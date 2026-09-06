import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
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
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
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
        }),
        { headers: { "Content-Type": "application/json" }, status: 200 },
      ),
    );

    renderApp();
    expect(
      await screen.findByRole("heading", { name: "Welcome, Ada Lovelace" }),
    ).toBeInTheDocument();
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
