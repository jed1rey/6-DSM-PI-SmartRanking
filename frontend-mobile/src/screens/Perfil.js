import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

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

export default function Perfil({ navigation }) {
  const { colors, darkMode } = useTheme();
  const { user, token, signOut } = useAuth();
  const [pesquisas, setPesquisas] = useState([]);
  const [expanded, setExpanded] = useState(null);
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

    // Atualiza automaticamente a cada 30 segundos
    const interval = setInterval(fetchPesquisas, 30000);
    return () => clearInterval(interval);
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
      Alert.alert("Erro", "Não foi possível abrir o resultado desta pesquisa.");
    } finally {
      setAbrindo(false);
    }
  };

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  if (!user) {
    return (
      <ImageBackground
        source={require("../../assets/background.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
        blurRadius={1}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)", 
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>Nenhum usuário logado.</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
      blurRadius={1}
    >
      {/* camada fumê sobre o blur */}
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 34,
              textAlign: "center",
              marginBottom: 25,
              color: "#fff",
              fontFamily: colors.fontFamily,
            }}
          >
            Perfil do Usuário
          </Text>

          {/* Card de informações do usuário */}
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.55)",
              borderRadius: 18,
              padding: 25,
              marginBottom: 25,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 25, fontFamily: colors.fontFamily, color: "#fff", marginBottom: 8 }}>
              {user.nome}
            </Text>
            <Text style={{ color: "#ddd", fontSize: 18, marginBottom: 5 }}>{user.email}</Text>
            <Text style={{ color: "#ddd", fontSize: 18 }}>
              {user.data_nascimento
                ? new Date(user.data_nascimento).toLocaleDateString("pt-BR")
                : "—"}
            </Text>
          </View>

          {/* Histórico */}
          <Text
            style={{
              fontSize: 22,
              fontFamily: colors.fontFamily,
              color: "#fbc02d",
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            Histórico de Pesquisas
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : pesquisas.length > 0 ? (
            [...pesquisas]
              .sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em)) 
              .map((p, i) => {
                const isOpen = expanded === i;
                return (
                  <View
                    key={i}
                    style={{
                      backgroundColor: "rgba(0,0,0,0.55)",
                      borderRadius: 14,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => toggleExpand(i)}
                      style={{ flexDirection: "row", justifyContent: "space-between" }}
                    >
                      <View>
                        <Text style={{ color: "#fff", fontSize: 16, fontFamily: colors.fontFamily, }}>
                          Pesquisa {i + 1}
                        </Text>
                        <Text style={{ color: "#ccc", fontSize: 14,fontFamily: colors.fontFamily }}>
                          Categoria: {categoriasPT[p.category] ?? p.category ?? "—"}
                        </Text>
                        <Text style={{ color: "#ccc", fontSize: 14,fontFamily: colors.fontFamily }}>
                          Data:{" "}
                          {p.criado_em
                            ? new Date(p.criado_em).toLocaleString("pt-BR")
                            : "—"}
                        </Text>
                      </View>
                      <Text style={{ color: "#fbc02d", fontSize: 22 }}>
                        {isOpen ? "▲" : "▼"}
                      </Text>
                    </TouchableOpacity>

                    {isOpen && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={{ color: "#ddd", fontSize: 14 }}>
                          Sentimento: {traducao.sentiment[p.sentiment] ?? p.sentiment ?? "—"}
                        </Text>
                        <Text style={{ color: "#ddd", fontSize: 14 }}>
                          Tipo: {traducao.type[p.app_type] ?? p.app_type ?? "—"}
                        </Text>
                        <Text style={{ color: "#ddd", fontSize: 14 }}>
                          Tamanho: {traducao.size[p.app_size] ?? p.app_size ?? "—"}
                        </Text>
                        <Text style={{ color: "#ddd", fontSize: 14 }}>
                          Classificação Indicativa:{" "}
                          {traducao.content_rating[p.content_rating] ?? p.content_rating ?? "—"}
                        </Text>
                        <Text style={{ color: "#ddd", fontSize: 14 }}>
                          Versão Android:{" "}
                          {traducao.android_version[p.android_version] ?? p.android_version ?? "—"}
                        </Text>
                        <Text style={{ color: "#ddd", fontSize: 14 }}>
                          Avaliação: {traducao.rating[p.min_rating] ?? p.min_rating ?? "—"}
                        </Text>

                        <TouchableOpacity
                          onPress={() => abrirPesquisa(p.id)}
                          style={{
                            marginTop: 12,
                            backgroundColor: "#fbc02d",
                            padding: 10,
                            borderRadius: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: "#000", fontWeight: "bold" }}>Ver Resultado</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })
          ) : (
            <Text style={{ color: "#fff", textAlign: "center", fontSize: 16, marginTop: 10 }}>
              Nenhuma pesquisa encontrada.
            </Text>
          )}

          {abrindo && (
            <ActivityIndicator size="large" color="#fbc02d" style={{ marginVertical: 10 }} />
          )}

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "#d32f2f",
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              Sair da Conta
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
