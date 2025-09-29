import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RankingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>

      <View style={styles.card}>
        <Text style={styles.rank}>1º Lugar - Usuário A</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.rank}>2º Lugar - Usuário B</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.rank}>3º Lugar - Usuário C</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { padding: 15, marginVertical: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  rank: { fontSize: 18 },
});
