import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import { View, Image, StyleSheet } from 'react-native';

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


const customIcons = {
  Login: require('../../assets/loginSR.png'),
  Cadastro: require('../../assets/cadastroSR.png'),
  Pesquisa: require('../../assets/pesquisaSR.png'),
  Ranking: require('../../assets/rankingSR.png'),
  Perfil: require('../../assets/perfilSR.png'),
};


function CustomHeader({ route, darkMode }) {
  const headerColor = pageColors[route.name] || "#202124";
  
  return (
    <View style={{
      backgroundColor: headerColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: darkMode ? '#444' : '#ddd',
      height: 150,
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
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
            tabBarLabelStyle: {
              fontSize: 12, 
              fontWeight: '500',
            },
            
          
            tabBarIcon: ({ focused }) => {
              const iconSource = customIcons[route.name];
              
              return (
                <View style={styles.iconContainer}>
                  <Image 
                    source={iconSource}
                    style={[
                      styles.icon,
                      { 
                        tintColor: focused ? '#ffffff' : 'rgba(255,255,255,0.7)',
                        opacity: focused ? 1 : 0.7,
                      }
                    ]}
                    resizeMode="contain"
                  />
                </View>
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

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
  },
  icon: {
    width: 22,
    height: 22,
  },
});