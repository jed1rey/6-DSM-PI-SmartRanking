import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';
import { View, Image } from 'react-native';

import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import Pesquisa from '../screens/Pesquisa';
import Ranking from '../screens/Ranking';
import Perfil from '../screens/Perfil';

const Tab = createBottomTabNavigator();


const pageColors = {
  Login: "#1976d2",      
  Cadastro: "#2e7d32",   
  Pesquisa: "#fbc02d",  
  Ranking: "#d32f2f",    
  Perfil: "#bdbdbd",     
};


function CustomHeader({ route, darkMode }) {
  const headerColor = pageColors[route.name] || "#202124";
  
  return (
    <View style={{
      backgroundColor: headerColor,
      paddingHorizontal: 20,
      paddingVertical: 15,
      flexDirection: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#444' : '#ddd',
      height: 150, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 6,
    }}>
      
      <Image 
        source={require('../../assets/LogoSR.png')}
        style={{ 
          width: 250,  
          height: 250, 
          resizeMode: 'contain',
        }}
      />
    </View>
  );
}

export default function AppNavigator() {
  const { darkMode } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const tabColor = pageColors[route.name];
          
          return {
            
            header: () => <CustomHeader route={route} darkMode={darkMode} />,
            
            
            tabBarStyle: {
              backgroundColor: tabColor,
              borderTopColor: darkMode ? '#444' : '#ddd',
              borderTopWidth: 1,
              height: 75, 
              paddingBottom: 12,
              paddingTop: 8,
            },
            tabBarActiveTintColor: darkMode ? '#fff' : '#000',
            tabBarInactiveTintColor: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
            tabBarLabelStyle: {
              fontSize: 13, 
              fontWeight: '600',
              marginBottom: 4,
            },
            tabBarIcon: ({ color, size, focused }) => {
              let iconName;
              
              if (route.name === 'Login') iconName = 'log-in';
              else if (route.name === 'Cadastro') iconName = 'user-plus';
              else if (route.name === 'Pesquisa') iconName = 'search';
              else if (route.name === 'Ranking') iconName = 'bar-chart-2';
              else if (route.name === 'Perfil') iconName = 'user';

              return (
                <Icon 
                  name={iconName} 
                  size={focused ? 28 : 26} 
                  color={color} 
                />
              );
            },
          };
        }}
      >
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="Cadastro" component={Cadastro} />
        <Tab.Screen name="Pesquisa" component={Pesquisa} />
        <Tab.Screen name="Ranking" component={Ranking} />
        <Tab.Screen name="Perfil" component={Perfil} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}