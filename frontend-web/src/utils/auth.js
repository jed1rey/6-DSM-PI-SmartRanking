import { jwtDecode } from 'jwt-decode';

export function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded; 
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
}
