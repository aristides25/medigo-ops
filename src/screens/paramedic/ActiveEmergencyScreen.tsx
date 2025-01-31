import React from 'react';
import { View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ParamedicStackParamList } from '../../types/navigation';
import { EmergencyStatus } from '../../types/emergency';
import { EmergencyStateProvider, useEmergencyStateContext } from '../../context/EmergencyStateContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ActiveEmergencyRouteProp = RouteProp<ParamedicStackParamList, 'ActiveEmergency'>;
type NavigationProp = NativeStackNavigationProp<ParamedicStackParamList>;

const ActiveEmergencyContent = () => {
    const route = useRoute<ActiveEmergencyRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { request } = route.params;
    const { 
        currentState, 
        stateHistory, 
        updateState,
        isTransitionAllowed 
    } = useEmergencyStateContext();

    // Función para manejar cambios de estado
    const handleStateChange = (newState: EmergencyStatus) => {
        try {
            updateState(newState, request.location, `Cambio manual a estado ${newState}`);
        } catch (error) {
            console.error(error);
            // Aquí deberíamos mostrar un toast o alert con el error
        }
    };

    // Función para llamar al paciente
    const handleCallPatient = () => {
        if (request.patientInfo.phone) {
            Linking.openURL(`tel:${request.patientInfo.phone}`);
        }
    };

    // Función para abrir el mapa
    const handleOpenMap = () => {
        const { latitude, longitude } = request.location;
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

        Alert.alert(
            'Navegar al Paciente',
            '¿Qué aplicación deseas usar?',
            [
                {
                    text: 'Google Maps',
                    onPress: () => Linking.openURL(googleMapsUrl)
                },
                {
                    text: 'Waze',
                    onPress: () => Linking.openURL(wazeUrl)
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        );
    };

    // Función para ver detalles
    const handleViewDetails = () => {
        navigation.navigate('EmergencyDetails', { request });
    };

    return (
        <ScrollView style={styles.container}>
            {/* Estado Actual */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Estado Actual</Text>
                <Text style={styles.statusText}>{currentState}</Text>
            </View>

            {/* Mapa y Ubicación */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ubicación del Paciente</Text>
                <View style={styles.mapPlaceholder}>
                    {/* Aquí irá el componente de mapa */}
                    <Text>Mapa en desarrollo...</Text>
                </View>
                <View style={styles.locationActions}>
                    <Button
                        title="Navegar al Paciente"
                        icon={{ name: 'directions', type: 'font-awesome-5', color: 'white' }}
                        onPress={handleOpenMap}
                        buttonStyle={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                    />
                </View>
            </View>

            {/* Acciones según el estado */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Acciones</Text>
                <View style={styles.actionButtons}>
                    {currentState === 'ACCEPTED' && (
                        <Button
                            title="Iniciar Viaje"
                            icon={{ name: 'car', type: 'font-awesome-5', color: 'white' }}
                            onPress={() => handleStateChange('IN_PROGRESS')}
                            buttonStyle={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                        />
                    )}

                    {currentState === 'IN_PROGRESS' && (
                        <Button
                            title="Llegué al Sitio"
                            icon={{ name: 'hospital', type: 'font-awesome-5', color: 'white' }}
                            onPress={() => handleStateChange('ON_SITE')}
                            buttonStyle={[styles.actionButton, { backgroundColor: '#6366F1' }]}
                        />
                    )}

                    {currentState === 'ON_SITE' && (
                        <Button
                            title="Completar Emergencia"
                            icon={{ name: 'check-circle', type: 'font-awesome-5', color: 'white' }}
                            onPress={() => handleStateChange('COMPLETED')}
                            buttonStyle={[styles.actionButton, { backgroundColor: '#059669' }]}
                        />
                    )}

                    {/* Botón de llamada siempre visible */}
                    <Button
                        title="Llamar al Paciente"
                        icon={{ name: 'phone', type: 'font-awesome-5', color: 'white' }}
                        onPress={handleCallPatient}
                        buttonStyle={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}
                        disabled={!request.patientInfo.phone}
                    />

                    {/* Botón de detalles siempre visible */}
                    <Button
                        title="Ver Detalles"
                        icon={{ name: 'info-circle', type: 'font-awesome-5', color: 'white' }}
                        onPress={handleViewDetails}
                        buttonStyle={[styles.actionButton, { backgroundColor: '#64748B' }]}
                    />

                    {/* Botón de cancelar siempre visible excepto en estados finales */}
                    {!['COMPLETED', 'CANCELLED'].includes(currentState) && (
                        <Button
                            title="Cancelar Emergencia"
                            icon={{ name: 'times', type: 'font-awesome-5', color: 'white' }}
                            onPress={() => handleStateChange('CANCELLED')}
                            buttonStyle={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                        />
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export const ActiveEmergencyScreen = () => {
    const route = useRoute<ActiveEmergencyRouteProp>();
    const { request } = route.params;

    return (
        <EmergencyStateProvider emergencyId={request.id} initialState={request.status}>
            <ActiveEmergencyContent />
        </EmergencyStateProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 12,
    },
    mapPlaceholder: {
        height: 200,
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationActions: {
        marginTop: 12,
    },
    actionButtons: {
        gap: 8,
    },
    actionButton: {
        borderRadius: 8,
        paddingVertical: 12,
        marginBottom: 8,
    },
    statusText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1E293B',
        textAlign: 'center',
    },
}); 