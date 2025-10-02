import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Cadastro() {
  const { colors } = useTheme();

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
        marginBottom: 50,  
        marginTop: 20,
        color: colors.text,
      }}>
        Cadastro
      </Text>

      <TextInput
        style={{
          backgroundColor: colors.inputBg,
          color: colors.text,
          padding: 12,
          borderRadius: 6,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          width: '100%',
        }}
        placeholder="Nome"
        placeholderTextColor={colors.text === '#202124' ? '#666' : '#888'}
      />

      <TextInput
        style={{
          backgroundColor: colors.inputBg,
          color: colors.text,
          padding: 12,
          borderRadius: 6,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          width: '100%',
        }}
        placeholder="Data de Nascimento"
        placeholderTextColor={colors.text === '#202124' ? '#666' : '#888'}
      />

      <TextInput
        style={{
          backgroundColor: colors.inputBg,
          color: colors.text,
          padding: 12,
          borderRadius: 6,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          width: '100%',
        }}
        placeholder="Senha"
        placeholderTextColor={colors.text === '#202124' ? '#666' : '#888'}
        secureTextEntry
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#2e7d32', 
          padding: 12,
          borderRadius: 6,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}