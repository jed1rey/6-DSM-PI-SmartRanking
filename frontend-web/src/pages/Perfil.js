import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function Perfil() {
  const { darkMode } = useTheme();

  const userData = { nome: "João Silva", email: "joao@email.com" };
  const history = [
    { id: 1, nome: "Ranking 01" },
    { id: 2, nome: "Ranking 02" },
    { id: 3, nome: "Ranking 03" },
  ];

  return (
    <div> 
      <h2 style={titleStyle(darkMode)}>Perfil do Usuário</h2>

      <div style={sectionStyle}>
        <div><strong>Nome:</strong> {userData.nome}</div>
        <div><strong>Email:</strong> {userData.email}</div>
        <button style={buttonStyle(darkMode)}>Alterar Dados</button>
      </div>

      <div style={{ marginTop: 30, width: "100%" }}>
        <h3 style={{ color: darkMode ? "#e8eaed" : "#202124", textAlign: "center" }}>Histórico de Rankings</h3>
        {history.map((r) => (
          <div key={r.id} style={historyItem(darkMode)}>{r.nome}</div>
        ))}
      </div>
    </div>
  );
}



const titleStyle = (darkMode) => ({ marginBottom: 20, color: darkMode ? "#e8eaed" : "#202124", textAlign: "center" });
const sectionStyle = { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" };
const buttonStyle = (darkMode) => ({
  marginTop: "10px",
  padding: "10px 20px",
  background: darkMode ? "#1a73e8" : "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
});
const historyItem = (darkMode) => ({
  padding: "10px",
  margin: "10px 0",
  borderRadius: "6px",
  backgroundColor: darkMode ? "#3c3c3c" : "#f5f5f5",
  cursor: "pointer",
  transition: "background 0.3s ease",
   textAlign: "center"
});
