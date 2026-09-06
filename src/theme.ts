import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2B4C7E",
      dark: "#1B3560",
      light: "#4E6FA0",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0EA5A0",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#1E8E5A",
    },
    warning: {
      main: "#B9770E",
    },
    error: {
      main: "#C0392B",
    },
    info: {
      main: "#2B4C7E",
    },
    background: {
      default: "#F3F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#16202E",
      secondary: "#5A6675",
    },
    divider: "#E1E5EB",
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    overline: { fontWeight: 600, letterSpacing: "0.08em" },
    body1: { fontSize: "0.875rem" },
    body2: { fontSize: "0.875rem" },
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(22, 32, 46, 0.06)",
    "0px 1px 3px rgba(22, 32, 46, 0.08)",
    "0px 2px 6px rgba(22, 32, 46, 0.08)",
    "0px 2px 8px rgba(22, 32, 46, 0.10)",
    "0px 4px 10px rgba(22, 32, 46, 0.10)",
    "0px 4px 12px rgba(22, 32, 46, 0.12)",
    "0px 6px 16px rgba(22, 32, 46, 0.12)",
    "0px 6px 18px rgba(22, 32, 46, 0.12)",
    "0px 8px 20px rgba(22, 32, 46, 0.14)",
    "0px 8px 22px rgba(22, 32, 46, 0.14)",
    "0px 10px 24px rgba(22, 32, 46, 0.14)",
    "0px 10px 26px rgba(22, 32, 46, 0.16)",
    "0px 12px 28px rgba(22, 32, 46, 0.16)",
    "0px 12px 30px rgba(22, 32, 46, 0.16)",
    "0px 14px 32px rgba(22, 32, 46, 0.18)",
    "0px 14px 34px rgba(22, 32, 46, 0.18)",
    "0px 16px 36px rgba(22, 32, 46, 0.18)",
    "0px 16px 38px rgba(22, 32, 46, 0.20)",
    "0px 18px 40px rgba(22, 32, 46, 0.20)",
    "0px 18px 42px rgba(22, 32, 46, 0.20)",
    "0px 20px 44px rgba(22, 32, 46, 0.22)",
    "0px 20px 46px rgba(22, 32, 46, 0.22)",
    "0px 22px 48px rgba(22, 32, 46, 0.22)",
    "0px 22px 50px rgba(22, 32, 46, 0.24)",
  ],
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { fontWeight: 600, textTransform: "none" } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#16202E",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#132239",
          borderRight: "none",
          color: "#D7E0EE",
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid #E1E5EB",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          textTransform: "uppercase",
          fontSize: "0.7rem",
          letterSpacing: "0.04em",
          color: "#5A6675",
        },
      },
    },
  },
});

