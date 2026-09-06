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
    <Box
      component="main"
      sx={{
        alignItems: "center",
        bgcolor: "background.default",
        display: "flex",
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
  );
}

