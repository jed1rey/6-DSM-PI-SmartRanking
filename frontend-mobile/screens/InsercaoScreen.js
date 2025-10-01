import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function InsercaoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inserir Dados</Text>

      <TextInput placeholder="Valor 1" style={styles.input} />
      <TextInput placeholder="Valor 2" style={styles.input} />
      <TextInput placeholder="Valor 3" style={styles.input} />
      <TextInput placeholder="Valor 4" style={styles.input} />

      <Button title="Analisar" onPress={() => navigation.navigate('Ranking')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
});
