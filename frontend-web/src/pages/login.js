import React from "react";

export default function Login() {
  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <input style={styles.input} type="text" placeholder="Nome de usuário" />
      <input style={styles.input} type="password" placeholder="Senha" />
      <button style={styles.button}>Entrar</button>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50 },
  input: { margin: 10, padding: 10, width: 200 },
  button: { padding: 10, width: 220, background: "#1976d2", color: "#fff", border: "none" }
};
