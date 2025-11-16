// src/services/api.js
const API_URL = "https://six-dsm-pi-smartranking.onrender.com";

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(data) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {
    console.error("loginUser error:", err);
    return { error: "Erro de conexão" };
  }
}

export async function fetchUserById(userId, token) {
  try {
    const res = await fetch(`${API_URL}/auth/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("fetchUserById:", err);
    return null;
  }
}

export async function criarPesquisa(data, token) {
  const res = await fetch(`${API_URL}/api/pesquisas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function obterResultadoPesquisa(pesquisaId, token) {
  const res = await fetch(`${API_URL}/api/resultados/${pesquisaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function obterPesquisasUsuario(userId, token) {
  const res = await fetch(`${API_URL}/api/pesquisas/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
