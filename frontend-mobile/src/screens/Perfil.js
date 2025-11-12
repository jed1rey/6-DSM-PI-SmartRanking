import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

// Tradução das categorias EN → PT
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

export default function Perfil({ navigation }) {
  const { colors, darkMode } = useTheme();
  const { user, token, signOut } = useAuth();
  const [pesquisas, setPesquisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abrindo, setAbrindo] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigation.navigate("Home");
    Alert.alert("Logout", "Você saiu da conta.");
  };

  useEffect(() => {
    const fetchPesquisas = async () => {
      if (!user?.id) return;
      try {
        const url = `https://six-dsm-pi-smartranking.onrender.com/api/pesquisas/user/${user.id}`;
        const resp = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPesquisas(resp.data || []);
      } catch (err) {
        console.error("Erro ao carregar pesquisas:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPesquisas();
  }, [user]);

  const abrirPesquisa = async (pesquisaId) => {
    try {
      setAbrindo(true);
      const url = `https://six-dsm-pi-smartranking.onrender.com/api/resultados/${pesquisaId}`;
      const resp = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigation.navigate("Ranking", { rankingData: resp.data });
    } catch (err) {
      console.error("Erro ao abrir pesquisa:", err.response?.data || err.message);
      Alert.alert("Erro", "Não foi possível abrir o resultado desta pesquisa.");
    } finally {
      setAbrindo(false);
    }
  };

  // Caso não haja usuário logado
  if (!user) {
    return (
      <ImageBackground
        source={require("../../assets/background.png")}
        style={{ flex: 1, width: "100%", height: "100%" }}
        resizeMode="cover"
        blurRadius={1}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: darkMode
              ? "rgba(0,0,0,0.5)"
              : "rgba(255,255,255,0.6)",
            padding: 20,
          }}
        >
          <Text
            style={{
              color: colors.text,
              textAlign: "center",
              fontSize: 18,
              fontFamily: colors.fontFamily,
            }}
          >
            Nenhum usuário logado.
          </Text>
        </View>
      </ImageBackground>
    );
  }

  // Layout principal
  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
      blurRadius={1}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 40,
          backgroundColor: darkMode
            ? "rgba(0,0,0,0.6)"
            : "rgba(255,255,255,0.7)",
        }}
      >
        <Text
          style={{
            fontSize: 34,
            textAlign: "center",
            marginBottom: 25,
            color: colors.text,
            fontFamily: colors.fontFamily,
          }}
        >
          Perfil do Usuário
        </Text>

        {/* Card do usuário */}
        <View
          style={{
            backgroundColor: darkMode
              ? "rgba(30, 30, 30, 0.85)"
              : "rgba(0, 0, 0, 0.55)",
            borderRadius: 18,
            padding: 25,
            marginBottom: 25,
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 3 },
            elevation: 6,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 8,
              fontFamily: colors.fontFamily,
            }}
          >
            {user.nome}
          </Text>
          <Text
            style={{
              color: "#ddd",
              fontSize: 16,
              marginBottom: 5,
              fontFamily: colors.fontFamily,
            }}
          >
            {user.email}
          </Text>
          <Text
            style={{
              color: "#ddd",
              fontSize: 16,
              fontFamily: colors.fontFamily,
            }}
          >
            {" "}
            {user.data_nascimento
              ? new Date(user.data_nascimento).toLocaleDateString("pt-BR")
              : "—"}
          </Text>
        </View>

        {/* Histórico de Pesquisas */}
        <Text
          style={{
            fontSize: 22,
            color: colors.accent,
            marginBottom: 15,
            textAlign: "center",
            fontFamily: colors.fontFamily,
          }}
        >
          Histórico de Pesquisas
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : pesquisas.length > 0 ? (
          pesquisas.map((p, i) => (
            <TouchableOpacity
              key={p.id || i}
              onPress={() => abrirPesquisa(p.id)}
              style={{
                backgroundColor: darkMode
                  ? "rgba(30, 30, 30, 0.85)"
                  : "rgba(0, 0, 0, 0.55)",
                borderRadius: 18,
                padding: 18,
                marginBottom: 14,
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 3 },
                elevation: 6,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 5,
                  fontFamily: colors.fontFamily,
                }}
              >
                Pesquisa {i + 1}
              </Text>
              <Text style={{ color: "#ddd", fontFamily: colors.fontFamily }}>
                Categoria: {categoriasPT[p.category] ?? p.category ?? "—"}
              </Text>
              <Text style={{ color: "#ddd", fontFamily: colors.fontFamily }}>
                Data:{" "}
                {p.criado_em
                  ? new Date(p.criado_em).toLocaleString("pt-BR")
                  : "—"}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text
            style={{
              color: colors.text,
              textAlign: "center",
              fontSize: 16,
              marginTop: 10,
              fontFamily: colors.fontFamily,
            }}
          >
            Nenhuma pesquisa encontrada.
          </Text>
        )}

        {abrindo && (
          <ActivityIndicator
            size="large"
            color={colors.accent}
            style={{ marginVertical: 10 }}
          />
        )}

        {/* Botão de logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: "#d32f2f",
            padding: 14,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 30,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: colors.fontFamily,
            }}
          >
            Sair da Conta
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
