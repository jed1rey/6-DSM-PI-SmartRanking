import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Cadastro() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    data_nascimento: "",
    email: "",
    senha: ""
  });
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await registerUser(form);
    if (res.user_id) {
      setMensagem("✅ Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setMensagem(res.error || "❌ Erro ao cadastrar usuário.");
    }
  };

  return (
    <div>
      <h2 style={titleStyle(darkMode)}>Cadastro</h2>
      <input name="nome" style={inputStyle(darkMode)} placeholder="Nome" onChange={handleChange} />
      <input name="data_nascimento" style={inputStyle(darkMode)} type="date" onChange={handleChange} />
      <input name="email" style={inputStyle(darkMode)} placeholder="Email" onChange={handleChange} />
      <input name="senha" style={inputStyle(darkMode)} type="password" placeholder="Senha" onChange={handleChange} />
      <button style={buttonStyle(darkMode)} onClick={handleSubmit}>Cadastrar</button>
      {mensagem && <p style={{ marginTop: "10px", textAlign: "center" }}>{mensagem}</p>}
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
  width: "100%",
  background: "#2e7d32",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
});
