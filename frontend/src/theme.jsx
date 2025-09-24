import React, { createContext, useEffect, useMemo, useState, useContext } from 'react'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'

const ColorModeContext = createContext({ toggle: () => {}, mode: 'light' })

const PROFESSIONAL_LIGHT = {
  primary: {
    main: '#1e3a8a', // True Navy blue
    light: '#1e40af',
    dark: '#1e293b',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#6366f1', // Indigo accent
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff'
  },
  tertiary: {
    main: '#0ea5e9', // Sky blue
    light: '#38bdf8',
    dark: '#0284c7',
    contrastText: '#ffffff'
  },
  success: {
    main: '#059669',
    light: '#10b981',
    dark: '#047857'
  },
  warning: {
    main: '#d97706',
    light: '#f59e0b',
    dark: '#b45309'
  },
  error: {
    main: '#dc2626',
    light: '#ef4444',
    dark: '#b91c1c'
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff'
  },
  text: {
    primary: '#1f2937',
    secondary: '#6b7280'
  },
  divider: 'rgba(31, 41, 55, 0.12)',
  grey: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
}

const PROFESSIONAL_DARK = {
  primary: {
    main: '#3b82f6', // Bright blue for dark mode
    light: '#60a5fa',
    dark: '#2563eb',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#818cf8', // Lighter indigo for dark mode
    light: '#a5b4fc',
    dark: '#6366f1',
    contrastText: '#ffffff'
  },
  tertiary: {
    main: '#38bdf8', // Lighter sky blue for dark mode
    light: '#7dd3fc',
    dark: '#0ea5e9',
    contrastText: '#ffffff'
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669'
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706'
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626'
  },
  background: {
    default: '#0f172a', // Navy dark
    paper: '#1e293b'
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#cbd5e1'
  },
  divider: 'rgba(241, 245, 249, 0.1)',
  grey: {
    50: '#0f172a',
    100: '#1e293b',
    200: '#334155',
    300: '#475569',
    400: '#64748b',
    500: '#94a3b8',
    600: '#cbd5e1',
    700: '#e2e8f0',
    800: '#f1f5f9',
    900: '#f8fafc'
  }
}

