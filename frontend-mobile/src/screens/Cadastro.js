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

export default function Cadastro({ navigation }) {
  const { colors, darkMode } = useTheme();
  const { signUp } = useAuth();

  const [nome, setNome] = useState("");
  const [data_nascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await signUp({ nome, data_nascimento, email, senha });
      navigation.navigate("Home");
    } catch (err) {
      Alert.alert("Erro", err.response?.data?.message ?? "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/background.png")} 
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
      blurRadius={1} // leve esfumaçado
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 20,
          backgroundColor: darkMode
            ? "rgba(0,0,0,0.5)"
            : "rgba(255,255,255,0.6)", 
        }}
      >
        <Text
          style={{
            fontSize: 28,
            textAlign: "center",
            marginBottom: 40,
            color: colors.text,
            fontFamily: colors.fontFamily
          }}
        >
          Cadastro
        </Text>

        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Nome completo"
          placeholderTextColor={darkMode ? "#888" : "#666"}
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
        />

        <TextInput
          value={data_nascimento}
          onChangeText={setDataNascimento}
          placeholder="Data de nascimento (YYYY-MM-DD)"
          placeholderTextColor={darkMode ? "#888" : "#666"}
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
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={darkMode ? "#888" : "#666"}
          keyboardType="email-address"
          autoCapitalize="none"
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
        />

        <TextInput
          value={senha}
          onChangeText={setSenha}
          placeholder="Senha"
          placeholderTextColor={darkMode ? "#888" : "#666"}
          secureTextEntry
          style={{
            backgroundColor: colors.inputBg,
            color: colors.text,
            padding: 15,
            borderRadius: 8,
            marginBottom: 25,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            fontSize: 16,
            fontFamily: colors.fontFamily
          }}
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={{
            backgroundColor: "#2e7d32",
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text style={{ color: "#fff", fontFamily: colors.fontFamily, fontSize: 16 }}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}
