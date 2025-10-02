import React from "react";

export default function Layout({ children }) {
  return (
    <div style={styles.wrapper}>
      
      <header style={styles.header}>
        <img src="/logo192.png" alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Smart Ranking</h1>
      </header>

      
      <main style={styles.main}>{children}</main>

      
      <footer style={styles.footer}>
        <p>© 2025 Smart Ranking</p>
      </footer>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#2c2c2c",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    backgroundColor: "#202124",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #444",
  },
  logo: { width: 40, marginRight: 10 },
  title: { fontSize: 20 },
  main: { flex: 1, display: "flex", justifyContent: "center", alignItems: "center" },
  footer: {
    backgroundColor: "#202124",
    textAlign: "center",
    padding: "10px",
    borderTop: "1px solid #444",
  },
};
