import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function Ranking() {
  const { darkMode } = useTheme();

  // Mock de 10 apps
  const topApps = [
    {
      nome: "Spotify",
      categoria: "Música",
      instalacoes: "500M+",
      tipo: "Gratuito",
      genero: "Entretenimento",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
    },
    {
      nome: "Deezer",
      categoria: "Música",
      instalacoes: "100M+",
      tipo: "Gratuito",
      genero: "Entretenimento",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/commons/4/48/Deezer_logo.svg"
    },
    {
      nome: "Amazon Music",
      categoria: "Música",
      instalacoes: "50M+",
      tipo: "Pago",
      genero: "Entretenimento",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Amazon_Music_logo.svg"
    },
    {
      nome: "YouTube",
      categoria: "Vídeo",
      instalacoes: "10B+",
      tipo: "Gratuito",
      genero: "Entretenimento",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
    },
    {
      nome: "TikTok",
      categoria: "Vídeo",
      instalacoes: "2B+",
      tipo: "Gratuito",
      genero: "Entretenimento",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/en/6/6b/TikTok_logo.svg"
    },
    {
      nome: "Netflix",
      categoria: "Vídeo",
      instalacoes: "1B+",
      tipo: "Pago",
      genero: "Entretenimento",
      faixa: "16+",
      icone: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
    },
    {
      nome: "Instagram",
      categoria: "Social",
      instalacoes: "1B+",
      tipo: "Gratuito",
      genero: "Rede Social",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
    },
    {
      nome: "Facebook",
      categoria: "Social",
      instalacoes: "5B+",
      tipo: "Gratuito",
      genero: "Rede Social",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
    },
    {
      nome: "Messenger",
      categoria: "Social",
      instalacoes: "1B+",
      tipo: "Gratuito",
      genero: "Comunicação",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/commons/8/83/Facebook_Messenger_4_Logo.svg"
    },
    {
      nome: "WhatsApp",
      categoria: "Social",
      instalacoes: "5B+",
      tipo: "Gratuito",
      genero: "Comunicação",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    },
  ];

  
  const calculateScore = (index, totalApps) => {
    const maxScore = 100;
    const minScore = 60; // Definindo uma nota mínima para o último colocado
    const scoreRange = maxScore - minScore;
    
    
    const score = maxScore - (index * (scoreRange / (totalApps - 1)));
    return Math.round(score); 
  };

  return (
    <div style={containerStyle(darkMode)}>
      <h2 style={titleStyle(darkMode)}>Ranking Top 10 Apps</h2>

      {topApps.map((app, index) => {
        const score = calculateScore(index, topApps.length); 
        return (
          <div key={index} style={cardStyle(darkMode)}>
           
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <img src={app.icone} alt={app.nome} style={{ width: 50, height: 50, borderRadius: 10 }} />
                <div>
                  <strong>{index + 1}º - {app.nome}</strong>
                  <div style={textStyle(darkMode)}>
                    {app.categoria} | {app.tipo} | {app.genero} | {app.faixa}
                  </div>
                  <div style={textStyle(darkMode)}>Instalações: {app.instalacoes}</div>
                </div>
              </div>
              
              <div style={scoreStyle(darkMode)}>
                {score}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const containerStyle = (darkMode) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
  width: "100%",
  maxWidth: "600px", 
  margin: "20px auto", 
  padding: "0 15px" 
});

const titleStyle = (darkMode) => ({
  marginBottom: 20,
  color: darkMode ? "#e8eaed" : "#202124",
  textAlign: "center"
});

const cardStyle = (darkMode) => ({
  width: "100%",
  padding: 15,
  borderRadius: 10,
  backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
  boxShadow: darkMode ? "0px 4px 10px rgba(0,0,0,0.7)" : "0px 4px 10px rgba(0,0,0,0.1)",
  transition: "background 0.3s ease, box-shadow 0.3s ease",
  display: "flex", 
  alignItems: "center", 
  justifyContent: "space-between", 
});

const textStyle = (darkMode) => ({
  fontSize: 13,
  color: darkMode ? "#e8eaed" : "#202124",
  marginTop: 2,
});


const scoreStyle = (darkMode) => ({
  fontSize: 24,
  fontWeight: "bold",
  color: darkMode ? "#81c995" : "#34a853", 
  minWidth: "60px", 
  textAlign: "right",
});