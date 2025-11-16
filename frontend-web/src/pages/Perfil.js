import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { obterPesquisasUsuario, obterResultadoPesquisa } from "../services/api";
import { useNavigate } from "react-router-dom";


const categoriasPT = {
  "ART_AND_DESIGN": "Arte e Design", "BEAUTY": "Beleza", "BOOKS_AND_REFERENCE": "Livros e Referências",
  "BUSINESS": "Negócios", "COMICS": "Quadrinhos", "COMMUNICATION": "Comunicação", "DATING": "Relacionamento",
  "EDUCATION": "Educação", "ENTERTAINMENT": "Entretenimento", "EVENTS": "Eventos", "FAMILY": "Família",
  "FINANCE": "Finanças", "FOOD_AND_DRINK": "Comida e Bebida", "GAME": "Jogos", "HOUSE_AND_HOME": "Casa e Lar",
  "LIBRARIES_AND_DEMO": "Bibliotecas e Demonstração", "LIFESTYLE": "Estilo de Vida",
  "MAPS_AND_NAVIGATION": "Mapas e Navegação", "MEDICAL": "Medicina", "NEWS_AND_MAGAZINES": "Notícias e Revistas",
  "PARENTING": "Paternidade", "PERSONALIZATION": "Personalização", "PHOTOGRAPHY": "Fotografia",
  "PRODUCTIVITY": "Produtividade", "SHOPPING": "Compras", "SOCIAL": "Social", "SPORTS": "Esportes",
  "TOOLS": "Ferramentas", "TRAVEL_AND_LOCAL": "Viagem e Localização", "VIDEO_PLAYERS": "Vídeo Players",
  "WEATHER": "Clima", "HEALTH_AND_FITNESS": "Saúde e Fitness"
};

const traducao = {
  sentiment: { "0.0": "Neutro", "1.0": "Positivo", "-1.0": "Negativo" },
  type: { Free: "Grátis", Paid: "Pago" },
  size: { 1: "Pequeno (até 10 MB)", 2: "Médio (10 a 50 MB)", 3: "Grande (mais de 50 MB)" },
  content_rating: {
    1: "Livre", 2: "Livre acima de 10 anos", 3: "Adolescente",
    4: "Acima de 17 anos", 5: "Adultos +18"
  },
  android_version: {
    2:"até 2.0", 3:"até 3.0", 4:"até 4.0", 5:"até 5.0",
    6:"até 6.0", 7:"até 7.0", 8:"acima de 8.0"
  },
  rating: {
    1:"1 estrela", 2:"2 estrelas", 3:"3 estrelas", 4:"4 estrelas", 5:"5 estrelas"
  }
};

