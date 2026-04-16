import React, { createContext, useContext, useEffect, useState } from 'react';
import palettesData from '../config/palettes.json';

type Theme = 'dark' | 'light' | 'system';

export type PaletteConfig = {
  id: string;
  name: string;
  primaryHex: string;
  primaryRgb: string;
  primaryHoverHex: string;
  primaryLightHex: string;
  primaryDarkHex: string;
  secondaryHex: string;
  secondaryRgb: string;
  secondaryLightHex: string;
  secondaryDarkHex: string;
};

const palettes: PaletteConfig[] = palettesData;

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  palette: PaletteConfig;
  setPalette: (palette: PaletteConfig) => void;
  availablePalettes: PaletteConfig[];
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  palette: palettes[0],
  setPalette: () => null,
  availablePalettes: palettes,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  // Pick a random palette on initial load
  const [palette, setPalette] = useState<PaletteConfig>(() => {
    const randomizablePalettes = palettes.filter(p => p.id !== 'grey');
    const randomIndex = Math.floor(Math.random() * randomizablePalettes.length);
    return randomizablePalettes[randomIndex];
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      };
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        // Fallback for older Safari
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    // Apply palette CSS variables dynamically
    root.style.setProperty('--primary-hex', palette.primaryHex);
    root.style.setProperty('--primary-rgb', palette.primaryRgb);
    root.style.setProperty('--primary-hover-hex', palette.primaryHoverHex);
    root.style.setProperty('--primary-light-hex', palette.primaryLightHex);
    root.style.setProperty('--primary-dark-hex', palette.primaryDarkHex);
    
    root.style.setProperty('--secondary-hex', palette.secondaryHex);
    root.style.setProperty('--secondary-rgb', palette.secondaryRgb);
    root.style.setProperty('--secondary-light-hex', palette.secondaryLightHex);
    root.style.setProperty('--secondary-dark-hex', palette.secondaryDarkHex);
  }, [palette]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    palette,
    setPalette,
    availablePalettes: palettes,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
