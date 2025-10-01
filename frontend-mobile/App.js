import  React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando as telas
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import InsercaoScreen from './screens/InsercaoScreen';
import RankingScreen from './screens/RankingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Inserção" component={InsercaoScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
