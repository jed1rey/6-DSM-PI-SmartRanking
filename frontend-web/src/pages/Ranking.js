import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

// Mapeamento de categorias
const categoriasPT = {
  "ART_AND_DESIGN": "Arte e Design",
  "BEAUTY": "Beleza",
  "BOOKS_AND_REFERENCE": "Livros e Referências",
  "BUSINESS": "Negócios",
  "COMICS": "Quadrinhos",
  "COMMUNICATION": "Comunicação",
  "DATING": "Relacionamento",
  "EDUCATION": "Educação",
  "ENTERTAINMENT": "Entretenimento",
  "EVENTS": "Eventos",
  "FAMILY": "Família",
  "FINANCE": "Finanças",
  "FOOD_AND_DRINK": "Comida e Bebida",
  "GAME": "Jogos",
  "HOUSE_AND_HOME": "Casa e Lar",
  "LIBRARIES_AND_DEMO": "Bibliotecas e Demonstração",
  "LIFESTYLE": "Estilo de Vida",
  "MAPS_AND_NAVIGATION": "Mapas e Navegação",
  "MEDICAL": "Medicina",
  "NEWS_AND_MAGAZINES": "Notícias e Revistas",
  "PARENTING": "Paternidade",
  "PERSONALIZATION": "Personalização",
  "PHOTOGRAPHY": "Fotografia",
  "PRODUCTIVITY": "Produtividade",
  "SHOPPING": "Compras",
  "SOCIAL": "Social",
  "SPORTS": "Esportes",
  "TOOLS": "Ferramentas",
  "TRAVEL_AND_LOCAL": "Viagem e Localização",
  "VIDEO_PLAYERS": "Video Players",
  "WEATHER": "Clima",
  "HEALTH_AND_FITNESS": "Saúde e Fitness",
};

export default function Ranking() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtém os dados da pesquisa passados pela página de Pesquisa
  const rankingData = location.state?.rankingData || null;
  const resultados = rankingData?.resultados || [];

  // Se não houver dados, mostra mensagem
  if (!rankingData || resultados.length === 0) {
    return (
      <div>
        <h2 style={titleStyle(darkMode)}>Ranking</h2>
        <div style={noDataStyle(darkMode)}>
          <p>Nenhum resultado disponível ainda.</p>
          <p>Faça uma pesquisa para ver o ranking e recomendações.</p>
          <button 
            onClick={() => navigate("/pesquisa")}
            style={buttonStyle(darkMode)}
          >
            Ir para Pesquisa
          </button>
        </div>
      </div>
    );
  }

  // Filtra os resultados
  const top10 = resultados.filter((r) => r.tipo_resultado === "TOP10_RANKING");
  const recomendacoes = resultados.filter((r) => r.tipo_resultado === "KNN_RECOMENDACAO");

  return (
    <div>
      <h2 style={titleStyle(darkMode)}>Resultado da Pesquisa</h2>

      {/* Ranking Principal */}
      {top10.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h3 style={subtitleStyle(darkMode)}>Top Ranking</h3>
          {top10.map((item, index) => (
            <div key={index} style={cardStyle(darkMode)}>
              <div style={positionStyle}>{item.posicao ?? index + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={appNameStyle}>{item.app_nome}</div>
                <div style={detailStyle(darkMode)}>
                  Categoria: {categoriasPT[item.categoria] || item.categoria}
                </div>
                <div style={detailStyle(darkMode)}>
                  Nota Final: {item.nota_final ?? item.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recomendações */}
      {recomendacoes.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h3 style={subtitleStyle(darkMode)}>Recomendações</h3>
          {recomendacoes.map((item, index) => (
            <div key={index} style={cardStyle(darkMode)}>
              <div style={{...positionStyle, color: "#4fc3f7"}}>
                {item.posicao ?? index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={appNameStyle}>{item.app_nome}</div>
                <div style={detailStyle(darkMode)}>
                  Categoria: {categoriasPT[item.categoria] || item.categoria}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={() => navigate("/pesquisa")}
        style={secondaryButtonStyle(darkMode)}
      >
        Nova Pesquisa
      </button>
    </div>
  );
}

// Estilos
const titleStyle = (darkMode) => ({
  marginBottom: "20px",
  color: darkMode ? "#e8eaed" : "#202124",
  textAlign: "center"
});

const noDataStyle = (darkMode) => ({
  textAlign: "center",
  padding: "40px",
  backgroundColor: darkMode ? "#2c2c2c" : "#f5f5f5",
  borderRadius: "8px",
  border: darkMode ? "1px solid #444" : "1px solid #ddd",
});

const buttonStyle = (darkMode) => ({
  marginTop: "15px",
  padding: "10px 20px",
  background: "#fbc02d",
  color: "#000",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
});

const subtitleStyle = (darkMode) => ({
  color: darkMode ? "#e8eaed" : "#202124",
  marginBottom: "15px",
  textAlign: "center"
});

const cardStyle = (darkMode) => ({
  display: "flex",
  alignItems: "center",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px",
  backgroundColor: darkMode ? "#2c2c2c" : "#f5f5f5",
  border: darkMode ? "1px solid #444" : "1px solid #ddd",
});

const positionStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#fbc02d",
  marginRight: "15px",
  minWidth: "30px",
  textAlign: "center"
};

const appNameStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#fff",
  marginBottom: "5px"
};

const detailStyle = (darkMode) => ({
  fontSize: "12px",
  color: darkMode ? "#ccc" : "#666"
});

const secondaryButtonStyle = (darkMode) => ({
  marginTop: "20px",
  padding: "10px 20px",
  background: "transparent",
  color: darkMode ? "#8ab4f8" : "#1976d2",
  border: `1px solid ${darkMode ? "#8ab4f8" : "#1976d2"}`,
  borderRadius: "6px",
  cursor: "pointer",
  width: "100%"
});