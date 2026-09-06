import { CssBaseline, ThemeProvider, type PaletteMode } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getTheme } from "../theme";

const STORAGE_KEY = "atlas.color-mode";

type ColorModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

function readStoredMode(): PaletteMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(readStoredMode);

  const toggleMode = useCallback(() => {
    setMode((current) => {
      const next = current === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode]);
  const contextValue = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ColorModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return context;
}
