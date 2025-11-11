// src/services/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "https://six-dsm-pi-smartranking.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Injeta token automaticamente nas requisições
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@sr:token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function registerUser(payload) {
  return API.post("/auth/register", payload);
}

export async function loginUser(payload) {
  return API.post("/auth/login", payload);
}

export default API;
