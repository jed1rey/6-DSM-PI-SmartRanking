import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { darkMode } = useTheme();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn(form);
      navigate("/pesquisa");
    } catch (err) {
      setError(err?.message || "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={outerContainerStyle}>
      <div style={containerStyle(darkMode)}>
        <h2 style={titleStyle(darkMode)}>🔐 Login</h2>
        <p style={subtitleStyle(darkMode)}>
          Acesse sua conta do Smart Ranking
        </p>
        
        <input 
          name="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={handleChange} 
          style={inputStyle(darkMode)} 
        />
        <input 
          name="senha" 
          placeholder="Senha" 
          value={form.senha} 
          onChange={handleChange} 
          type="password" 
          style={inputStyle(darkMode)} 
        />
        
        <button 
          onClick={handleLogin} 
          disabled={loading} 
          style={buttonStyle(darkMode, loading)}
        >
          {loading ? " Entrando..." : " Entrar"}
        </button>
        
        {error && <p style={errorStyle}>{error}</p>}
        
        <p style={registerLinkStyle(darkMode)} onClick={() => navigate("/cadastro")}>
          Não tem uma conta? <span style={{ fontWeight: "600" }}>Cadastre-se</span>
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

// Container principal 
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

const errorStyle = { 
  color: "#ff6b6b", 
  textAlign: "center",
  marginBottom: "15px",
  fontWeight: "500"
};

const registerLinkStyle = (darkMode) => ({ 
  textAlign: "center", 
  marginTop: "15px", 
  color: "#ddd", 
  cursor: "pointer",
  fontSize: "0.95rem"
});