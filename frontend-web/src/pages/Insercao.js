import React from "react";

export default function Insercao() {
  return (
    <div style={styles.container}>
      <h2>Inserção de Dados</h2>
      <input style={styles.input} placeholder="Campo 1" />
      <input style={styles.input} placeholder="Campo 2" />
      <input style={styles.input} placeholder="Campo 3" />
      <input style={styles.input} placeholder="Campo 4" />
      <button style={styles.button}>Enviar</button>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50 },
  input: { margin: 10, padding: 10, width: 200 },
  button: { padding: 10, width: 220, background: "#ff9800", color: "#fff", border: "none" }
};
