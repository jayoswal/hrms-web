import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const TOKEN_STORAGE_KEY = "atlas.auth.token";

export interface JwtClaims {
  sub: string;
  roles: string[];
  mgr: string | null;
  email: string;
  exp: number;
  iat: number;
}

export interface AuthState {
  token: string | null;
  claims: JwtClaims | null;
}

const initialState: AuthState = {
  token: null,
  claims: null,
};

function isClaims(value: unknown): value is JwtClaims {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const claims = value as Record<string, unknown>;
  return (
    typeof claims.sub === "string" &&
    typeof claims.email === "string" &&
    Array.isArray(claims.roles) &&
    claims.roles.every((role) => typeof role === "string") &&
    (claims.mgr === null || typeof claims.mgr === "string") &&
    typeof claims.exp === "number" &&
    typeof claims.iat === "number"
  );
}

export function decodeToken(token: string): JwtClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded: unknown = JSON.parse(atob(base64));
    return isClaims(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

export function persistedAuthState(): AuthState {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const claims = token ? decodeToken(token) : null;
  if (!token || !claims || claims.exp * 1000 <= Date.now()) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return initialState;
  }
  return { token, claims };
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<string>) => {
      const claims = decodeToken(action.payload);
      if (!claims) {
        return;
      }
      state.token = action.payload;
      state.claims = claims;
      localStorage.setItem(TOKEN_STORAGE_KEY, action.payload);
    },
    signOut: (state) => {
      state.token = null;
      state.claims = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    },
  },
});

export const { setCredentials, signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;

