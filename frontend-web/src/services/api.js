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
    const response = await fetch("https://six-dsm-pi-smartranking.onrender.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error("Erro no login:", resData);
    }

    return resData;
  } catch (err) {
    console.error("Falha na requisição de login:", err);
    return { error: "Falha de conexão com o servidor." };
  }
}

export async function criarPesquisa(data) {
  const token = getToken();
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
