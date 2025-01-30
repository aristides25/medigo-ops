import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { ParamedicHomeScreen } from './src/screens/paramedic/ParamedicHomeScreen';
import { EmergencyDetailsScreen } from './src/screens/paramedic/EmergencyDetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="ParamedicHome" 
                component={ParamedicHomeScreen}
                options={{
                  title: 'Panel de Emergencias',
                  headerBackVisible: false,
                }}
              />
              <Stack.Screen 
                name="EmergencyDetails" 
                component={EmergencyDetailsScreen}
                options={{
                  title: 'Detalles de Emergencia',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
