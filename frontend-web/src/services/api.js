const API_URL = "https://six-dsm-pi-smartranking.onrender.com";

export async function registerUser(data) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function loginUser(data) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    console.error("Falha na requisição de login:", err);
    return { error: "Falha de conexão com o servidor." };
  }
}

export async function criarPesquisa(data, token) {
  const response = await fetch(`${API_URL}/api/pesquisas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function obterResultadoPesquisa(pesquisaId, token) {
  const response = await fetch(`${API_URL}/api/resultados/${pesquisaId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });
  return response.json();
}

// Função para obter pesquisas do usuário
export async function obterPesquisasUsuario(userId, token) {
  const response = await fetch(`${API_URL}/api/pesquisas/user/${userId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });
  return response.json();
}

// Funções de token
export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}