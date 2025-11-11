// src/screens/Perfil.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Perfil({ navigation }) {
  const { colors, darkMode } = useTheme();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigation.navigate("Home");
    Alert.alert("Logout", "Você saiu da conta.");
  };

  // Quando não há usuário logado
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
            }}
          >
            Nenhum usuário logado.
          </Text>
        </View>
      </ImageBackground>
    );
  }

  // Quando há usuário logado
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
          justifyContent: "center",
          paddingHorizontal: 30,
          paddingVertical: 60,
          backgroundColor: darkMode
            ? "rgba(0,0,0,0.5)"
            : "rgba(255,255,255,0.6)",
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 35,
            color: colors.text,
          }}
        >
          Perfil
        </Text>

        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 22,
              color: colors.text,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Nome: </Text>
            {user.nome ?? "—"}
          </Text>

          <Text
            style={{
              fontSize: 20,
              color: colors.text,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Email: </Text>
            {user.email ?? "—"}
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: colors.text,
              textAlign: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Data de nascimento: </Text>
            {user.data_nascimento
              ? new Date(user.data_nascimento).toLocaleDateString("pt-BR")
              : "—"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: "#d32f2f",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Sair
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
