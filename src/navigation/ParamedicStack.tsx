import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ParamedicScreensStack } from './ParamedicScreensStack';

export type RootStackParamList = {
    Login: undefined;
    ParamedicScreens: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const ParamedicStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ParamedicScreens" component={ParamedicScreensStack} />
        </Stack.Navigator>
    );
}; 