import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { ParamedicHomeScreen } from './src/screens/paramedic/ParamedicHomeScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth Stack
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // Home Stack
        <Stack.Screen name="Home" component={ParamedicHomeScreen} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
