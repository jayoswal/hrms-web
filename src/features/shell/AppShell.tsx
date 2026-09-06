import ApprovalOutlinedIcon from "@mui/icons-material/ApprovalOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, type MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes, useLocation } from "react-router-dom";

import type { RootState } from "../../store";
import { CreateEmployeePage } from "../admin/CreateEmployeePage";
import { signOut } from "../auth/authSlice";
import { ExpensePage } from "../expense/ExpensePage";
import { TimePage } from "../time/TimePage";
import { ApprovalsPage } from "../workflow/ApprovalsPage";
import { DashboardPage } from "./DashboardPage";

const drawerWidth = 248;

function initials(name: string | undefined): string {
  if (!name) {
    return "?";
  }
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppShell() {
  const dispatch = useDispatch();
  const location = useLocation();
  const claims = useSelector((state: RootState) => state.auth.claims);
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<HTMLElement | null>(null);

  const openUserMenu = (event: MouseEvent<HTMLElement>) => setUserMenuAnchor(event.currentTarget);
  const closeUserMenu = () => setUserMenuAnchor(null);
  const openNotifications = (event: MouseEvent<HTMLElement>) =>
    setNotificationsAnchor(event.currentTarget);
  const closeNotifications = () => setNotificationsAnchor(null);

  const isManagerOrFinance =
    claims?.roles.includes("MANAGER") || claims?.roles.includes("FINANCE");
  const isHrAdmin = claims?.roles.includes("HR_ADMIN");

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        elevation={0}
        position="fixed"
        sx={{ borderBottom: 1, borderColor: "divider", zIndex: 1201 }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Stack alignItems="center" direction="row" spacing={1} sx={{ minWidth: 140 }}>
            <Box
              sx={{
                alignItems: "center",
                bgcolor: "primary.main",
                borderRadius: 1.5,
                color: "primary.contrastText",
                display: "flex",
                fontWeight: 800,
                height: 32,
                justifyContent: "center",
                width: 32,
              }}
            >
              A
            </Box>
            <Typography color="primary" fontWeight={800} letterSpacing="0.02em">
              ATLAS
            </Typography>
          </Stack>
          {/* Dummy, non-functional search box — visual only, does not query anything. */}
          <TextField
            disabled
            placeholder="Search employees, reports, approvals…"
            size="small"
            sx={{ flexGrow: 1, maxWidth: 420, "& .Mui-disabled": { WebkitTextFillColor: "unset" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            color="text.secondary"
            sx={{ display: { sm: "block", xs: "none" } }}
            variant="body2"
          >
            LOCAL · {claims?.email}
          </Typography>
          <Tooltip title="Notifications (sample)">
            <IconButton onClick={openNotifications}>
              <Badge color="error" variant="dot">
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={notificationsAnchor}
            onClose={closeNotifications}
            open={Boolean(notificationsAnchor)}
          >
            <ListSubheader>Notifications (sample)</ListSubheader>
            <MenuItem disabled>Overtime policy flag on a submitted timesheet</MenuItem>
            <MenuItem disabled>Expense report awaiting your approval</MenuItem>
            <MenuItem disabled>New employee provisioning completed</MenuItem>
          </Menu>
          <Tooltip title="Account">
            <IconButton onClick={openUserMenu} sx={{ p: 0.5 }}>
              <Avatar sx={{ bgcolor: "primary.main", fontSize: "0.875rem", height: 32, width: 32 }}>
                {initials(claims?.email)}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={userMenuAnchor} onClose={closeUserMenu} open={Boolean(userMenuAnchor)}>
            <MenuItem disabled>{claims?.email}</MenuItem>
            <Divider />
            <MenuItem disabled>Profile settings (sample)</MenuItem>
            <MenuItem disabled>Preferences (sample)</MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                closeUserMenu();
                dispatch(signOut());
              }}
            >
              <ListItemIcon>
                <LogoutOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          flexShrink: 0,
          width: drawerWidth,
          "& .MuiDrawer-paper": { boxSizing: "border-box", pt: 9, width: drawerWidth },
        }}
        variant="permanent"
      >
        <List
          aria-label="Primary navigation"
          component="nav"
          subheader={
            <ListSubheader sx={{ bgcolor: "transparent", color: "inherit", opacity: 0.6 }}>
              Workspace
            </ListSubheader>
          }
        >
          <ListItemButton component={Link} selected={location.pathname === "/"} to="/">
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              <DashboardOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Overview" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            selected={location.pathname.startsWith("/time")}
            to="/time"
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              <ScheduleOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Time" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            selected={location.pathname.startsWith("/expenses")}
            to="/expenses"
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              <ReceiptLongOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Expenses" />
          </ListItemButton>
          {isManagerOrFinance ? (
            <ListItemButton
              component={Link}
              selected={location.pathname.startsWith("/approvals")}
              to="/approvals"
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                <ApprovalOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Approvals" />
            </ListItemButton>
          ) : null}
          {isHrAdmin ? (
            <ListItemButton
              component={Link}
              selected={location.pathname.startsWith("/employees")}
              to="/employees"
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                <GroupsOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Employees" />
            </ListItemButton>
          ) : null}
        </List>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", my: 1 }} />
        <List
          aria-label="Other navigation"
          component="nav"
          subheader={
            <ListSubheader sx={{ bgcolor: "transparent", color: "inherit", opacity: 0.6 }}>
              Organization
            </ListSubheader>
          }
        >
          {/* Sample-only entries to convey a full enterprise product surface.
              Disabled so they cannot be interacted with — no new functionality. */}
          <ListItemButton disabled>
            <ListItemText primary="Reports (sample)" />
          </ListItemButton>
          <ListItemButton disabled>
            <ListItemText primary="Org chart (sample)" />
          </ListItemButton>
          <ListItemButton disabled>
            <ListItemText primary="Settings (sample)" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box component="main" sx={{ bgcolor: "background.default", flexGrow: 1, p: 4, pt: 12 }}>
        <Routes>
          <Route element={<DashboardPage />} path="/" />
          <Route element={<TimePage />} path="/time" />
          <Route element={<ExpensePage />} path="/expenses" />
          <Route element={<ApprovalsPage />} path="/approvals" />
          <Route element={<CreateEmployeePage />} path="/employees" />
        </Routes>
      </Box>
    </Box>
  );
}