export default function Perfil() {
  const { colors } = useTheme();
  const { user, token } = useAuth(); 
  const navigate = useNavigate();

  const [pesquisas, setPesquisas] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    let ativo = true;

    const load = async () => {
      if (!user?.id) return;

      try {
        const dados = await obterPesquisasUsuario(user.id, token);
        const arr = Array.isArray(dados) ? [...dados] : [];

        // ordenar "da mais antiga para a mais nova" = 1,2,3,4...
        arr.sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));

        if (ativo) setPesquisas(arr);
      } catch (err) {
        console.error("Erro buscando pesquisas:", err);
      } finally {
        if (ativo) setLoading(false);
      }
    };

    load();
    const timer = setInterval(load, 5000);

    return () => { ativo = false; clearInterval(timer); };
  }, [user, token]);


  const abrirPesquisa = async (pesquisaId) => {
    try {
      const resp = await obterResultadoPesquisa(pesquisaId, token);

      sessionStorage.setItem("last_ranking", JSON.stringify(resp));

      navigate("/ranking");
    } catch (err) {
      alert("Erro ao abrir resultado.");
    }
  };

  if (!user) {
    return (
      <h2 style={{ color: "#fff", textAlign: "center" }}>
        Nenhum usuário logado.
      </h2>
    );
  }


  return (
    <div style={{ 
      padding: 20, 
      maxWidth: 1200, 
      margin: "0 auto",
      minHeight: "calc(70vh - 70px)"
    }}>
      <h2 style={{ 
        textAlign: "center", 
        color: colors.text, 
        marginBottom: 10,
        fontSize: "2rem"
      }}>
        Perfil do Usuário
      </h2>

      {/* SUBTÍTULO DO HISTÓRICO FORA DOS CONTAINERS */}
      <h3 style={{ 
        color: colors.accent, 
        textAlign: "center", 
        marginBottom: 25,
        fontSize: "1.5rem"
      }}>
         Histórico de Pesquisas
      </h3>

      {/* LAYOUT EM DUAS COLUNAS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: 30,
        alignItems: "start"
      }}>
        
        {/* COLUNA DA ESQUERDA - DADOS DO USUÁRIO */}
        <div>
          {/* CARD DO USUÁRIO */}
          <div style={{
            background: "rgba(0,0,0,0.55)",
            padding: 30,
            borderRadius: 16,
            textAlign: "center",
            marginBottom: 20,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fbc02d, #ff9800)",
              margin: "0 auto 20px auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              color: "#fff"
            }}>
              {user.nome?.charAt(0)?.toUpperCase() || "U"}
            </div>
            
            <h3 style={{ 
              color: "#fff", 
              marginBottom: 10,
              fontSize: "1.5rem"
            }}>
              {user.nome}
            </h3>
            <p style={{ 
              color: "#ddd", 
              marginBottom: 8,
              fontSize: "1rem"
            }}>
               {user.email}
            </p>
            <p style={{ 
              color: "#ddd",
              fontSize: "0.9rem"
            }}>
               {user.data_nascimento ? new Date(user.data_nascimento).toLocaleDateString("pt-BR") : "Data não informada"}
            </p>
          </div>
        </div>

        {/* COLUNA DA DIREITA - HISTÓRICO DE PESQUISAS */}
        <div>
          {loading ? (
            <div style={{ 
              textAlign: "center", 
              color: colors.text,
              padding: 40 
            }}>
              <p>Carregando suas pesquisas...</p>
            </div>
          ) : pesquisas.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              color: colors.text,
              padding: 40,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 12
            }}>
              <p style={{ fontSize: "1.1rem", marginBottom: 10 }}>
                Nenhuma pesquisa encontrada.
              </p>
              <p style={{ opacity: 0.8 }}>
                Faça sua primeira pesquisa para ver o histórico aqui!
              </p>
            </div>
          ) : (
            <div style={{ maxHeight: "600px", overflowY: "auto", paddingRight: 10 }}>
              {pesquisas.map((p, i) => {
                const index = i + 1;
                const aberto = expanded === i;

                return (
                  <div key={p.id} style={{
                    background: "rgba(0,0,0,0.55)",
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 15,
                    color: "#fff",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease"
                  }}>
                    <div
                      style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        cursor: "pointer" 
                      }}
                      onClick={() => setExpanded(aberto ? null : i)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: "bold", 
                          fontSize: "1.1rem",
                          marginBottom: 5
                        }}>
                           Pesquisa {index}
                        </div>
                        <div style={{ color: "#ccc", fontSize: "0.9rem" }}>
                           {categoriasPT[p.category] ?? p.category}
                        </div>
                        <div style={{ color: "#ccc", fontSize: "0.9rem" }}>
                           {new Date(p.criado_em).toLocaleString("pt-BR")}
                        </div>
                      </div>

                      <div style={{ 
                        color: "#fbc02d", 
                        fontSize: 24,
                        transition: "transform 0.3s ease",
                        transform: aberto ? "rotate(180deg)" : "rotate(0deg)"
                      }}>
                        {aberto ? "▲" : "▼"}
                      </div>
                    </div>

                    {aberto && (
                      <div style={{ 
                        marginTop: 15, 
                        color: "#ddd",
                        padding: 15,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        borderLeft: "3px solid #fbc02d"
                      }}>
                        <div style={{ 
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                          marginBottom: 15
                        }}>
                          <div><strong>Sentimento:</strong> {traducao.sentiment[p.sentiment] ?? p.sentiment}</div>
                          <div><strong>Tipo:</strong> {traducao.type[p.app_type] ?? p.app_type}</div>
                          <div><strong>Tamanho:</strong> {traducao.size[p.app_size] ?? p.app_size}</div>
                          <div><strong>Classificação:</strong> {traducao.content_rating[p.content_rating] ?? p.content_rating}</div>
                          <div><strong>Versão Android:</strong> {traducao.android_version[p.android_version] ?? p.android_version}</div>
                          <div><strong>Avaliação mínima:</strong> {traducao.rating[p.min_rating] ?? p.min_rating}</div>
                        </div>

                        <button
                          onClick={() => abrirPesquisa(p.id)}
                          style={{
                            width: "100%",
                            background: "#fbc02d",
                            padding: 12,
                            borderRadius: 8,
                            border: "none",
                            cursor: "pointer",
                            color: "#000",
                            fontWeight: "600",
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
                          }}
                        >
                           Ver Resultado Completo
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}