import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { type ApiError, useLoginMutation } from "../../api/identity";
import { setCredentials } from "./authSlice";

function errorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return "Unable to reach the identity service.";
  }
  const data = error.data as ApiError | undefined;
  return data?.error.message ?? "Sign-in failed.";
}

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const [email, setEmail] = useState("ada@atlas.dev");
  const [password, setPassword] = useState("atlas");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await login({ email, password }).unwrap();
    dispatch(setCredentials(result.token));
    navigate("/", { replace: true });
  }

  return (
    <Stack direction={{ md: "row", xs: "column" }} sx={{ minHeight: "100vh" }}>
      <Stack
        spacing={4}
        sx={{
          background:
            "linear-gradient(135deg, #16233B 0%, #2B4C7E 55%, #0EA5A0 130%)",
          color: "#FFFFFF",
          display: { md: "flex", xs: "none" },
          flex: 1,
          justifyContent: "space-between",
          p: 6,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={1.5}>
          <Box
            sx={{
              alignItems: "center",
              bgcolor: "rgba(255,255,255,0.16)",
              borderRadius: 1.5,
              display: "flex",
              fontWeight: 800,
              height: 36,
              justifyContent: "center",
              width: 36,
            }}
          >
            A
          </Box>
          <Typography fontWeight={800} letterSpacing="0.04em" variant="h6">
            ATLAS HRMS
          </Typography>
        </Stack>
        <Stack spacing={2} sx={{ maxWidth: 440 }}>
          <Typography variant="h3">
            Human resources, streamlined for the whole company.
          </Typography>
          <Typography sx={{ opacity: 0.85 }} variant="body1">
            Timesheets, expense reports, and approval workflows for employees, managers,
            finance, and HR — all in one place.
          </Typography>
        </Stack>
        <Typography sx={{ opacity: 0.65 }} variant="caption">
          Atlas HRMS · Local development environment
        </Typography>
      </Stack>
      <Box
        component="main"
        sx={{
          alignItems: "center",
          bgcolor: "background.default",
          display: "flex",
          flex: 1,
          minHeight: "100vh",
          px: 2,
        }}
      >
        <Paper
          component="form"
          elevation={0}
          onSubmit={(event) => void submit(event)}
          sx={{ border: 1, borderColor: "divider", mx: "auto", p: 4, width: 420 }}
        >
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography color="primary" fontWeight={700} variant="overline">
                Atlas HRMS
              </Typography>
              <Typography component="h1" variant="h4">
                Sign in
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Use your local Atlas employee account.
              </Typography>
            </Stack>
            {error ? <Alert severity="error">{errorMessage(error)}</Alert> : null}
            <TextField
              autoComplete="email"
              label="Email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
            <TextField
              autoComplete="current-password"
              label="Password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
            <Button disabled={isLoading} size="large" type="submit" variant="contained">
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}