function getDesignTokens(mode) {
  const base = mode === 'light' ? PROFESSIONAL_LIGHT : PROFESSIONAL_DARK
  const isDark = mode === 'dark'
  
  return {
    palette: { mode, ...base },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"',
      h1: { 
        fontWeight: 700,
        fontSize: '3.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em'
      },
      h2: { 
        fontWeight: 600,
        fontSize: '2.25rem',
        lineHeight: 1.25,
        letterSpacing: '-0.025em'
      },
      h3: { 
        fontWeight: 600,
        fontSize: '1.875rem',
        lineHeight: 1.375
      },
      h4: { 
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.375
      },
      h5: { 
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: 1.375
      },
      h6: { 
        fontWeight: 500,
        fontSize: '1.125rem',
        lineHeight: 1.375
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.625,
        fontWeight: 400
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        fontWeight: 400
      },
      button: {
        fontWeight: 500,
        letterSpacing: '0.025em',
        textTransform: 'none'
      }
    },
    shadows: [
      'none',
      isDark ? '0px 1px 3px rgba(0, 0, 0, 0.3)' : '0px 1px 3px rgba(0, 0, 0, 0.12)',
      isDark ? '0px 4px 6px rgba(0, 0, 0, 0.3)' : '0px 4px 6px rgba(0, 0, 0, 0.07)',
      isDark ? '0px 10px 15px rgba(0, 0, 0, 0.3)' : '0px 10px 15px rgba(0, 0, 0, 0.1)',
      isDark ? '0px 20px 25px rgba(0, 0, 0, 0.3)' : '0px 20px 25px rgba(0, 0, 0, 0.1)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)',
      isDark ? '0px 25px 50px rgba(0, 0, 0, 0.3)' : '0px 25px 50px rgba(0, 0, 0, 0.15)'
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isDark ? '#475569 #1e293b' : '#cbd5e1 #f1f5f9',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 4,
              backgroundColor: isDark ? '#475569' : '#cbd5e1',
              border: `1px solid ${isDark ? '#1e293b' : '#f1f5f9'}`,
            },
            '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
              backgroundColor: isDark ? '#64748b' : '#94a3b8',
            },
            '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
              backgroundColor: isDark ? '#64748b' : '#94a3b8',
            },
            '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
              backgroundColor: isDark ? '#64748b' : '#94a3b8',
            },
            '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
              backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { 
          variant: 'contained',
          disableElevation: false
        },
        styleOverrides: { 
          root: { 
            textTransform: 'none',
            borderRadius: 12,
            padding: '14px 28px',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '0.025em',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: isDark 
              ? '0 4px 16px 0 rgba(0, 0, 0, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.2)' 
              : '0 4px 16px 0 rgba(30, 64, 175, 0.2), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              transition: 'left 0.5s',
            },
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDark 
                ? '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 4px 16px 0 rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px 0 rgba(30, 64, 175, 0.3), 0 4px 16px 0 rgba(0, 0, 0, 0.15)',
              '&:before': {
                left: '100%',
              }
            },
            '&:active': {
              transform: 'translateY(-1px) scale(0.98)',
            }
          },
          outlined: {
            borderWidth: 2,
            borderColor: isDark ? 'rgba(96, 165, 250, 0.5)' : 'rgba(30, 58, 138, 0.3)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              borderWidth: 2,
              borderColor: isDark ? 'rgba(96, 165, 250, 0.8)' : 'rgba(30, 58, 138, 0.6)',
            }
          },
          sizeLarge: {
            padding: '16px 32px',
            fontSize: '1.1rem',
            borderRadius: 14
          },
          sizeSmall: {
            padding: '10px 20px',
            fontSize: '0.85rem',
            borderRadius: 10
          }
        }
      },
      MuiPaper: { 
        styleOverrides: { 
          root: { 
            borderRadius: 20,
            backgroundImage: 'none',
            border: isDark ? '1px solid rgba(203, 213, 225, 0.1)' : '1px solid rgba(30, 41, 59, 0.08)',
          },
          elevation1: {
            boxShadow: isDark ? '0px 2px 8px rgba(0, 0, 0, 0.2)' : '0px 2px 8px rgba(30, 41, 59, 0.08)',
          },
          elevation2: {
            boxShadow: isDark ? '0px 4px 12px rgba(0, 0, 0, 0.25)' : '0px 4px 12px rgba(30, 41, 59, 0.1)',
          },
          elevation3: {
            boxShadow: isDark ? '0px 8px 24px rgba(0, 0, 0, 0.3)' : '0px 8px 24px rgba(30, 41, 59, 0.12)',
          }
        } 
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: isDark ? '1px solid rgba(51, 65, 85, 0.3)' : '1px solid rgba(229, 231, 235, 0.8)',
            background: isDark 
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)' 
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: isDark 
              ? '0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 0 rgba(0, 0, 0, 0.2)' 
              : '0 8px 32px 0 rgba(30, 41, 59, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isDark 
                ? '0 12px 48px 0 rgba(0, 0, 0, 0.4), 0 4px 16px 0 rgba(0, 0, 0, 0.3)' 
                : '0 12px 48px 0 rgba(30, 41, 59, 0.12), 0 4px 16px 0 rgba(0, 0, 0, 0.15)',
            }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? '#60a5fa' : '#3b82f6',
                }
              },
              '&.Mui-focused': {
                boxShadow: isDark ? '0px 0px 0px 3px rgba(96, 165, 250, 0.1)' : '0px 0px 0px 3px rgba(59, 130, 246, 0.1)',
              }
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 500,
          },
          filled: {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
            color: isDark ? '#60a5fa' : '#1e40af',
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(20px)',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
            borderBottom: isDark ? '1px solid rgba(203, 213, 225, 0.1)' : '1px solid rgba(30, 41, 59, 0.08)',
          }
        }
      }
    }
  }
}

export function useColorMode() {
  return useContext(ColorModeContext)
}

export default function AppTheme({ children }) {
  const [mode, setMode] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem('fardi-color-mode')
    if (saved === 'light' || saved === 'dark') {
      setMode(saved)
    } else {
      // Respect system preference by default
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setMode(prefersDark ? 'dark' : 'light')
    }
  }, [])

  const colorMode = useMemo(() => ({
    mode,
    toggle: () => setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('fardi-color-mode', next)
      return next
    })
  }), [mode])

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export { ColorModeContext }
