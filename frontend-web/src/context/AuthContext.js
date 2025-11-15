import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from 'jwt-decode';
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("@sr:token");
        const storedUser = localStorage.getItem("@sr:user");

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const decoded = jwtDecode(storedToken);
            // Buscar informações completas do usuário
            await fetchUserById(decoded.userId || decoded.sub, storedToken);
          }
        }
      } catch (err) {
        console.warn("Erro carregando auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserById = async (userId, authToken) => {
    try {
      const response = await fetch(`https://six-dsm-pi-smartranking.onrender.com/auth/users/${userId}`, {
        headers: { 
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json"
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("@sr:user", JSON.stringify(userData));
        return userData;
      } else {
        console.warn("Não foi possível buscar dados do usuário");
        // Se não conseguir buscar, usa os dados básicos do token
        const decoded = jwtDecode(authToken);
        const basicUser = {
          id: decoded.userId || decoded.sub,
          email: decoded.email,
          nome: decoded.nome || "Usuário"
        };
        setUser(basicUser);
        localStorage.setItem("@sr:user", JSON.stringify(basicUser));
        return basicUser;
      }
    } catch (err) {
      console.warn("Error fetchUserById:", err);
      // Fallback para dados básicos do token
      const decoded = jwtDecode(authToken);
      const basicUser = {
        id: decoded.userId || decoded.sub,
        email: decoded.email,
        nome: decoded.nome || "Usuário"
      };
      setUser(basicUser);
      localStorage.setItem("@sr:user", JSON.stringify(basicUser));
      return basicUser;
    }
  };

  const signIn = async ({ email, senha }) => {
    try {
      const res = await loginUser({ email, senha });
      
      if (res.token) {
        const decoded = jwtDecode(res.token);
        
        localStorage.setItem("@sr:token", res.token);
        
        // Buscar dados completos do usuário
        const userData = await fetchUserById(decoded.userId || decoded.sub, res.token);
        
        setToken(res.token);
        setUser(userData);
        
        return { success: true };
      } else {
        throw new Error(res.error || "Credenciais inválidas");
      }
    } catch (err) {
      console.error("Erro signIn:", err);
      throw err;
    }
  };

  const signUp = async ({ nome, data_nascimento, email, senha }) => {
    try {
      await registerUser({ nome, data_nascimento, email, senha });
      // Após cadastro, faz login automático
      await signIn({ email, senha });
    } catch (err) {
      console.error("Erro signUp:", err);
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
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}