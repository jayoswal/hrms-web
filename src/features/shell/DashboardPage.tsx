import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { useCurrentUserQuery } from "../../api/identity";
import { ActivityDataGrid, type ActivityRow } from "../../components/ActivityDataGrid";
import { PageHeader } from "../../components/PageHeader";
import { StatCard } from "../../components/StatCard";
import { StaticBarChart } from "../../components/StaticCharts";

// Static, illustrative-only content used to give the dashboard an
// enterprise "for show" feel. None of this drives navigation or state, and
// none of it replaces or hides the real employee data loaded above — the
// real timesheet/expense/approval data is still only ever shown on its own
// existing page. These numbers are not wired to any API.
const HEADCOUNT_TREND = [
  { label: "Apr", value: 128 },
  { label: "May", value: 134 },
  { label: "Jun", value: 141 },
  { label: "Jul", value: 145 },
  { label: "Aug", value: 152 },
  { label: "Sep", value: 158 },
];

const SAMPLE_ACTIVITY: ActivityRow[] = [
  {
    id: "sample-1",
    actor: "Grace Hopper",
    action: "Approved a timesheet for Ada Lovelace",
    timestamp: "Today · 09:14",
    kind: "Approval",
  },
  {
    id: "sample-2",
    actor: "Ada Lovelace",
    action: "Submitted an expense report for travel",
    timestamp: "Today · 08:52",
    kind: "Expense",
  },
  {
    id: "sample-3",
    actor: "Finance",
    action: "Flagged an overtime policy exception",
    timestamp: "Yesterday · 17:30",
    kind: "Time",
  },
  {
    id: "sample-4",
    actor: "HR Admin",
    action: "Provisioned a new employee record",
    timestamp: "Yesterday · 11:05",
    kind: "Employee",
  },
  {
    id: "sample-5",
    actor: "Grace Hopper",
    action: "Approved an expense report for office supplies",
    timestamp: "Yesterday · 10:12",
    kind: "Approval",
  },
  {
    id: "sample-6",
    actor: "Ada Lovelace",
    action: "Submitted a timesheet for last week",
    timestamp: "Mon · 16:40",
    kind: "Time",
  },
];

export function DashboardPage() {
  const { data: employee, isLoading, error } = useCurrentUserQuery();

  return (
    <Stack spacing={3}>
      {isLoading ? <CircularProgress aria-label="Loading employee profile" /> : null}
      {error ? <Alert severity="error">Unable to load your employee profile.</Alert> : null}
      {employee ? (
        <>
          <PageHeader
            description={`${employee.cost_center} · ${employee.roles.join(", ")}`}
            eyebrow="Employee workspace"
            title={`Welcome, ${employee.full_name}`}
          />
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12}>
              <StatCard
                icon={<ScheduleOutlinedIcon fontSize="small" />}
                label="PTO balance"
                trendLabel="See Time for your real balance"
                value={`${employee.pto_entitlement_days} days`}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <StatCard
                icon={<PendingActionsOutlinedIcon fontSize="small" />}
                label="Pending approvals"
                trend="flat"
                trendLabel="Sample data"
                value="4"
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <StatCard
                icon={<ReceiptLongOutlinedIcon fontSize="small" />}
                label="Open expense reports"
                trend="flat"
                trendLabel="Sample data"
                value="3"
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <StatCard
                icon={<TrendingUpOutlinedIcon fontSize="small" />}
                label="Headcount"
                trend="up"
                trendLabel="+4.1% vs last quarter · sample data"
                value="158"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={7} xs={12}>
              <StaticBarChart data={HEADCOUNT_TREND} title="Headcount growth (illustrative)" />
            </Grid>
            <Grid item md={5} xs={12}>
              <ActivityDataGrid rows={SAMPLE_ACTIVITY} title="Recent activity (illustrative)" />
            </Grid>
          </Grid>
          <Divider />
          <Box>
            <Typography color="text.secondary" variant="body2">
              <NotificationsNoneOutlinedIcon
                fontSize="inherit"
                sx={{ mr: 0.5, verticalAlign: "text-bottom" }}
              />
              Sample dashboard widgets above are static and for illustration only. Use the
              navigation on the left to work with your real timesheets, expenses, and approvals.
            </Typography>
          </Box>
        </>
      ) : null}
    </Stack>
  );
}

