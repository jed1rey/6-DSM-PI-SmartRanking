import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const { darkMode, colors } = useTheme();

  return (
    <ScrollView style={{
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 20,
        color: colors.text,
      }}>
        Login
      </Text>

      <TextInput
        style={{
          backgroundColor: colors.inputBg,
          color: colors.text,
          padding: 15,
          borderRadius: 8,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          fontSize: 16,
        }}
        placeholder="Usuário"
        placeholderTextColor={darkMode ? '#888' : '#666'}
      />

      <TextInput
        style={{
          backgroundColor: colors.inputBg,
          color: colors.text,
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          fontSize: 16,
        }}
        placeholder="Senha"
        placeholderTextColor={darkMode ? '#888' : '#666'}
        secureTextEntry
      />

      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={{
          textAlign: 'center',
          color: darkMode ? '#8ab4f8' : '#1a73e8',
          textDecorationLine: 'underline',
          fontSize: 16,
        }}>
          Não tem uma conta? Cadastre-se
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}