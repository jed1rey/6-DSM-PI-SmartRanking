import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function Header() {
  const { darkMode, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pageColors = {
    "/": "#1976d2",
    "/login": "#1976d2",
    "/cadastro": "#2e7d32",
    "/pesquisa": "#fbc02d",
    "/ranking": "#d32f2f",
    "/perfil": "#928c8cff",
  };

  const headerColor = pageColors[location.pathname] || (darkMode ? "#202124" : "#ffffff");
  const textColor = darkMode ? "#fff" : "#000";

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      backgroundColor: headerColor,
      color: textColor,
      fontFamily: "Inter, sans-serif",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img src="/LogoSR.png" alt="SmartRanking" style={{ height: 56 }} />
        <nav style={{ display: "flex", gap: 16 }}>
          <Link to="/" style={{ color: "inherit" }}>Home</Link>
          {!user ? (
            <>
              <Link to="/login" style={{ color: "inherit" }}>Login</Link>
              <Link to="/cadastro" style={{ color: "inherit" }}>Cadastro</Link>
            </>
          ) : (
            <>
              <Link to="/pesquisa" style={{ color: "inherit" }}>Pesquisa</Link>
              <Link to="/ranking" style={{ color: "inherit" }}>Ranking</Link>
              <Link to="/perfil" style={{ color: "inherit" }}>Perfil</Link>
            </>
          )}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user && (
          <>
            <span style={{ fontWeight: 600 }}>{user.nome || user.email}</span>
            <button onClick={handleLogout} style={{
              background: "transparent",
              border: `1px solid ${textColor}`,
              color: textColor,
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer"
            }}>
              Sair
            </button>
          </>
        )}
        <button onClick={toggleTheme} style={{
          background: "transparent",
          border: "none",
          color: textColor,
          cursor: "pointer",
          fontSize: 18
        }}>
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
    </header>
  );
}
