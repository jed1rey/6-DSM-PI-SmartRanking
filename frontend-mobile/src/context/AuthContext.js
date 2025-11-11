// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "../services/api";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem("@sr:token");
        const storedUser = await AsyncStorage.getItem("@sr:user");
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn("Erro ao carregar dados de autenticação", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchUserData = async (id) => {
    try {
      const response = await API.get(`/auth/users/${id}`);
      const userData = response.data;
      setUser(userData);
      await AsyncStorage.setItem("@sr:user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  const signIn = async ({ email, senha }) => {
  try {
    console.log("🟢 Tentando login com:", email);
    const response = await loginUser({ email, senha });
    console.log("🟢 Resposta da API:", response.data);

    const data = response.data;
    const newToken = data.token ?? data.accessToken ?? data.jwt ?? null;

    if (!newToken) {
      throw new Error("Token não retornado pela API");
    }

    // 🔍 Decodificar token (corrigido)
    const decoded = jwtDecode(newToken);
    console.log("🔹 Token decodificado:", decoded);

    const userId = decoded.sub;
    const userEmail = decoded.email;

    setToken(newToken);
    await AsyncStorage.setItem("@sr:token", newToken);

    if (userId) {
      console.log("🔹 Buscando dados do usuário:", userId);
      const fullUser = await fetchUserData(userId);
      if (fullUser) {
        // garantir que email esteja presente
        if (!fullUser.email && userEmail) fullUser.email = userEmail;
        console.log("✅ Dados completos do usuário:", fullUser);
        setUser(fullUser);
      }
    } else {
      console.warn("⚠️ Nenhum ID encontrado no token decodificado.");
    }
  } catch (error) {
    console.error("❌ Erro ao logar:", error.response?.data ?? error.message);
    throw error;
  }
};


  const signUp = async (payload) => {
    const response = await registerUser(payload);
    const data = response.data;

    // Supondo que a API retorne id do novo usuário
    const newUserId = data.id ?? data.userId ?? null;

    // login automático após cadastro
    await signIn({ email: payload.email, senha: payload.senha });

    if (newUserId) {
      await fetchUserData(newUserId);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("@sr:token");
    await AsyncStorage.removeItem("@sr:user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
