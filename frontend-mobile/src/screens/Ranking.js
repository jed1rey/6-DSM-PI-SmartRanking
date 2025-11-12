import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

// Mapeamento de categorias EN → PT
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

export default function Ranking({ route, navigation }) {
  const { colors, darkMode } = useTheme();
  const rankingData = route.params?.rankingData || {};

  const resultados =
    rankingData.resultados ||
    rankingData?.data?.resultados ||
    rankingData ||
    [];

  const top10 = resultados.filter(r => r.tipo_resultado === "TOP10_RANKING");
  const recomendacoes = resultados.filter(r => r.tipo_resultado === "KNN_RECOMENDACAO");

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
      blurRadius={1}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: darkMode
              ? "rgba(0,0,0,0.6)"
              : "rgba(255,255,255,0.7)",
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text, fontFamily: colors.fontFamily }]}>
          Resultado da Pesquisa
        </Text>

        {/* Ranking Principal */}
        {top10.length > 0 && (
          <>
            <Text
              style={[
                styles.subtitleRanking,
                { color: colors.accent, fontFamily: colors.fontFamily },
              ]}
            >
              🏆 Top Ranking  
            </Text>
            {top10.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.inputBorder },
                ]}
              >
                <Text
                  style={[
                    styles.position,
                    { color: colors.primary, fontFamily: colors.fontFamily },
                  ]}
                >
                  {item.posicao ?? index + 1}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.appName, { color: colors.text, fontFamily: colors.fontFamily }]}
                  >
                    {item.app_nome}
                  </Text>
                  <Text style={[styles.detail, { color: colors.text }]}>
                    Categoria: {categoriasPT[item.categoria] ?? item.categoria}
                  </Text>
                  <Text style={[styles.detail, { color: colors.text }]}>
                    Nota Final: {item.nota_final ?? item.rating}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/*Recomendações*/}
        {recomendacoes.length > 0 && (
          <>
            <Text
              style={[
                styles.subtitleRecomend,
                { color: "#fff", fontFamily: colors.fontFamily },
              ]}
            >
              Recomendações Baseadas em Similaridade
            </Text>
            {recomendacoes.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.inputBorder },
                ]}
              >
                <Text
                  style={[
                    styles.position,
                    { color: colors.secondary, fontFamily: colors.fontFamily },
                  ]}
                >
                  {item.posicao ?? index + 1}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.appName, { color: colors.text, fontFamily: colors.fontFamily }]}
                  >
                    {item.app_nome}
                  </Text>
                  <Text style={[styles.detail, { color: colors.text }]}>
                    Categoria: {categoriasPT[item.categoria] ?? item.categoria}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/*Nenhum Resultado*/}
        {resultados.length === 0 && (
          <Text style={[styles.noData, { color: colors.text, fontFamily: colors.fontFamily }]}>
            Nenhum resultado encontrado.
          </Text>
        )}

        {/*Botão Nova Pesquisa*/}
        <TouchableOpacity
          onPress={() => navigation.navigate("Pesquisa", { resetForm: true })}
          style={[
            styles.newSearchButton,
            { backgroundColor: colors.accent },
          ]}
        >
          <Text
            style={{
              color: darkMode ? "#000" : "#111",
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: colors.fontFamily,
            }}
          >
            🔁 Nova Pesquisa
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "600",
  },
  subtitleRanking: {
    fontSize: 24,
    marginTop: 15,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitleRecomend: {
    fontSize: 20,
    marginTop: 25,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
  },
  position: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 15,
    width: 30,
    textAlign: "center",
  },
  appName: {
    fontSize: 18,
    fontWeight: "600",
  },
  detail: {
    fontSize: 14,
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  newSearchButton: {
    marginTop: 25,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
  },
});
