import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Homepage({ navigation }) {
  const { colors, darkMode } = useTheme();
  const { user } = useAuth();

  return (
    <ImageBackground
      source={require("../../assets/background.png")} // sua imagem de fundo
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover" // pode usar "cover", "contain" ou "stretch"
      blurRadius={1} // deixa um leve esfumaçado elegante
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: darkMode
            ? "rgba(0,0,0,0.5)"
            : "rgba(255,255,255,0.6)", // leve transparência para ler o texto
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
      >
        {/* Título principal */}
        
        
          Smart Ranking
       

        {/* Subtítulo */}
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            color: darkMode ? "#fff" : "#444",
            marginBottom: 30,
          }}
        >
          Explore, avalie e descubra os melhores aplicativos da Google Play.
        </Text>

        {/* Texto descritivo */}
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            color: darkMode ? "#fff" : "#444",
            marginBottom: 30,
          }}
        >
          O <Text style={{ fontWeight: "bold" }}>Smart Ranking</Text> é um
          sistema que permite que usuários explorem e ranqueiem apps da{" "}
          <Text style={{ fontWeight: "bold" }}>Google Play Store</Text> com base
          em critérios inteligentes, e recebam recomendações com base na
          mineração de dados a partir do ranking gerado.{"\n\n"}
          
        </Text>

        {/* Botões aparecem apenas se o usuário não estiver logado */}
        {!user && (
          <View style={{ marginTop: 40 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={{
                backgroundColor: "#1976d2",
                padding: 14,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Text
                style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
              >
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Cadastro")}
              style={{
                backgroundColor: "#2e7d32",
                padding: 14,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
              >
                Cadastrar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Caso o usuário esteja logado, mostra uma saudação */}
        {user && (
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 18,
                color: colors.text,
                textAlign: "center",
              }}
            >
              👋 Bem-vindo(a),{" "}
              <Text style={{ fontWeight: "bold" }}>{user.nome}</Text>!
            </Text>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}
