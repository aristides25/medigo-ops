import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ParamedicHomeScreen } from '../screens/paramedic/ParamedicHomeScreen';
import { EmergencyDetailsScreen } from '../screens/paramedic/EmergencyDetailsScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SerializedEmergencyRequest } from '../types/emergency';

export type ParamedicStackParamList = {
    Login: undefined;
    ParamedicHome: undefined;
    EmergencyDetails: {
        request: SerializedEmergencyRequest;
    };
};

const Stack = createNativeStackNavigator<ParamedicStackParamList>();

export const ParamedicStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerBackTitle: 'Volver',
                headerStyle: {
                    backgroundColor: '#FFFFFF',
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                    color: '#1E293B',
                    fontSize: 20,
                    fontWeight: '600',
                },
                headerTintColor: '#3B82F6',
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ParamedicHome"
                component={ParamedicHomeScreen}
                options={{
                    title: 'Panel de Emergencias',
                    headerLeft: () => null,
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
    );
}; 