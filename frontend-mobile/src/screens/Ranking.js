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
  "VIDEO_PLAYERS": "Vídeo Players",
  "WEATHER": "Clima",
  "HEALTH_AND_FITNESS": "Saúde e Fitness",
};

export default function Ranking({ route, navigation }) {
  const { colors, darkMode } = useTheme();

  // Verificação segura de dados recebidos
  const rankingData = route?.params?.rankingData ?? null;
  const resultados =
    rankingData?.resultados ||
    rankingData?.data?.resultados ||
    Array.isArray(rankingData)
      ? rankingData
      : [];

  // Se não houver dados, mostra mensagem e botão
  if (!rankingData || resultados.length === 0) {
    return (
      <ImageBackground
        source={require("../../assets/background.png")}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        resizeMode="cover"
        blurRadius={1}
      >
        <View
          style={{
            backgroundColor: darkMode
              ? "rgba(30,30,30,0.85)"
              : "rgba(0,0,0,0.55)",
            borderRadius: 18,
            padding: 25,
            marginHorizontal: 25,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              textAlign: "center",
              marginBottom: 15,
              fontFamily: colors.fontFamily,
            }}
          >
            Nenhum resultado disponível ainda.  
            Faça uma pesquisa para ver o ranking e recomendações.
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Pesquisa")}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: darkMode ? "#000" : "#111",
                fontSize: 16,
                fontWeight: "bold",
                fontFamily: colors.fontFamily,
              }}
            >
               Ir para Pesquisa
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // Dados válidos → exibe resultado normalmente
  const top10 = resultados.filter((r) => r.tipo_resultado === "TOP10_RANKING");
  const recomendacoes = resultados.filter(
    (r) => r.tipo_resultado === "KNN_RECOMENDACAO"
  );

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={{ flex: 1 }}
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
        <Text
          style={[
            styles.title,
            { color: colors.text, fontFamily: colors.fontFamily },
          ]}
        >
          Resultado da Pesquisa
        </Text>

        {/* Ranking Principal */}
        {top10.length > 0 && (
          <>
            <View
              style={[
                styles.sectionHeader,
                { backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 12 },
              ]}
            >
              <Text
                style={[
                  styles.subtitleRanking,
                  { color: "#fbc02d", fontFamily: colors.fontFamily },
                ]}
              >
                🏆 Top Ranking
              </Text>
            </View>

            {top10.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.card,
                  {
                    backgroundColor: darkMode
                      ? "rgba(30, 30, 30, 0.85)"
                      : "rgba(0, 0, 0, 0.55)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.position,
                    { color: "#fbc02d", fontFamily: colors.fontFamily },
                  ]}
                >
                  {item.posicao ?? index + 1}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.appName,
                      { color: "#fff", fontFamily: colors.fontFamily },
                    ]}
                  >
                    {item.app_nome}
                  </Text>
                  <Text style={[styles.detail, { color: "#ddd" }]}>
                    Categoria: {categoriasPT[item.categoria] ?? item.categoria}
                  </Text>
                  <Text style={[styles.detail, { color: "#ddd" }]}>
                    Nota Final: {item.nota_final ?? item.rating}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Recomendações */}
        {recomendacoes.length > 0 && (
          <>
            <View
              style={[
                styles.sectionHeader,
                { backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 12 },
              ]}
            >
              <Text
                style={[
                  styles.subtitleRecomend,
                  { color: "#fff", fontFamily: colors.fontFamily },
                ]}
              >
                Recomendações Baseadas em Similaridade
              </Text>
            </View>

            {recomendacoes.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.card,
                  {
                    backgroundColor: darkMode
                      ? "rgba(30, 30, 30, 0.85)"
                      : "rgba(0, 0, 0, 0.55)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.position,
                    { color: "#4fc3f7", fontFamily: colors.fontFamily },
                  ]}
                >
                  {item.posicao ?? index + 1}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.appName,
                      { color: "#fff", fontFamily: colors.fontFamily },
                    ]}
                  >
                    {item.app_nome}
                  </Text>
                  <Text style={[styles.detail, { color: "#ddd" }]}>
                    Categoria: {categoriasPT[item.categoria] ?? item.categoria}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Botão Nova Pesquisa */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Pesquisa", { resetForm: true })}
          style={[styles.newSearchButton, { backgroundColor: colors.accent }]}
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
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    alignSelf: "center",
  },
  subtitleRanking: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitleRecomend: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
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
  newSearchButton: {
    marginTop: 25,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
  },
});
