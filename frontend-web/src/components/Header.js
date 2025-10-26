import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import { logout, isLoggedIn } from "../services/api";
import { getUserFromToken } from "../utils/auth";

export default function Header() {
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUserFromToken();

  const pageColors = {
    "/": "#1976d2",
    "/cadastro": "#2e7d32",
    "/pesquisa": "#fbc02d",
    "/ranking": "#d32f2f",
    "/perfil": "#bdbdbd",
  };

  const headerColor = pageColors[location.pathname] || "#202124";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: headerColor,
        color: darkMode ? "#fff" : "#000",
        fontFamily: "Inter, sans-serif",
        transition: "background 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <img
          src="/LogoSR.png"
          alt="SmartRanking Logo"
          style={{ height: "80px", width: "auto" }}
        />
        <nav style={{ display: "flex", gap: "20px" }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Login</Link>
          <Link to="/cadastro" style={{ color: "inherit", textDecoration: "none" }}>Cadastro</Link>
          <Link to="/pesquisa" style={{ color: "inherit", textDecoration: "none" }}>Pesquisa</Link>
          <Link to="/ranking" style={{ color: "inherit", textDecoration: "none" }}>Ranking</Link>
          <Link to="/perfil" style={{ color: "inherit", textDecoration: "none" }}>Perfil</Link>
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {isLoggedIn() && user && (
          <>
            <span style={{ fontWeight: "500" }}>
              {user.nome || user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid currentColor",
                color: "inherit",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: "0.9em",
              }}
            >
              Sair
            </button>
          </>
        )}
        <button
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "inherit",
          }}
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>
    </header>
  );
}
