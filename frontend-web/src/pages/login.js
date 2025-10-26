import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { loginUser, saveToken } from "../services/api";

export default function Login() {
const { darkMode } = useTheme();
 const navigate = useNavigate();
const [form, setForm] = useState({ email: "", senha: "" });
const [erro, setErro] = useState("");

const handleChange = (e) => {
 setForm({ ...form, [e.target.name]: e.target.value });
 };

const handleLogin = async () => {
 const res = await loginUser(form);
if (res.token) {
 saveToken(res.token);
 navigate("/pesquisa"); 
} else {
 setErro(res.error || "❌ Credenciais inválidas.");
 }
};

return (
<div>
<h2 style={titleStyle(darkMode)}>Login</h2>
<input name="email" style={inputStyle(darkMode)} type="text" placeholder="Email" onChange={handleChange} />
<input name="senha" style={inputStyle(darkMode)} type="password" placeholder="Senha" onChange={handleChange} />
<button style={buttonStyle(darkMode)} onClick={handleLogin}>Entrar</button>
{erro && <p style={errorStyle}>{erro}</p>} 
<p style={registerLinkStyle(darkMode)} onClick={() => navigate("/cadastro")}>
 Não tem uma conta? Cadastre-se
</p>
</div>
);
}


const primaryColor = "#1976D2"; 
const titleStyle = (darkMode) => ({
 marginBottom: 25, 
fontSize: "28px", 
fontWeight: "600",
color: darkMode ? "#e8eaed" : "#202124",
textAlign: "center"
});

const inputStyle = (darkMode) => ({
margin: "10px 0",
 padding: "14px", 
 width: "98%", 
 borderRadius: "10px", 
 border: darkMode ? "1px solid #555" : "1px solid #ccc",
 backgroundColor: darkMode ? "#3c3c3c" : "#f9f9f9",
 color: darkMode ? "#fff" : "#000",
 fontSize: "1em",
 transition: "border 0.3s ease, box-shadow 0.3s ease",
});

const buttonStyle = (darkMode) => ({
 marginTop: "20px", 
 padding: "14px", 
 width: "100%", 
 background: primaryColor,
 color: "#fff",
 border: "none",
 borderRadius: "10px",
 cursor: "pointer",
 fontWeight: "bold",
 fontSize: "1.05em", 
 boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
 transition: "background 0.3s ease, opacity 0.3s ease",
});


const errorStyle = {
    color: "red",
    textAlign: "center",
    marginTop: "10px",
    fontSize: "0.95em",
};

const registerLinkStyle = (darkMode) => ({
 marginTop: "25px", 
 textAlign: "center",
 color: darkMode ? "#8ab4f8" : primaryColor,
 cursor: "pointer",
 fontSize: "0.95em", 
 textDecoration: "none", 
 transition: "color 0.3s ease",
});