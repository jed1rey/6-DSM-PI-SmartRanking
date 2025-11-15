import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

// Mapeamentos de categorias e traduções
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

const traducao = {
  sentiment: {
    POSITIVO: "Positivo",
    NEUTRO: "Neutro",
    NEGATIVO: "Negativo",
    "0.0": "Neutro",
    "1.0": "Positivo",
    "-1.0": "Negativo",
  },
  type: { Free: "Grátis", Paid: "Pago" },
  size: {
    1: "Pequeno (até 10 MB)",
    2: "Médio (10 a 50 MB)",
    3: "Grande (mais de 50 MB)",
  },
  content_rating: {
    1: "Livre",
    2: "Livre acima de 10 anos",
    3: "Adolescente",
    4: "Acima de 17 anos",
    5: "Adultos +18",
  },
  android_version: {
    2: "até 2.0",
    3: "até 3.0",
    4: "até 4.0",
    5: "até 5.0",
    6: "até 6.0",
    7: "até 7.0",
    8: "acima de 8.0",
  },
  rating: {
    1: "1 estrela",
    2: "2 estrelas",
    3: "3 estrelas",
    4: "4 estrelas",
    5: "5 estrelas",
  },
};

export default function Perfil() {
  const { darkMode } = useTheme();
  const { user, token, signOut } = useAuth();
  const [pesquisas, setPesquisas] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPesquisas = async () => {
      if (user?.id && token) {
        try {
          // Usando a rota correta do backend
          const response = await fetch(`https://six-dsm-pi-smartranking.onrender.com/api/pesquisas/user/${user.id}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          });
          
          if (response.ok) {
            const pesquisasData = await response.json();
            setPesquisas(pesquisasData || []);
          } else {
            console.error("Erro ao carregar pesquisas:", response.status);
            setPesquisas([]);
          }
        } catch (err) {
          console.error("Erro ao carregar pesquisas:", err);
          setPesquisas([]);
        } finally {
          setLoading(false);
        }
      }
    };

    carregarPesquisas();
  }, [user, token]);

  const handleLogout = () => {
    signOut();
    window.location.href = "/";
  };

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  if (!user) {
    return (
      <div>
        <h2 style={titleStyle(darkMode)}>Nenhum usuário logado.</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 style={titleStyle(darkMode)}>Perfil do Usuário</h2>

      <div style={sectionStyle}>
        <div><strong>Nome:</strong> {user.nome}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Data de Nascimento:</strong> {user.data_nascimento}</div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3 style={subtitleStyle(darkMode)}>Histórico de Pesquisas</h3>

        {loading ? (
          <p style={{ textAlign: "center", color: darkMode ? "#ccc" : "#666" }}>
            Carregando...
          </p>
        ) : pesquisas.length > 0 ? (
          pesquisas.map((pesquisa, index) => (
            <div key={index} style={pesquisaItemStyle(darkMode)}>
              <div 
                style={pesquisaHeaderStyle}
                onClick={() => toggleExpand(index)}
              >
                <div>
                  <div style={pesquisaTitleStyle}>
                    Pesquisa {index + 1}
                  </div>
                  <div style={pesquisaDetailStyle}>
                    Categoria: {categoriasPT[pesquisa.category] || pesquisa.category}
                  </div>
                  <div style={pesquisaDetailStyle}>
                    Data: {new Date(pesquisa.criado_em).toLocaleString("pt-BR")}
                  </div>
                </div>
                <div style={expandIconStyle}>
                  {expanded === index ? "▲" : "▼"}
                </div>
              </div>

              {expanded === index && (
                <div style={pesquisaDetailsStyle}>
                  <div style={detailRowStyle}>
                    <strong>Sentimento:</strong> {traducao.sentiment[pesquisa.sentiment] || pesquisa.sentiment}
                  </div>
                  <div style={detailRowStyle}>
                    <strong>Tipo:</strong> {traducao.type[pesquisa.app_type] || pesquisa.app_type}
                  </div>
                  <div style={detailRowStyle}>
                    <strong>Tamanho:</strong> {traducao.size[pesquisa.app_size] || pesquisa.app_size}
                  </div>
                  <div style={detailRowStyle}>
                    <strong>Classificação Indicativa:</strong> {traducao.content_rating[pesquisa.content_rating] || pesquisa.content_rating}
                  </div>
                  <div style={detailRowStyle}>
                    <strong>Versão Android:</strong> {traducao.android_version[pesquisa.android_version] || pesquisa.android_version}
                  </div>
                  <div style={detailRowStyle}>
                    <strong>Avaliação Mínima:</strong> {traducao.rating[pesquisa.min_rating] || pesquisa.min_rating}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: darkMode ? "#ccc" : "#666" }}>
            Nenhuma pesquisa encontrada.
          </p>
        )}
      </div>

      <button 
        onClick={handleLogout}
        style={logoutButtonStyle(darkMode)}
      >
        Sair da Conta
      </button>
    </div>
  );
}

// Estilos para o Perfil
const titleStyle = (darkMode) => ({
  marginBottom: "20px",
  color: darkMode ? "#e8eaed" : "#202124",
  textAlign: "center"
});

const sectionStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px"
};

const subtitleStyle = (darkMode) => ({
  color: darkMode ? "#e8eaed" : "#202124",
  textAlign: "center",
  marginBottom: "15px"
});

const pesquisaItemStyle = (darkMode) => ({
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px",
  backgroundColor: darkMode ? "#3c3c3c" : "#f5f5f5",
  border: darkMode ? "1px solid #555" : "1px solid #ddd",
});

const pesquisaHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  cursor: "pointer"
};

const pesquisaTitleStyle = {
  fontWeight: "bold",
  marginBottom: "5px"
};

const pesquisaDetailStyle = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "2px"
};

const expandIconStyle = {
  color: "#fbc02d",
  fontSize: "18px"
};

const pesquisaDetailsStyle = {
  marginTop: "10px",
  paddingTop: "10px",
  borderTop: "1px solid #555"
};

const detailRowStyle = {
  marginBottom: "5px",
  fontSize: "14px"
};

const logoutButtonStyle = (darkMode) => ({
  marginTop: "20px",
  padding: "10px 20px",
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%"
});