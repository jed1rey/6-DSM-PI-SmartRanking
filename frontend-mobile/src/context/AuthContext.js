import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AuthContext = createContext();

const API_BASE = "https://six-dsm-pi-smartranking.onrender.com";

// função para decodificar JWT 
function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(decodeURIComponent(escape(atob(payload))));
    return decoded;
  } catch (err) {
    console.warn("decodeJwt error:", err);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // carregar token / user do AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem("@sr:token");
        const storedUser = await AsyncStorage.getItem("@sr:user");
        if (storedToken) {
          setToken(storedToken);
          // se user não estiver salvo, tentar buscar via id do token
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const decoded = decodeJwt(storedToken);
            if (decoded?.sub) {
              await fetchUserById(decoded.sub, storedToken);
            }
          }
        }
      } catch (err) {
        console.warn("Erro carregando auth:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchUserById = async (id, authToken) => {
    try {
      const resp = await axios.get(`${API_BASE}/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(resp.data);
      await AsyncStorage.setItem("@sr:user", JSON.stringify(resp.data));
      return resp.data;
    } catch (err) {
      console.warn("Erro fetchUserById:", err?.response?.data ?? err.message);
      return null;
    }
  };

  const signIn = async ({ email, senha }) => {
    try {
      const resp = await axios.post(`${API_BASE}/auth/login`, { email, senha });
      const receivedToken = resp.data?.token;
      if (!receivedToken) throw new Error("Token não retornado pela API");

      // salvar token
      await AsyncStorage.setItem("@sr:token", receivedToken);
      setToken(receivedToken);

      // decodificar para pegar id
      const decoded = decodeJwt(receivedToken);
      const userId = decoded?.sub ?? decoded?.userId ?? decoded?.id;

      if (userId) {
        const fullUser = await fetchUserById(userId, receivedToken);
        // se backend não retornar email, preencha a partir do token
        if (fullUser && !fullUser.email && decoded?.email) {
          fullUser.email = decoded.email;
          setUser(fullUser);
          await AsyncStorage.setItem("@sr:user", JSON.stringify(fullUser));
        }
      } else {
        console.warn("Nenhum ID encontrado no token decodificado.");
      }
    } catch (err) {
      console.error("Erro signIn:", err?.response?.data ?? err.message);
      throw err;
    }
  };

  const signUp = async ({ nome, data_nascimento, email, senha }) => {
    try {
      await axios.post(`${API_BASE}/auth/register`, { nome, data_nascimento, email, senha });
      // login automático
      await signIn({ email, senha });
    } catch (err) {
      console.error("Erro signUp:", err?.response?.data ?? err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("@sr:token");
      await AsyncStorage.removeItem("@sr:user");
    } catch (err) {
      console.warn("Erro ao remover token:", err);
    } finally {
      setToken(null);
      setUser(null);
    }
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
