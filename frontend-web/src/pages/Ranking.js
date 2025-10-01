import React from "react";

export default function Ranking() {
  const mockRanking = [
    { nome: "João", pontos: 95 },
    { nome: "Maria", pontos: 90 },
    { nome: "Carlos", pontos: 85 }
  ];

  return (
    <div style={styles.container}>
      <h2>Ranking</h2>
      <ul>
        {mockRanking.map((item, index) => (
          <li key={index}>
            {index + 1}º - {item.nome}: {item.pontos} pts
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { margin: 50, textAlign: "center" }
};
