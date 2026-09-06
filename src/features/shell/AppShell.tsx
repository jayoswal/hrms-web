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

import { useCurrentUserQuery } from "../../api/identity";
import type { RootState } from "../../store";
import { signOut } from "../auth/authSlice";

const drawerWidth = 224;

export function AppShell() {
  const dispatch = useDispatch();
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
          <ListItemButton selected>
            <ListItemText primary="Overview" />
          </ListItemButton>
          <ListItemButton disabled>
            <ListItemText primary="Time" />
          </ListItemButton>
          <ListItemButton disabled>
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
        {isLoading ? <CircularProgress aria-label="Loading employee profile" /> : null}
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
      </Box>
    </Box>
  );
}
