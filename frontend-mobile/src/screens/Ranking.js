import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Ranking() {
  const { colors, darkMode } = useTheme();

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
      categoria: "Video",
      instalacoes: "10B+",
      tipo: "Gratuito",
      genero: "Entretenimento",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
    },
    {
      nome: "TikTok",
      categoria: "Video",
      instalacoes: "2B+",
      tipo: "Gratuito",
      genero: "Entretenimento",
      faixa: "12+",
      icone: "https://upload.wikimedia.org/wikipedia/en/6/6b/TikTok_logo.svg"
    },
  ];

  const calculateScore = (index, totalApps) => {
    const maxScore = 100;
    const minScore = 60;
    const scoreRange = maxScore - minScore;
    const score = maxScore - (index * (scoreRange / (totalApps - 1)));
    return Math.round(score);
  };

  return (
    <ScrollView style={{
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: colors.text,
      }}>
        Ranking Top 10 Apps
      </Text>

      <View style={{
        width: '100%',
        maxWidth: 900,
        marginHorizontal: 'auto',
      }}>
        {topApps.map((app, index) => {
          const score = calculateScore(index, topApps.length);
          
          return (
            <View key={index} style={{
              width: '100%',
              padding: 15,
              borderRadius: 10,
              backgroundColor: colors.card,
              marginBottom: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: darkMode ? 0.7 : 0.1,
              shadowRadius: 4,
              elevation: 3,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 }}>
                <Image
                  source={{ uri: app.icone }}
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontWeight: 'bold',
                    color: colors.text,
                    fontSize: 16,
                  }}>
                    {index + 1}º {app.nome}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: colors.text,
                    marginTop: 2,
                  }}>
                    {app.categoria} | {app.tipo} | {app.genero} | {app.faixa}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: colors.text,
                    marginTop: 2,
                  }}>
                    Instalações: {app.instalacoes}
                  </Text>
                </View>
              </View>
              
              <View style={{
                minWidth: 60,
                alignItems: 'flex-end',
              }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: darkMode ? '#81c995' : '#34a853',
                }}>
                  {score}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}