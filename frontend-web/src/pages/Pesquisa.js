// src/pages/Pesquisa.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { criarPesquisa, obterResultadoPesquisa } from "../services/api";

export default function Pesquisa() {
  const { darkMode } = useTheme();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);


  const sentiments = [
    { label: "Positivo", value: "POSITIVO" },
    { label: "Neutro", value: "NEUTRO" },
    { label: "Negativo", value: "NEGATIVO" },
  ];

  const categories = [
    { label: "Arte e Design", value: "ART_AND_DESIGN" },
    { label: "Beleza", value: "BEAUTY" },
    { label: "Livros e Referências", value: "BOOKS_AND_REFERENCE" },
    { label: "Negócios", value: "BUSINESS" },
    { label: "Quadrinhos", value: "COMICS" },
    { label: "Comunicação", value: "COMMUNICATION" },
    { label: "Relacionamento", value: "DATING" },
    { label: "Educação", value: "EDUCATION" },
    { label: "Entretenimento", value: "ENTERTAINMENT" },
    { label: "Eventos", value: "EVENTS" },
    { label: "Família", value: "FAMILY" },
    { label: "Finanças", value: "FINANCE" },
    { label: "Comida e Bebida", value: "FOOD_AND_DRINK" },
    { label: "Jogos", value: "GAME" },
    { label: "Casa e Lar", value: "HOUSE_AND_HOME" },
    { label: "Bibliotecas e Demonstração", value: "LIBRARIES_AND_DEMO" },
    { label: "Estilo de Vida", value: "LIFESTYLE" },
    { label: "Mapas e Navegação", value: "MAPS_AND_NAVIGATION" },
    { label: "Medicina", value: "MEDICAL" },
    { label: "Notícias e Revistas", value: "NEWS_AND_MAGAZINES" },
    { label: "Paternidade", value: "PARENTING" },
    { label: "Personalização", value: "PERSONALIZATION" },
    { label: "Fotografia", value: "PHOTOGRAPHY" },
    { label: "Produtividade", value: "PRODUCTIVITY" },
    { label: "Compras", value: "SHOPPING" },
    { label: "Social", value: "SOCIAL" },
    { label: "Esportes", value: "SPORTS" },
    { label: "Ferramentas", value: "TOOLS" },
    { label: "Viagem e Localização", value: "TRAVEL_AND_LOCAL" },
    { label: "Vídeo Players", value: "VIDEO_PLAYERS" },
    { label: "Tempo (Clima)", value: "WEATHER" },
    { label: "Saúde e Fitness", value: "HEALTH_AND_FITNESS" },
  ];

  const ratings = [
    { label: "1 estrela", value: "1 estrela" },
    { label: "2 estrelas", value: "2 estrelas" },
    { label: "3 estrelas", value: "3 estrelas" },
    { label: "4 estrelas", value: "4 estrelas" },
    { label: "5 estrelas", value: "5 estrelas" },
  ];

  const types = [
    { label: "Grátis", value: "GRÁTIS" },
    { label: "Pago", value: "PAGO" },
  ];

  const sizes = [
    { label: "Pequeno (até 10 MB)", value: "PEQUENO (ATÉ 10 MB)" },
    { label: "Médio (entre 10 a 50 MB)", value: "MÉDIO ( ENTRE 10 A 50 MB)" },
    { label: "Grande (maior que 50 MB)", value: "GRANDE (MAIOR QUE 50 MB)" },
  ];

  const installs = [
    { label: "0 – 9.999", value: "0 – 9,999" },
    { label: "10.000 – 99.999", value: "10,000 – 99,999" },
    { label: "100.000 – 999.999", value: "100,000 – 999,999" },
    { label: "1.000.000 – 9.999.999", value: "1,000,000 – 9,999,999" },
    { label: "10.000.000+", value: "10,000,000+" },
  ];

  const contentRatings = [
    { label: "Livre", value: "LIVRE" },
    { label: "Livre acima de 10 anos", value: "LIVRE ACIMA DE 10 ANOS" },
    { label: "Adolescente", value: "ADOLESCENTE" },
    { label: "Acima de 17 anos", value: "ACIMA DE 17 ANOS" },
    { label: "Adultos +18", value: "ADULTOS +18" },
  ];

  const androidVersions = [
    { label: "Versão até 2.0", value: "ANDROID VERSÃO ATÉ 2.0" },
    { label: "Versão até 3.0", value: "ANDROID VERSÃO ATÉ 3.0" },
    { label: "Versão até 4.0", value: "ANDROID VERSÃO ATÉ 4.0" },
    { label: "Versão até 5.0", value: "ANDROID VERSÃO ATÉ 5.0" },
    { label: "Versão até 6.0", value: "ANDROID VERSÃO ATÉ 6.0" },
    { label: "Versão até 7.0", value: "ANDROID VERSÃO ATÉ 7.0" },
    { label: "Versão acima de 8.0", value: "ANDROID VERSÃO ACIMA DE 8.0" },
  ];

  const requiredKeys = [
    "sentiment",
    "category",
    "rating",
    "type",
    "size",
    "installs",
    "content_rating",
    "android_version",
  ];

  const handleSubmit = async () => {
    for (const k of requiredKeys) {
      if (!form[k]) {
        alert("Preencha todos os campos antes de gerar o ranking.");
        return;
      }
    }

    const payload = {
      sentiment: form.sentiment,
      category: form.category,
      rating: form.rating,
      type: form.type,
      size: form.size,
      installs: form.installs,
      content_rating: form.content_rating,
      android_version: form.android_version,
      ordenacao: "Nota_Final",
      user_id: user?.id, 
    };

    setLoading(true);
    try {
      const postRes = await criarPesquisa(payload, token);
      
      const pesquisaId = postRes?.pesquisa_id || postRes?.id;
      if (!pesquisaId) {
        throw new Error("Backend não retornou pesquisa_id.");
      }

      // buscar resultado dessa pesquisa específica
      const resultado = await obterResultadoPesquisa(pesquisaId, token);
      // salva em sessionStorage como fallback
      sessionStorage.setItem("last_ranking", JSON.stringify(resultado));
      // navega para ranking passando via state
      navigate("/ranking", { state: { rankingData: resultado } });
    } catch (err) {
      console.error("Erro na pesquisa:", err);
      alert("Erro ao gerar ranking. Verifique o backend.");
    } finally {
      setLoading(false);
    }
  };

  // utilitário de render select
  const renderSelect = (key, label, options) => (
  <div key={key} style={{ marginBottom: 20 }}>
    <label style={{ 
      display: "block", 
      marginBottom: 8, 
      color: darkMode ? "#e8eaed" : "#202124",
      fontWeight: "500", 
      fontSize: "1rem",
      fontFamily: "'Inter', sans-serif"
    }}>
      {label}
    </label>
    <select
      value={form[key] || ""}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      style={{
        width: "100%",
        padding: 14,
        borderRadius: 10,
        border: darkMode ? "1px solid #555" : "1px solid #ccc",
        backgroundColor: darkMode ? "rgba(60, 60, 60, 0.8)" : "rgba(255, 255, 255, 0.9)",
        color: darkMode ? "#fff" : "#000",
        fontSize: "1rem",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "400" 
      }}
        onFocus={(e) => {
          e.target.style.borderColor = "#fbc02d";
          e.target.style.boxShadow = "0 0 0 2px rgba(251, 192, 45, 0.2)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = darkMode ? "#555" : "#ccc";
          e.target.style.boxShadow = "none";
        }}
      >
        <option value="">Selecione {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div style={{ 
      padding: 20, 
      maxWidth: 1200, 
      margin: "0 auto",
      minHeight: "calc(70vh - 70px)"
    }}>
      <h2 style={{ 
        textAlign: "center", 
        color: darkMode ? "#e8eaed" : "#202124", 
        marginBottom: 10,
        fontSize: "2rem"
      }}>
        Pesquisa de Apps
      </h2>

      <p style={{
        textAlign: "center",
        color: darkMode ? "#ccc" : "#666",
        marginBottom: 30,
        fontSize: "1.1rem",
        maxWidth: 600,
        margin: "0 auto 30px auto"
      }}>
        Selecione os critérios para gerar seu ranking personalizado de aplicativos
      </p>

      {/* LAYOUT EM DUAS COLUNAS - 4 SELECÕES EM CADA LADO */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 40,
        alignItems: "start",
        marginBottom: 30
      }}>
        
        {/* COLUNA DA ESQUERDA - PRIMEIRAS 4 SELECÕES */}
        <div>
          {renderSelect("sentiment", " Sentimento", sentiments)}
          {renderSelect("category", " Categoria", categories)}
          {renderSelect("rating", " Avaliação (Estrelas)", ratings)}
          {renderSelect("type", " Tipo de App", types)}
        </div>

        {/* COLUNA DA DIREITA - ÚLTIMAS 4 SELECÕES */}
        <div>
          {renderSelect("size", " Tamanho do App", sizes)}
          {renderSelect("installs", " Faixa de Instalações", installs)}
          {renderSelect("content_rating", " Classificação Indicativa", contentRatings)}
          {renderSelect("android_version", " Versão Android", androidVersions)}
        </div>
      </div>

      {/* BOTÃO GERAR RANKING CENTRALIZADO */}
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: 20,
            padding: 16,
            width: "100%",
            background: loading ? "#999" : "#fbc02d",
            border: "none",
            borderRadius: 10,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "700",
            fontSize: "1.1rem",
            color: "#000",
            transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 4px 12px rgba(251, 192, 45, 0.3)"
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.background = "#ffd54f";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(251, 192, 45, 0.4)";
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.background = "#fbc02d";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(251, 192, 45, 0.3)";
            }
          }}
        >
          {loading ? " Gerando Ranking..." : " Gerar Ranking"}
        </button>
      </div>

      {/* MENSAGEM DE AJUDA */}
      <div style={{
        textAlign: "center",
        color: darkMode ? "#fff" : "#fff",
        marginTop: 25,
        fontSize: "0.9rem",
        padding: 15,
        background: darkMode ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.05)",
        borderRadius: 8,
        maxWidth: 600,
        margin: "25px auto 0 auto"
      }}>
        <p style={{ margin: 0 }}>
          💡 <strong>Dica:</strong> Preencha todos os campos para obter o ranking mais preciso
        </p>
      </div>
    </div>
  );
}