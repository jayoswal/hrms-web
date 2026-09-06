import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes, useLocation } from "react-router-dom";

import { useCurrentUserQuery } from "../../api/identity";
import type { RootState } from "../../store";
import { signOut } from "../auth/authSlice";
import { ExpensePage } from "../expense/ExpensePage";
import { TimePage } from "../time/TimePage";

const drawerWidth = 224;

export function AppShell() {
  const dispatch = useDispatch();
  const location = useLocation();
  const claims = useSelector((state: RootState) => state.auth.claims);
  const { data: employee, isLoading, error } = useCurrentUserQuery();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        color="inherit"
        elevation={0}
        position="fixed"
        sx={{ borderBottom: 1, borderColor: "divider", zIndex: 1201 }}
      >
        <Toolbar>
          <Typography color="primary" fontWeight={800} sx={{ flexGrow: 1 }}>
            ATLAS
          </Typography>
          <Typography color="text.secondary" sx={{ mr: 2 }} variant="body2">
            LOCAL · {claims?.email}
          </Typography>
          <Button onClick={() => dispatch(signOut())}>Sign out</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          flexShrink: 0,
          width: drawerWidth,
          "& .MuiDrawer-paper": { boxSizing: "border-box", pt: 8, width: drawerWidth },
        }}
        variant="permanent"
      >
        <List component="nav" aria-label="Primary navigation">
          <ListItemButton component={Link} selected={location.pathname === "/"} to="/">
            <ListItemText primary="Overview" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            selected={location.pathname.startsWith("/time")}
            to="/time"
          >
            <ListItemText primary="Time" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            selected={location.pathname.startsWith("/expenses")}
            to="/expenses"
          >
            <ListItemText primary="Expenses" />
          </ListItemButton>
          {claims?.roles.includes("MANAGER") ? (
            <ListItemButton disabled>
              <ListItemText primary="Approvals" />
            </ListItemButton>
          ) : null}
          {claims?.roles.includes("HR_ADMIN") ? (
            <ListItemButton disabled>
              <ListItemText primary="Employees" />
            </ListItemButton>
          ) : null}
        </List>
      </Drawer>
      <Box component="main" sx={{ bgcolor: "background.default", flexGrow: 1, p: 4, pt: 12 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {isLoading ? (
                  <CircularProgress aria-label="Loading employee profile" />
                ) : null}
                {error ? (
                  <Alert severity="error">Unable to load your employee profile.</Alert>
                ) : null}
                {employee ? (
                  <Stack spacing={1}>
                    <Typography color="text.secondary" variant="overline">
                      Employee workspace
                    </Typography>
                    <Typography component="h1" variant="h4">
                      Welcome, {employee.full_name}
                    </Typography>
                    <Typography color="text.secondary">
                      {employee.cost_center} · {employee.roles.join(", ")}
                    </Typography>
                  </Stack>
                ) : null}
              </>
            }
          />
          <Route path="/time" element={<TimePage />} />
          <Route path="/expenses" element={<ExpensePage />} />
        </Routes>
      </Box>
    </Box>
  );
}
