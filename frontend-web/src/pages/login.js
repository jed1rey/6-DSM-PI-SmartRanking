import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/cadastro"); 
  };

  return (
    <div>
      <h2 style={titleStyle(darkMode)}>Login</h2>
      <input style={inputStyle(darkMode)} type="text" placeholder="Usuário" />
      <input style={inputStyle(darkMode)} type="password" placeholder="Senha" />
      <button style={buttonStyle(darkMode)} onClick={() => navigate("/pesquisa")}>Entrar</button>
     
      <p 
        style={registerLinkStyle(darkMode)} 
        onClick={handleRegisterClick}
      >
        Não tem uma conta? Cadastre-se
      </p>
    </div>
  );
}

const titleStyle = (darkMode) => ({ 
  marginBottom: 20, 
  color: darkMode ? "#e8eaed" : "#202124",
  textAlign: "center"
});

const inputStyle = (darkMode) => ({
  margin: "10px 0",
  padding: "12px",
  width: "96%",
  borderRadius: "6px",
  border: darkMode ? "1px solid #555" : "1px solid #ccc",
  backgroundColor: darkMode ? "#3c3c3c" : "#f9f9f9",
  color: darkMode ? "#fff" : "#000",
});

const buttonStyle = (darkMode) => ({
  marginTop: "15px",
  padding: "12px",
  width: "99%",
  background: darkMode ? "#1a73e8" : "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
});

// Estilo para o link de cadastro
const registerLinkStyle = (darkMode) => ({
  marginTop: "15px",
  textAlign: "center",
  color: darkMode ? "#8ab4f8" : "#1a73e8", // Cor de link
  cursor: "pointer",
  fontSize: "0.9em",
  textDecoration: "underline",
});