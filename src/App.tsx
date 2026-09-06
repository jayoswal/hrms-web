import { CssBaseline, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage } from "./features/auth/LoginPage";
import { AppShell } from "./features/shell/AppShell";
import type { RootState } from "./store";
import { theme } from "./theme";

export function App() {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate replace to="/" /> : <LoginPage />}
        />
        <Route
          path="/*"
          element={token ? <AppShell /> : <Navigate replace to="/login" />}
        />
      </Routes>
    </ThemeProvider>
  );
}

