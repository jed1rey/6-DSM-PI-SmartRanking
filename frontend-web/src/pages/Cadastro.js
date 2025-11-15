import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const { darkMode } = useTheme();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    data_nascimento: "",
    email: "",
    senha: "",
  });
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await signUp(form);
      setMensagem("✅ Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/pesquisa-ranking"), 2000);
    } catch (err) {
      setMensagem(err.message || "✕ Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={titleStyle(darkMode)}>Cadastro</h2>
      <input 
        name="nome" 
        style={inputStyle(darkMode)} 
        placeholder="Nome" 
        value={form.nome}
        onChange={handleChange}
      />
      <input 
        name="data_nascimento" 
        style={inputStyle(darkMode)} 
        type="date" 
        value={form.data_nascimento}
        onChange={handleChange}
      />
      <input 
        name="email" 
        style={inputStyle(darkMode)} 
        placeholder="Email" 
        value={form.email}
        onChange={handleChange}
      />
      <input 
        name="senha" 
        style={inputStyle(darkMode)} 
        type="password" 
        placeholder="Senha" 
        value={form.senha}
        onChange={handleChange}
      />
      <button 
        style={buttonStyle(darkMode, loading)} 
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
      {mensagem && <p style={{ marginTop: "10px", textAlign: "center" }}>{mensagem}</p>}
    </div>
  );
}

// ESTILOS PARA CADASTRO
const titleStyle = (darkMode) => ({
  marginBottom: "20px",
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

const buttonStyle = (darkMode, loading) => ({
  marginTop: "15px",
  padding: "12px",
  width: "100%",
  background: loading ? "#999" : "#2e7d32",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: loading ? "not-allowed" : "pointer",
  fontWeight: "bold",
});