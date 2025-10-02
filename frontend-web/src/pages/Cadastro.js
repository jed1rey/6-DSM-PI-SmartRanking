import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function Cadastro() {
  const { darkMode } = useTheme();

  return (
    <div >
      <h2 style={titleStyle(darkMode)}>Cadastro</h2>
      <input style={inputStyle(darkMode)} placeholder="Nome" />
      <input style={inputStyle(darkMode)} type="date" />
      <input style={inputStyle(darkMode)} type="password" placeholder="Senha" />
      <button style={buttonStyle(darkMode)}>Cadastrar</button>
    </div>
  );
}



const titleStyle = (darkMode) => ({ 
  marginBottom: 50, 
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
  width: "100%",
  background: darkMode ? "#2e7d32" : "#2e7d32",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
});
