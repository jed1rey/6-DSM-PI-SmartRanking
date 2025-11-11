import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
    </ThemeProvider>
  );
}