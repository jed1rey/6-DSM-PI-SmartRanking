import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

// tradução categorias EN -> PT
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
  "VIDEO_PLAYERS": "Vídeo Players",
  "WEATHER": "Clima",
  "HEALTH_AND_FITNESS": "Saúde e Fitness",
};

export default function Ranking() {
  const { darkMode } = useTheme(); 
  const navigate = useNavigate();
  const location = useLocation();

  // pega os dados vindos via navigate state ou sessionStorage
  const rankingData =
    location.state?.rankingData ||
    (() => {
      try {
        return JSON.parse(sessionStorage.getItem("last_ranking"));
      } catch {
        return null;
      }
    })();

 
  const resultados =
    Array.isArray(rankingData)
      ? rankingData
      : rankingData?.resultados || rankingData?.data?.resultados || [];

  const top10 = resultados.filter((r) => r.tipo_resultado === "TOP10_RANKING");
  const recomendacoes = resultados.filter((r) => r.tipo_resultado === "KNN_RECOMENDACAO");

  if (!rankingData || resultados.length === 0) {
    return (
      <div style={{ 
        padding: 20, 
        maxWidth: 1200, 
        margin: "0 auto",
        minHeight: "calc(65vh - 65px)"
      }}>
        <h2 style={{ textAlign: "center", color: darkMode ? "#e8eaed" : "#202124", marginBottom: 10 }}>Ranking</h2>
        <div style={{
          textAlign: "center",
          padding: 60,
          backgroundColor: darkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(245, 245, 245, 0.8)",
          borderRadius: 16,
          border: darkMode ? "1px solid #444" : "1px solid #ddd",
          backdropFilter: "blur(10px)",
          maxWidth: 600,
          margin: "0 auto"
        }}>
          <p style={{ fontSize: "1.2rem", marginBottom: 15 }}>Nenhum resultado disponível ainda.</p>
          <p style={{ marginBottom: 25, opacity: 0.8 }}>Faça uma pesquisa para ver o ranking e recomendações.</p>
          <button onClick={() => navigate("/pesquisa")} style={{
            marginTop: 12, 
            padding: 15, 
            background: "#fbc02d", 
            border: "none", 
            borderRadius: 8, 
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            minWidth: 200
          }}>
            Ir para Pesquisa
          </button>
        </div>
      </div>
    );
  }

  // componente card usado nas duas listas
  const Card = ({ pos, title, lines = [], accent }) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: 18,
      marginBottom: 15,
      borderRadius: 12,
      background: "rgba(0,0,0,0.55)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.1)",
      transition: "all 0.3s ease"
    }}>
      <div style={{
        minWidth: 45,
        height: 45,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
        backgroundColor: accent || "#fbc02d",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
      }}>{pos}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: "700", marginBottom: 8 }}>{title}</div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: 14, color: "#ddd", lineHeight: 1.4 }}>{l}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: 20, 
      maxWidth: 1200, 
      margin: "0 auto",
      minHeight: "calc(65vh - 65px)"
    }}>
      <h2 style={{ 
        textAlign: "center", 
        color: darkMode ? "#e8eaed" : "#202124", 
        marginBottom: 10,
        fontSize: "2rem"
      }}>
        Resultado da Pesquisa
      </h2>

      {/* LAYOUT EM DUAS COLUNAS - RANKING ESQUERDA, RECOMENDAÇÕES DIREITA */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 30,
        alignItems: "start",
        marginBottom: 30
      }}>
        
        {/* COLUNA DA ESQUERDA - TOP RANKING */}
        <div>
          <h3 style={{ 
            textAlign: "center", 
            color: "#fbc02d", 
            fontSize: "1.5rem", 
            marginBottom: 20,
            padding: 15,
            background: "rgba(0,0,0,0.3)",
            borderRadius: 12,
            border: "1px solid rgba(251, 192, 45, 0.3)"
          }}>
            🏆 Top Ranking
          </h3>
          
          {top10.length > 0 ? (
            <div style={{ height: "500px", overflowY: "auto", paddingRight: 10 }}>
              {top10.map((item, idx) => (
                <Card
                  key={idx}
                  pos={item.posicao ?? idx + 1}
                  title={item.app_nome}
                  lines={[
                    `📁 Categoria: ${categoriasPT[item.categoria] || item.categoria}`,
                    `⭐ Nota Final: ${item.nota_final ?? item.rating ?? "—"}`,
                  ]}
                  accent="#fbc02d"
                />
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: "center", 
              color: "#fff",
              padding: 40,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 12
            }}>
              <p>Nenhum resultado no ranking.</p>
            </div>
          )}
        </div>

        {/* COLUNA DA DIREITA - RECOMENDAÇÕES */}
        <div>
          <h3 style={{ 
            textAlign: "center", 
            color: "#81c995", 
            fontSize: "1.5rem", 
            marginBottom: 20,
            padding: 15,
            background: "rgba(0,0,0,0.3)",
            borderRadius: 12,
            border: "1px solid rgba(129, 201, 149, 0.3)"
          }}>
            Recomendações Baseadas em Similaridades
          </h3>
          
          {recomendacoes.length > 0 ? (
            <div style={{ height: "500px", overflowY: "auto", paddingRight: 10 }}>
              {recomendacoes.map((item, idx) => (
                <Card
                  key={idx}
                  pos={item.posicao ?? idx + 1}
                  title={item.app_nome}
                  lines={[`📁 Categoria: ${categoriasPT[item.categoria] || item.categoria}`]}
                  accent="#81c995"
                />
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: "center", 
              color: "#fff",
              padding: 40,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 12
            }}>
              <p>Nenhuma recomendação disponível.</p>
            </div>
          )}
        </div>
      </div>

      {/* BOTÃO NOVA PESQUISA */}
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <button onClick={() => navigate("/pesquisa")} style={{
          marginTop: 20,
          padding: 15,
          width: "100%",
          background: "#fbc02d",
          color: "#000",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "1rem",
          transition: "all 0.3s ease"
        }}
        onMouseOver={(e) => {
          e.target.style.background = "#ffd54f";
          e.target.style.transform = "translateY(-2px)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#fbc02d";
          e.target.style.transform = "translateY(0)";
        }}>
          Nova Pesquisa
        </button>
      </div>
    </div>
  );
}