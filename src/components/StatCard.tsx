import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

/**
 * A compact KPI tile used on the dashboard. `trend` is purely decorative
 * (static, for-show copy) — it never drives navigation or state.
 */
export function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
}) {
  const trendColor =
    trend === "up" ? "success.main" : trend === "down" ? "error.main" : "text.secondary";
  const trendGlyph = trend === "up" ? "\u25B2" : trend === "down" ? "\u25BC" : "\u2022";

  return (
    <Card sx={{ height: "100%" }} variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary" variant="overline">
            {label}
          </Typography>
          {icon ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                bgcolor: "primary.main",
                borderRadius: "50%",
                color: "primary.contrastText",
                height: 32,
                width: 32,
              }}
            >
              {icon}
            </Stack>
          ) : null}
        </Stack>
        <Typography sx={{ mt: 0.5 }} variant="h4">
          {value}
        </Typography>
        {trendLabel ? (
          <Typography color={trendColor} sx={{ mt: 0.5 }} variant="body2">
            {trendGlyph} {trendLabel}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
