import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Pesquisa() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const fields = ["Categoria", "Preço", "Faixa Etária", "Número de Instalações"];

  return (
    <div> 
      <h2 style={titleStyle(darkMode)}>Pesquisa de Apps</h2>
      {fields.map((f, i) => <input key={i} style={inputStyle(darkMode)} placeholder={f} />)}
      <button style={buttonStyle(darkMode)} onClick={() => navigate("/ranking")}>Gerar Ranking</button>
    </div>
  );
}


const titleStyle = (darkMode) => ({ marginBottom: 20,  color: darkMode ? "#e8eaed" : "#202124" , textAlign: "center" });
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
  background: darkMode ? "#fbc02d" : "#fbc02d",
  color: "#000000ff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
});
