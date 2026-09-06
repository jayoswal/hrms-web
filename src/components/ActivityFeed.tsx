import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { Avatar, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  kind: "approval" | "expense" | "time" | "employee";
};

const KIND_ICON: Record<ActivityItem["kind"], ReactNode> = {
  approval: <CheckCircleOutlineIcon fontSize="small" />,
  expense: <ReceiptLongOutlinedIcon fontSize="small" />,
  time: <ScheduleOutlinedIcon fontSize="small" />,
  employee: <PersonAddAltOutlinedIcon fontSize="small" />,
};

/**
 * A static, non-interactive activity feed used purely for visual "show"
 * content on the dashboard. Items are illustrative sample data, not backed
 * by any live API — clicking has no effect.
 */
export function ActivityFeed({ title, items }: { title: string; items: ActivityItem[] }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="subtitle1">
          {title}
        </Typography>
        <Stack divider={<Divider />} spacing={1.5} sx={{ mt: 1 }}>
          {items.map((item) => (
            <Stack direction="row" key={item.id} spacing={1.5}>
              <Avatar
                sx={{
                  bgcolor: "background.default",
                  color: "primary.main",
                  height: 32,
                  width: 32,
                }}
              >
                {KIND_ICON[item.kind]}
              </Avatar>
              <Stack spacing={0}>
                <Typography variant="body2">
                  <strong>{item.actor}</strong> {item.action}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {item.timestamp}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
