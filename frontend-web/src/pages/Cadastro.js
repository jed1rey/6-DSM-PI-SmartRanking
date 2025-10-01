import React from "react";

export default function Cadastro() {
  return (
    <div style={styles.container}>
      <h2>Cadastro</h2>
      <input style={styles.input} type="text" placeholder="Nome" />
      <input style={styles.input} type="date" placeholder="Data de Nascimento" />
      <input style={styles.input} type="password" placeholder="Senha" />
      <button style={styles.button}>Cadastrar</button>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50 },
  input: { margin: 10, padding: 10, width: 200 },
  button: { padding: 10, width: 220, background: "green", color: "#fff", border: "none" }
};
