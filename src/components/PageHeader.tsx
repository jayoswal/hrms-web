import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

/**
 * Shared page-header layout: an overline eyebrow, an h1 title (required by
 * App.test.tsx for several routes), an optional description, and optional
 * trailing actions. Purely presentational — no behavioural change.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <Stack
      alignItems={{ sm: "center" }}
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      spacing={2}
    >
      <Box>
        {eyebrow ? (
          <Typography color="text.secondary" variant="overline">
            {eyebrow}
          </Typography>
        ) : null}
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
        {description ? (
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
            {description}
          </Typography>
        ) : null}
      </Box>
      {actions ? <Box>{actions}</Box> : null}
    </Stack>
  );
}
