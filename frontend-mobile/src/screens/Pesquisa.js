// src/screens/Pesquisa.js
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Pesquisa() {
  const { colors, darkMode } = useTheme();

  const fields = [
    "Categoria",
    "Preço",
    "Faixa Etária",
    "Número de Instalações",
  ];

  return (
    <ImageBackground
      source={require("../../assets/background.png")} // mesmo fundo padrão
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
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 30,
            color: colors.text,
          }}
        >
          Pesquisa de Apps
        </Text>

        {fields.map((field, index) => (
          <TextInput
            key={index}
            style={{
              backgroundColor: colors.inputBg,
              color: colors.text,
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              fontSize: 16,
            }}
            placeholder={field}
            placeholderTextColor={darkMode ? "#888" : "#666"}
          />
        ))}

        <TouchableOpacity
          style={{
            backgroundColor: "#fbc02d",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              color: "#000",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Gerar Ranking
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
