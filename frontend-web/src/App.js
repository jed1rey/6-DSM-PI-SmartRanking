// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useBackground } from "./hooks/useBackground"; 
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Pesquisa from "./pages/Pesquisa";
import Ranking from "./pages/Ranking";
import Perfil from "./pages/Perfil";
import "./index.css";

function AppContent() {
  const { user } = useAuth();
  useBackground(); 

  return (
    <div className="app-content" style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
    }}>
      <Header />
      <div style={{ 
        flex: 1,
        display: "flex", 
        justifyContent: "center", 
        padding: "20px",
        width: "100%"
      }}>
        <div style={{ 
          width: "100%", 
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/pesquisa" element={user ? <Pesquisa /> : <Navigate to="/login" />} />
            <Route path="/ranking" element={user ? <Ranking /> : <Navigate to="/login" />} />
            <Route path="/perfil" element={user ? <Perfil /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}