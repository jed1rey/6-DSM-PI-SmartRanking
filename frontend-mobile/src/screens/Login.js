import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Login({ navigation }) {
  const { darkMode, colors } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn({ email, senha });
      navigation.navigate("Home");
    } catch (err) {
      Alert.alert("Erro", err.response?.data?.message ?? "Erro ao fazer login.");
    } finally {
      setLoading(false);
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
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: darkMode
            ? "rgba(0,0,0,0.5)"
            : "rgba(255,255,255,0.6)", 
        }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <Text
          style={{
            fontSize: 28,
            textAlign: "center",
            marginBottom: 30,
            color: colors.text,
            fontFamily: colors.fontFamily
          }}
        >
          Login
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          style={{
            backgroundColor: colors.inputBg,
            color: colors.text,
            padding: 15,
            borderRadius: 8,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            fontSize: 16,
            fontFamily: colors.fontFamily
          }}
          placeholder="Email"
          placeholderTextColor={darkMode ? "#888" : "#666"}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          value={senha}
          onChangeText={setSenha}
          style={{
            backgroundColor: colors.inputBg,
            color: colors.text,
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            fontSize: 16,
            fontFamily: colors.fontFamily
          }}
          placeholder="Senha"
          placeholderTextColor={darkMode ? "#888" : "#666"}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 20,
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text style={{ color: "#fff", fontFamily: colors.fontFamily, fontSize: 16 }}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text
            style={{
              textAlign: "center",
              color: darkMode ? "#8ab4f8" : "#1a73e8",
              textDecorationLine: "underline",
              fontSize: 16,
              fontFamily: colors.fontFamily
            }}
          >
            Não tem uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
