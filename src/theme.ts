import "@mui/x-data-grid/themeAugmentation";
import { createTheme, type PaletteMode, type ThemeOptions } from "@mui/material";

// Shared foundation (typography, shape, shadows, component shapes) that is
// identical across light and dark mode — only `palette` differs below.
const shape: ThemeOptions["shape"] = { borderRadius: 8 };

const typography: ThemeOptions["typography"] = {
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
};

function buildShadows(shadowColor: string): ThemeOptions["shadows"] {
  const alphas = [
    0, 0.06, 0.08, 0.08, 0.1, 0.1, 0.12, 0.12, 0.12, 0.14, 0.14, 0.14, 0.16,
    0.16, 0.16, 0.18, 0.18, 0.18, 0.2, 0.2, 0.2, 0.22, 0.22, 0.22, 0.24,
  ];
  return alphas.map((alpha, index) => {
    if (index === 0) return "none";
    const blur = 2 + index * 2;
    const spread = Math.round(blur * 0.6);
    return `0px ${spread}px ${blur}px ${shadowColor.replace("ALPHA", String(alpha))}`;
  }) as ThemeOptions["shadows"];
}

// Light and dark palettes are designed independently (not a CSS invert) so
// that text/background/border contrast stays comfortably above WCAG AA
// (4.5:1 for body text) in both modes.
const lightPalette: ThemeOptions["palette"] = {
  mode: "light",
  primary: {
    main: "#2B4C7E",
    dark: "#1B3560",
    light: "#4E6FA0",
    contrastText: "#FFFFFF",
  },
  secondary: { main: "#0B7C77", contrastText: "#FFFFFF" },
  success: { main: "#1E8E5A" },
  warning: { main: "#9A6116" },
  error: { main: "#C0392B" },
  info: { main: "#2B4C7E" },
  background: { default: "#F3F5F9", paper: "#FFFFFF" },
  text: { primary: "#16202E", secondary: "#4B5666" },
  divider: "#E1E5EB",
};

const darkPalette: ThemeOptions["palette"] = {
  mode: "dark",
  primary: {
    main: "#7CA3D8",
    dark: "#5B82B8",
    light: "#A2C0E8",
    contrastText: "#0B1220",
  },
  secondary: { main: "#3FCFC7", contrastText: "#0B1220" },
  success: { main: "#4ADE80" },
  warning: { main: "#F0B33C" },
  error: { main: "#F27C6B" },
  info: { main: "#7CA3D8" },
  background: { default: "#0B1220", paper: "#111A2C" },
  text: { primary: "#E7ECF3", secondary: "#A6B3C4" },
  divider: "#243247",
};

function buildComponents(mode: PaletteMode): ThemeOptions["components"] {
  const isDark = mode === "dark";
  return {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { fontWeight: 600, textTransform: "none" },
        sizeMedium: { paddingBlock: 6, paddingInline: 16 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? "#0F1B2E" : "#FFFFFF",
          color: isDark ? "#E7ECF3" : "#16202E",
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
        root: { border: `1px solid ${isDark ? "#243247" : "#E1E5EB"}` },
      },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: 20, "&:last-child": { paddingBottom: 20 } } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiAlert: {
      styleOverrides: { root: { fontSize: "0.8125rem" } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          textTransform: "uppercase",
          fontSize: "0.7rem",
          letterSpacing: "0.04em",
          color: isDark ? "#A6B3C4" : "#5A6675",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: `1px solid ${isDark ? "#243247" : "#E1E5EB"}`,
          borderRadius: 8,
          "--DataGrid-containerBackground": isDark ? "#0F1B2E" : "#F8FAFC",
        },
        columnHeaders: { borderRadius: 0 },
        columnHeaderTitle: { fontWeight: 700, textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.04em" },
      },
    },
  };
}

export function getTheme(mode: PaletteMode) {
  const palette = mode === "dark" ? darkPalette : lightPalette;
  const shadowColor = mode === "dark" ? "rgba(0, 4, 12, ALPHA)" : "rgba(22, 32, 46, ALPHA)";
  return createTheme({
    palette,
    shape,
    typography,
    shadows: buildShadows(shadowColor),
    components: buildComponents(mode),
  });
}

// Default export kept for any code that only ever needs light mode (e.g. tests).
export const theme = getTheme("light");
