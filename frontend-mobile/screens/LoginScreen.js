import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput placeholder="E-mail" style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry style={styles.input} />

      <Button title="Entrar" onPress={() => navigation.navigate('Ranking')} />
      <Button title="Cadastre-se" onPress={() => navigation.navigate('Cadastro')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
});
