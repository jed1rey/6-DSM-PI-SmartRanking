import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Header from "./components/Header";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Pesquisa from "./pages/Pesquisa";
import Ranking from "./pages/Ranking";
import Perfil from "./pages/Perfil";
import { isLoggedIn } from "./services/api";

function AppContent() {
  const { darkMode } = useTheme();

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#202124" : "#fafafa",
        minHeight: "100vh",
        color: darkMode ? "#e8eaed" : "#202124",
        fontFamily: "Inter, sans-serif",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <Header />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 70px)", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: "900px", padding: "30px", borderRadius: "12px", backgroundColor: darkMode ? "#303134" : "#ffffff", boxShadow: darkMode ? "0 2px 10px rgba(0,0,0,0.6)" : "0 2px 10px rgba(0,0,0,0.1)" }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/pesquisa" element={isLoggedIn() ? <Pesquisa /> : <Navigate to="/" />} />
            <Route path="/ranking" element={isLoggedIn() ? <Ranking /> : <Navigate to="/" />} />
            <Route path="/perfil" element={isLoggedIn() ? <Perfil /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
