import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const toggleTheme = () => setDarkMode((s) => !s);

  const colors = {
    background: darkMode ? "#202124" : "#fafafa",
    card: darkMode ? "#2c2c2c" : "#ffffff",
    text: darkMode ? "#e8eaed" : "#202124",
    inputBg: darkMode ? "#3c3c3c" : "#f9f9f9",
    inputBorder: darkMode ? "#555" : "#ddd",
    primary: "#1976d2",
    secondary: "#2e7d32",
    accent: "#fbc02d",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
