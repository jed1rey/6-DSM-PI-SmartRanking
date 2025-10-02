import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

  
  const theme = {
    darkMode,
    toggleTheme,
    colors: {
      background: darkMode ? '#202124' : '#fafafa',
      card: darkMode ? '#303134' : '#ffffff',
      text: darkMode ? '#e8eaed' : '#202124',
      inputBg: darkMode ? '#3c3c3c' : '#f9f9f9',
      inputBorder: darkMode ? '#555' : '#ccc',
      primary: '#1976d2',
      secondary: '#2e7d32',
      accent: '#fbc02d',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}