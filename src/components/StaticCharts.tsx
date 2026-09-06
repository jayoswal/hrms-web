import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

/**
 * A purely decorative, static bar chart rendered with plain <div>s (no
 * charting dependency added). Data is illustrative "for show" content only —
 * it does not represent live figures and is not wired to any API.
 */
export function StaticBarChart({
  title,
  data,
}: {
  title: string;
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="subtitle1">
          {title}
        </Typography>
        <Stack alignItems="flex-end" direction="row" spacing={1.5} sx={{ height: 160, mt: 2 }}>
          {data.map((point) => (
            <Stack alignItems="center" flex={1} key={point.label} spacing={0.5}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  borderRadius: 1,
                  height: `${Math.max((point.value / max) * 120, 4)}px`,
                  opacity: 0.85,
                  transition: "height 0.3s ease",
                  width: "100%",
                }}
              />
              <Typography color="text.secondary" variant="caption">
                {point.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * A purely decorative sparkline rendered with an inline SVG polyline. Static
 * illustrative data only.
 */
export function Sparkline({ points, color = "#2B4C7E" }: { points: number[]; color?: string }) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const width = 120;
  const height = 36;
  const step = width / Math.max(points.length - 1, 1);
  const coords = points
    .map((point, index) => `${index * step},${height - ((point - min) / range) * height}`)
    .join(" ");

  return (
    <svg height={height} role="presentation" width={width}>
      <polyline fill="none" points={coords} stroke={color} strokeWidth={2} />
    </svg>
  );
}
