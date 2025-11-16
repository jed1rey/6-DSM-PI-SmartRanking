import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={outerContainerStyle}>
      <div style={containerStyle(darkMode)}>
        <h1 style={titleStyle(darkMode)}>Smart Ranking</h1>
        <p style={subtitleStyle(darkMode)}>
          Explore, avalie e descubra os melhores aplicativos da Google Play.
        </p>

        <div style={descriptionStyle(darkMode)}>
          <p>
            O <strong>Smart Ranking</strong> é um sistema que permite que usuários explorem e ranqueiem apps da{" "}
            <strong>Google Play Store</strong> com base em critérios inteligentes, e recebam recomendações com base na mineração de dados a partir do ranking gerado.
          </p>
        </div>

        {!user ? (
          <div style={buttonsContainer}>
            <button onClick={() => navigate("/login")} style={primaryButton(darkMode)}>Entrar</button>
            <button onClick={() => navigate("/cadastro")} style={secondaryButton(darkMode)}>Cadastrar</button>
          </div>
        ) : (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <p style={welcomeText(darkMode)}>Bem-vindo(a), <strong>{user.nome}</strong>!</p>
            <button onClick={() => navigate("/pesquisa")} style={primaryButton(darkMode)}>Ir para Pesquisa</button>
          </div>
        )}
      </div>
    </div>
  );
}


const outerContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(70vh - 70px)", 
  padding: "20px",
  width: "100%"
};


const containerStyle = (darkMode) => ({
  textAlign: "center",
  padding: "60px 40px",
  backgroundColor: darkMode ? "rgba(32, 33, 36, 0.75)" : "rgba(32, 33, 36, 0.75)", 
  borderRadius: "16px",
  maxWidth: "900px",
  width: "100%",
  border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "400px"
});

const titleStyle = (darkMode) => ({
  fontSize: "2.8rem",
  color: "#fff",
  marginBottom: "20px",
  fontWeight: "500", 
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  fontFamily: "'Inter', sans-serif"
});

const subtitleStyle = (darkMode) => ({
  color: "#e8eaed",
  fontSize: "1.3rem",
  marginBottom: "30px",
  fontWeight: "300", 
  opacity: 0.9,
  fontFamily: "'Inter', sans-serif"
});

const descriptionStyle = (darkMode) => ({
  color: "#e8eaed",
  marginBottom: "40px",
  fontSize: "1.1rem",
  lineHeight: "1.6",
  maxWidth: "700px",
  margin: "0 auto 40px auto",
  opacity: 0.9,
  fontWeight: "400",
  fontFamily: "'Inter', sans-serif"
});


const buttonsContainer = { 
  display: "flex", 
  gap: "20px", 
  justifyContent: "center",
  flexWrap: "wrap" 
};

const primaryButton = (darkMode) => ({
  backgroundColor: "#1976d2",
  color: "#fff",
  padding: "15px 30px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "500", 
  fontSize: "1rem",
  minWidth: "140px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
  fontFamily: "'Inter', sans-serif"
});

const secondaryButton = (darkMode) => ({
  backgroundColor: "#2e7d32",
  color: "#fff",
  padding: "15px 30px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "1rem",
  minWidth: "140px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
});

const welcomeText = (darkMode) => ({
  color: darkMode ? "#e8eaed" : "#e8eaed",
  fontSize: "1.3rem",
  marginBottom: "25px",
  opacity: 0.9,
});