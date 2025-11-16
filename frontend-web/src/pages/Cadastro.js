import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const { darkMode } = useTheme();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", data_nascimento: "", email: "", senha: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true);
    try {
      await signUp(form);
      setMsg("✅ Cadastro realizado com sucesso! Redirecionando...");
      setTimeout(() => navigate("/pesquisa"), 1200);
    } catch (err) {
      setMsg(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={outerContainerStyle}>
      <div style={containerStyle(darkMode)}>
        <h2 style={titleStyle(darkMode)}>📝 Cadastro</h2>
        <p style={subtitleStyle(darkMode)}>
          Crie sua conta para acessar o Smart Ranking
        </p>
        
        <input 
          name="nome" 
          placeholder="Nome completo" 
          value={form.nome} 
          onChange={change} 
          style={inputStyle(darkMode)} 
        />
        <input 
          name="data_nascimento" 
          type="date" 
          value={form.data_nascimento} 
          onChange={change} 
          style={inputStyle(darkMode)} 
        />
        <input 
          name="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={change} 
          style={inputStyle(darkMode)} 
        />
        <input 
          name="senha" 
          placeholder="Senha" 
          value={form.senha} 
          onChange={change} 
          type="password" 
          style={inputStyle(darkMode)} 
        />
        
        <button 
          onClick={submit} 
          disabled={loading} 
          style={buttonStyle(darkMode, loading)}
        >
          {loading ? " Cadastrando..." : " Cadastrar"}
        </button>
        
        {msg && <p style={messageStyle}>{msg}</p>}
        
        <p style={loginLinkStyle(darkMode)} onClick={() => navigate("/login")}>
          Já tem uma conta? <span style={{ fontWeight: "600" }}>Faça login</span>
        </p>
      </div>
    </div>
  );
}


const outerContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(70vh - 70px)",
  padding: "15px",
  width: "100%"
};


const containerStyle = (darkMode) => ({
  background: "rgba(0,0,0,0.55)",
  padding: "40px 30px",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  maxWidth: "450px",
  width: "100%",
  textAlign: "center"
});

const titleStyle = (darkMode) => ({ 
  color: "#fff", 
  textAlign: "center", 
  marginBottom: "8px",
  fontSize: "2rem",
  fontWeight: "500", 
  fontFamily: "'Inter', sans-serif"
});

const subtitleStyle = (darkMode) => ({
  color: "#ddd",
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "1rem",
  opacity: 0.9,
  fontWeight: "400", 
  fontFamily: "'Inter', sans-serif"
});

const inputStyle = (darkMode) => ({ 
  width: "100%", 
  padding: "14px",
  marginBottom: "16px", 
  borderRadius: "8px", 
  border: "1px solid rgba(255, 255, 255, 0.2)",
  background: "rgba(255, 255, 255, 0.1)",
  color: "#fff",
  fontSize: "1rem",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease",
  fontFamily: "'Inter', sans-serif",
  fontWeight: "400" 
});

const buttonStyle = (darkMode, loading) => ({ 
  width: "100%", 
  padding: "15px", 
  borderRadius: "8px", 
  background: loading ? "#999" : "#1976d2", 
  color: "#fff", 
  border: "none", 
  cursor: loading ? "not-allowed" : "pointer", 
  fontWeight: "500", 
  fontSize: "1rem",
  marginTop: "10px",
  marginBottom: "20px",
  transition: "all 0.3s ease",
  fontFamily: "'Inter', sans-serif"
});

const messageStyle = { 
  textAlign: "center", 
  marginTop: "15px",
  color: "#4caf50",
  fontWeight: "500"
};

const loginLinkStyle = (darkMode) => ({ 
  textAlign: "center", 
  marginTop: "20px", 
  color: "#ddd", 
  cursor: "pointer",
  fontSize: "0.95rem"
});