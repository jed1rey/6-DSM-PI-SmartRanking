import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={containerStyle(darkMode)}>
      {/* Título principal */}
      <h1 style={titleStyle(darkMode)}>
        Smart Ranking
      </h1>
      
      {/* Subtítulo */}
      <p style={subtitleStyle(darkMode)}>
        Explore, avalie e descubra os melhores aplicativos da Google Play.
      </p>

      {/* Texto descritivo */}
      <div style={descriptionStyle(darkMode)}>
        <p>
          O <strong>Smart Ranking</strong> é um sistema que permite que usuários explorem e ranqueiem apps da{" "}
          <strong>Google Play Store</strong> com base em critérios inteligentes, e recebam recomendações com base na
          mineração de dados a partir do ranking gerado.
        </p>
      </div>

      {/* Botões aparecem apenas se o usuário não estiver logado */}
      {!user && (
        <div style={buttonsContainerStyle}>
          <button 
            onClick={() => navigate("/login")}
            style={primaryButtonStyle(darkMode)}
          >
            Entrar
          </button>
          <button 
            onClick={() => navigate("/cadastro")}
            style={secondaryButtonStyle(darkMode)}
          >
            Cadastrar
          </button>
        </div>
      )}

      {/* Caso o usuário esteja logado, mostra uma saudação */}
      {user && (
        <div style={welcomeContainerStyle}>
          <p style={welcomeTextStyle(darkMode)}>
            Bem-vindo(a), <strong>{user.nome}</strong>!
          </p>
          <button 
            onClick={() => navigate("/pesquisa")}
            style={primaryButtonStyle(darkMode)}
          >
            Ir para Pesquisa
          </button>
        </div>
      )}
    </div>
  );
}

// Estilos 
const containerStyle = (darkMode) => ({
  textAlign: "center",
  padding: "40px 20px",
  backgroundColor: darkMode ? "#303134" : "#ffffff",
  borderRadius: "12px",
  maxWidth: "800px",
  margin: "0 auto",
});

const titleStyle = (darkMode) => ({
  fontSize: "3rem",
  fontWeight: "bold",
  color: darkMode ? "#fbc02d" : "#1976d2",
  marginBottom: "20px",
  textAlign: "center"
});

const subtitleStyle = (darkMode) => ({
  fontSize: "1.3rem",
  textAlign: "center",
  color: darkMode ? "#e8eaed" : "#444",
  marginBottom: "30px",
  lineHeight: "1.5"
});

const descriptionStyle = (darkMode) => ({
  fontSize: "1.1rem",
  textAlign: "center",
  color: darkMode ? "#e8eaed" : "#444",
  marginBottom: "30px",
  lineHeight: "1.6"
});

const buttonsContainerStyle = {
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  marginTop: "40px"
};

const primaryButtonStyle = (darkMode) => ({
  backgroundColor: "#1976d2",
  color: "#fff",
  padding: "14px 28px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  transition: "opacity 0.3s ease",
});

const secondaryButtonStyle = (darkMode) => ({
  backgroundColor: "#2e7d32",
  color: "#fff",
  padding: "14px 28px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  transition: "opacity 0.3s ease",
});

const welcomeContainerStyle = {
  marginTop: "20px",
  alignItems: "center"
};

const welcomeTextStyle = (darkMode) => ({
  fontSize: "1.5rem",
  color: darkMode ? "#e8eaed" : "#202124",
  textAlign: "center",
  marginBottom: "20px"
});