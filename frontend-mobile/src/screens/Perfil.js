import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Perfil() {
  const { colors, darkMode } = useTheme();

  const userData = { 
    nome: "João Silva", 
    email: "joao@email.com" 
  };

  const history = [
    { id: 1, nome: "Ranking 01" },
    { id: 2, nome: "Ranking 02" },
    { id: 3, nome: "Ranking 03" },
    { id: 4, nome: "Ranking 04" },
    { id: 5, nome: "Ranking 05" },
  ];

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
        Perfil do Usuário
      </Text>

     
      <View style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        marginBottom: 30,
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{
            fontSize: 16,
            color: colors.text,
          }}>
            <Text style={{ fontWeight: 'bold' }}>Nome:</Text> {userData.nome}
          </Text>
          <Text style={{
            fontSize: 16,
            color: colors.text,
          }}>
            <Text style={{ fontWeight: 'bold' }}>Email:</Text> {userData.email}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            marginTop: 10,
            padding: 10,
            paddingHorizontal: 20,
            background: darkMode ? '#1a73e8' : '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Alterar Dados</Text>
        </TouchableOpacity>
      </View>

      
      <View style={{ marginTop: 30, width: '100%' }}>
        <Text style={{
          color: colors.text,
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 20,
        }}>
          Histórico de Rankings
        </Text>

        {history.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{
              padding: 10,
              margin: 10,
              marginHorizontal: 0,
              borderRadius: 6,
              backgroundColor: darkMode ? '#3c3c3c' : '#f5f5f5',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
              textAlign: 'center',
            }}
          >
            <Text style={{
              color: colors.text,
              textAlign: 'center',
              fontWeight: '500',
            }}>
              {item.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}