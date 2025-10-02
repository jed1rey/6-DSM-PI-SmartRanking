import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Pesquisa() {
  const { colors, darkMode } = useTheme();

  const fields = ["Categoria", "Preço", "Faixa Etária", "Número de Instalações"];

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
        marginBottom: 20,
        marginTop: 20,
        color: colors.text,
      }}>
        Pesquisa de Apps
      </Text>

      {fields.map((field, index) => (
        <TextInput
          key={index}
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
          placeholder={field}
          placeholderTextColor={darkMode ? '#888' : '#666'}
        />
      ))}

      <TouchableOpacity
        style={{
          backgroundColor: '#fbc02d', 
          padding: 12,
          borderRadius: 6,
          alignItems: 'center',
          marginTop: 15,
          width: '100%',
        }}
      >
        <Text style={{ color: '#000', fontWeight: 'bold' }}>Gerar Ranking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}