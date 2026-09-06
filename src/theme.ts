import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2B4C7E",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F7FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#16202E",
      secondary: "#5A6675",
    },
    divider: "#DCE1E8",
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
    body1: { fontSize: "0.875rem" },
    body2: { fontSize: "0.875rem" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: "none" } },
    },
  },
});

