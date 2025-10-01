import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function CadastroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput placeholder="Nome" style={styles.input} />
      <TextInput placeholder="Data de Nascimento" style={styles.input} />
      <TextInput placeholder="Senha" secureTextEntry style={styles.input} />

      <Button title="Cadastrar" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
});
