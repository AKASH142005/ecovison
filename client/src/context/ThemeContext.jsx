import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
};

export function ThemeContextProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('ecovision_theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      return 'dark'; // Default to EcoVision signature dark theme
    } catch (e) {
      return 'dark';
    }
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem('ecovision_theme', theme);
    } catch (e) {
      console.warn('Could not save theme to localStorage:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (mode) => {
    if (mode === 'dark' || mode === 'light') {
      setThemeState(mode);
    }
  };

  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: isDark ? '#10b981' : '#059669', // emerald
          light: isDark ? '#34d399' : '#10b981',
          dark: isDark ? '#059669' : '#047857',
          contrastText: isDark ? '#022c22' : '#ffffff'
        },
        secondary: {
          main: '#0284c7', // sky
          light: '#38bdf8',
          dark: '#0369a1'
        },
        background: {
          default: isDark ? '#020617' : '#f8fafc',
          paper: isDark ? '#0f172a' : '#ffffff'
        },
        text: {
          primary: isDark ? '#f8fafc' : '#0f172a',
          secondary: isDark ? '#94a3b8' : '#64748b'
        },
        divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
      },
      typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        button: {
          textTransform: 'none',
          fontWeight: 600
        }
      },
      shape: {
        borderRadius: 12
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              boxShadow: 'none'
            }
          }
        },
        MuiChip: {
          styleOverrides: {
            root: {
              fontWeight: 600
            }
          }
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundImage: 'none'
            }
          }
        }
      }
    });
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
