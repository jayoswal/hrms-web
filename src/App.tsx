import { Container, CssBaseline, Stack, Typography } from "@mui/material";

export function App() {
  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Stack spacing={2} sx={{ py: 8 }}>
          <Typography component="h1" variant="h2">
            Atlas HRMS
          </Typography>
          <Typography color="text.secondary">
            The local polyrepo estate is ready for P1 identity and authentication.
          </Typography>
        </Stack>
      </Container>
    </>
  );
}

