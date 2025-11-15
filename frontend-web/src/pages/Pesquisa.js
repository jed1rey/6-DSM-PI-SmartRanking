import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { criarPesquisa, obterResultadoPesquisa } from "../services/api";

export default function Pesquisa() {
  const { darkMode } = useTheme();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  // Opções de seleção
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
    { label: "Video Players", value: "VIDEO_PLAYERS" },
    { label: "Tempo (Clima)", value: "WEATHER" },
    { label: "Saúde e Fitness", value: "HEALTH_AND_FITNESS" },
  ];

  const ratings = [
    { label: "1 estrela", value: "1" },
    { label: "2 estrelas", value: "2" },
    { label: "3 estrelas", value: "3" },
    { label: "4 estrelas", value: "4" },
    { label: "5 estrelas", value: "5" },
  ];

  const types = [
    { label: "Grátis", value: "Free" },
    { label: "Pago", value: "Paid" },
  ];

  const sizes = [
    { label: "Pequeno (até 10 MB)", value: "1" },
    { label: "Médio (10 a 50 MB)", value: "2" },
    { label: "Grande (mais de 50 MB)", value: "3" },
  ];

  const installs = [
    { label: "0 – 9.999", value: "0 – 9.999" },
    { label: "10.000 – 99.999", value: "10.000 – 99.999" },
    { label: "100.000 – 999.999", value: "100.000 – 999.999" },
    { label: "1.000.000 – 9.999.999", value: "1.000.000 – 9.999.999" },
    { label: "10.000.000+", value: "10.000.000+" },
  ];

  const contentRatings = [
    { label: "Livre", value: "1" },
    { label: "Livre acima de 10 anos", value: "2" },
    { label: "Adolescente", value: "3" },
    { label: "Acima de 17 anos", value: "4" },
    { label: "Adultos +18", value: "5" },
  ];

  const androidVersions = [
    { label: "Versão até 2.0", value: "2" },
    { label: "Versão até 3.0", value: "3" },
    { label: "Versão até 4.0", value: "4" },
    { label: "Versão até 5.0", value: "5" },
    { label: "Versão até 6.0", value: "6" },
    { label: "Versão até 7.0", value: "7" },
    { label: "Versão acima de 8.0", value: "8" },
  ];

  const handleSubmit = async () => {
    const required = [
      "sentiment",
      "category",
      "rating",
      "type",
      "size",
      "installs",
      "content_rating",
      "android_version",
    ];

    for (const k of required) {
      if (!form[k]) {
        alert("Preencha todos os campos antes de gerar o ranking.");
        return;
      }
    }

    setLoading(true);
    try {
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
        user_id: user.id
      };

      const pesquisaRes = await criarPesquisa(payload, token);
      const pesquisald = pesquisaRes.pesquisa_id;

      if (pesquisald) {
        const resultado = await obterResultadoPesquisa(pesquisald, token);
        // Navega para a página de Ranking com os resultados
        navigate("/ranking", { state: { rankingData: resultado } });
      }
    } catch (err) {
      console.error("Erro na pesquisa:", err);
      alert("Erro ao gerar ranking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={titleStyle(darkMode)}>Pesquisa de Apps</h2>
      
      {[
        { key: "sentiment", label: "Sentimento", options: sentiments },
        { key: "category", label: "Categoria", options: categories },
        { key: "rating", label: "Avaliação Mínima", options: ratings },
        { key: "type", label: "Tipo de App", options: types },
        { key: "size", label: "Tamanho do App", options: sizes },
        { key: "installs", label: "Faixa de Instalações", options: installs },
        { key: "content_rating", label: "Classificação Indicativa", options: contentRatings },
        { key: "android_version", label: "Versão Android", options: androidVersions },
      ].map(({ key, label, options }) => (
        <div key={key} style={{ marginBottom: "15px" }}>
          <label style={{ color: darkMode ? "#e8eaed" : "#202124", display: "block", marginBottom: "5px" }}>
            {label}
          </label>
          <select
            value={form[key] || ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            style={selectStyle(darkMode)}
          >
            <option value="">Selecione {label.toLowerCase()}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button 
        onClick={handleSubmit} 
        disabled={loading}
        style={buttonStyle(darkMode, loading)}
      >
        {loading ? "Gerando..." : "Gerar Ranking"}
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

const selectStyle = (darkMode) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "6px",
  border: darkMode ? "1px solid #555" : "1px solid #ccc",
  backgroundColor: darkMode ? "#3c3c3c" : "#f9f9f9",
  color: darkMode ? "#fff" : "#000",
  fontSize: "14px"
});

const buttonStyle = (darkMode, loading) => ({
  marginTop: "15px",
  padding: "12px",
  width: "100%",
  background: loading ? "#999" : "#fbc02d",
  color: "#000",
  border: "none",
  borderRadius: "6px",
  cursor: loading ? "not-allowed" : "pointer",
  fontWeight: "bold",
});