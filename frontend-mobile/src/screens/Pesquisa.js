import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Pesquisa({ navigation }) {
  const { colors, darkMode } = useTheme();
  const { token } = useAuth();
  const [form, setForm] = useState({});

  // Reset automático do formulário ao voltar da tela Ranking
  useFocusEffect(
    React.useCallback(() => {
      const resetParam = navigation
        .getState()
        ?.routes?.find((r) => r.name === "Pesquisa")?.params?.resetForm;

      if (resetParam) {
        console.log(" Formulário resetado automaticamente");
        setForm({});
        navigation.setParams({ resetForm: false }); // limpa o parâmetro
      }
    }, [navigation])
  );

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

  // Envio da pesquisa e resultado
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
        Alert.alert("Atenção", "Preencha todos os campos antes de gerar o ranking.");
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
    };

    try {
      const postUrl = "https://six-dsm-pi-smartranking.onrender.com/api/pesquisas";
      const postResp = await axios.post(postUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ JSON enviado:", payload);
      console.log("✅ Resposta POST:", postResp.data);

      const pesquisaId = postResp.data?.pesquisa_id;
      if (!pesquisaId) {
        Alert.alert("Erro", "O backend não retornou o ID da pesquisa.");
        return;
      }

      const getUrl = `https://six-dsm-pi-smartranking.onrender.com/api/resultados/${pesquisaId}`;
      const getResp = await axios.get(getUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(" Resultado recebido:", getResp.data);

      Alert.alert("Sucesso", "Ranking gerado com sucesso!");
      navigation.navigate("Ranking", { rankingData: getResp.data });
    } catch (err) {
      console.error("Erro pesquisa:", err.response?.data ?? err.message);
      Alert.alert("Erro", "Falha ao gerar ranking. Verifique o backend.");
    }
  };

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
          padding: 20,
          backgroundColor: darkMode
            ? "rgba(0,0,0,0.5)"
            : "rgba(255,255,255,0.6)",
        }}
      >
        <Text
          style={{
            fontSize: 26,
            textAlign: "center",
            marginBottom: 25,
            color: colors.text,
            fontFamily: colors.fontFamily,
          }}
        >
          Pesquisa de Apps
        </Text>

        {/* Caixas de seleção arredondadas */}
        {[
          { key: "sentiment", label: "Sentimento", items: sentiments },
          { key: "category", label: "Categoria", items: categories },
          { key: "rating", label: "Avaliação (Estrelas)", items: ratings },
          { key: "type", label: "Tipo de App", items: types },
          { key: "size", label: "Tamanho do App", items: sizes },
          { key: "installs", label: "Faixa de Instalações", items: installs },
          {
            key: "content_rating",
            label: "Classificação Indicativa",
            items: contentRatings,
          },
          { key: "android_version", label: "Versão Android", items: androidVersions },
        ].map(({ key, label, items }) => (
          <View key={key} style={{ marginBottom: 15 }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                marginBottom: 6,
                fontFamily: colors.fontFamily,
              }}
            >
              {label}
            </Text>
            <RNPickerSelect
              onValueChange={(value) => setForm({ ...form, [key]: value })}
              value={form[key] || null}
              items={items}
              placeholder={{ label: `Selecione ${label.toLowerCase()}`, value: null }}
              style={{
                inputAndroid: {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  paddingVertical: 14,
                  paddingHorizontal: 15,
                  borderRadius: 12, 
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                  fontFamily: colors.fontFamily,
                },
                inputIOS: {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  paddingVertical: 14,
                  paddingHorizontal: 15,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                  fontFamily: colors.fontFamily,
                },
              }}
            />
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: "#fbc02d",
            padding: 14,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: "#000",
              fontSize: 18,
              fontWeight: "bold",
              fontFamily: colors.fontFamily,
            }}
          >
            Gerar Ranking
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
