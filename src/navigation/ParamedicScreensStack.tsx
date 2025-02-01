import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ParamedicHomeScreen } from '../screens/paramedic/ParamedicHomeScreen';
import { EmergencyDetailsScreen } from '../screens/paramedic/EmergencyDetailsScreen';
import { EmergencyRequest } from '../types/emergency';

export type ParamedicStackParamList = {
    ParamedicHome: undefined;
    EmergencyDetails: {
        request: EmergencyRequest;
    };
    ActiveEmergency: {
        request: EmergencyRequest;
    };
    CompletedEmergency: {
        request: EmergencyRequest;
    };
};

const Stack = createNativeStackNavigator<ParamedicStackParamList>();

export const ParamedicScreensStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
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