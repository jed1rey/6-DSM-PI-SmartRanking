import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser, registerUser, fetchUserById as apiFetchUserById } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar token/usuário do localStorage
  useEffect(() => {
    const initialize = async () => {
      try {
        const storedToken = localStorage.getItem("@sr:token");
        const storedUser = localStorage.getItem("@sr:user");
        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // decodifica e busca usuário completo
            const decoded = jwtDecode(storedToken);
            const id = decoded.sub || decoded.userId || decoded.id;
            if (id) {
              const u = await apiFetchUserById(id, storedToken);
              if (u) {
                setUser(u);
                localStorage.setItem("@sr:user", JSON.stringify(u));
              } else {
                setUser({
                  id,
                  email: decoded.email || "",
                  nome: decoded.nome || decoded.name || "Usuário",
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const signIn = async ({ email, senha }) => {
    try {
      const res = await loginUser({ email, senha });
      if (!res || !res.token) throw new Error(res?.message || "Login falhou");
      const decoded = jwtDecode(res.token);
      const id = decoded.sub || decoded.userId || decoded.id;
      localStorage.setItem("@sr:token", res.token);
      setToken(res.token);

      // buscar usuário completo
      const userData = await apiFetchUserById(id, res.token);
      if (userData) {
        setUser(userData);
        localStorage.setItem("@sr:user", JSON.stringify(userData));
      } else {
        const fallback = {
          id,
          email: decoded.email || "",
          nome: decoded.nome || decoded.name || "Usuário",
        };
        setUser(fallback);
        localStorage.setItem("@sr:user", JSON.stringify(fallback));
      }
      return { success: true };
    } catch (err) {
      console.error("signIn error:", err);
      throw err;
    }
  };

  const signUp = async ({ nome, data_nascimento, email, senha }) => {
    try {
      const res = await registerUser({ nome, data_nascimento, email, senha });
      // se o backend retorna algo diferente, ainda tentamos o login automático
      await signIn({ email, senha });
    } catch (err) {
      console.error("signUp error:", err);
      throw err;
    }
  };

  const signOut = () => {
    localStorage.removeItem("@sr:token");
    localStorage.removeItem("@sr:user");
    setToken(null);
    setUser(null);
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
