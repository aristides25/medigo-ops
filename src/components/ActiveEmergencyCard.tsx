import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { EmergencyRequest, EmergencyStatus } from '../types/emergency';

interface ActiveEmergencyCardProps {
    request: EmergencyRequest;
    onComplete?: () => void;
    onUpdateStatus?: () => void;
    onViewDetails?: () => void;
}

const getStatusText = (status: EmergencyStatus) => {
    switch (status) {
        case 'ACTIVE':
            return 'En Camino';
        case 'IN_PROGRESS':
            return 'Llegando';
        case 'ON_SITE':
            return 'En Sitio';
        case 'COMPLETED':
            return 'Completado';
        case 'CANCELLED':
            return 'Cancelado';
        case 'PENDING':
            return 'Pendiente';
        default:
            return 'Activo';
    }
};

const getUpdateButtonText = (status: EmergencyStatus) => {
    switch (status) {
        case 'ACTIVE':
            return 'Marcar Llegando';
        case 'IN_PROGRESS':
            return 'Marcar En Sitio';
        case 'ON_SITE':
            return 'Completar Servicio';
        default:
            return 'Actualizar Estado';
    }
};

export const ActiveEmergencyCard: React.FC<ActiveEmergencyCardProps> = ({
    request,
    onComplete,
    onUpdateStatus,
    onViewDetails
}) => {
    const [elapsedTime, setElapsedTime] = useState('00:00');

    useEffect(() => {
        const updateElapsedTime = () => {
            const now = new Date();
            const created = new Date(request.createdAt);
            const diff = now.getTime() - created.getTime();
            
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            
            setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        // Actualizar inmediatamente
        updateElapsedTime();

        // Actualizar cada segundo
        const interval = setInterval(updateElapsedTime, 1000);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, [request.createdAt]);

    const handleOpenMaps = () => {
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

    const handleCall = () => {
        const phoneNumber = request.patientInfo.phone;
        if (phoneNumber) {
            Linking.openURL(`tel:${phoneNumber}`);
        }
    };

    return (
        <View style={styles.card}>
            {/* Header con estado */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.statusContainer}
                    onPress={onViewDetails}
                >
                    <Icon
                        name="ambulance"
                        type="font-awesome-5"
                        size={20}
                        color="#1E293B"
                    />
                    <Text style={styles.statusText}>
                        {getStatusText(request.status)}
                    </Text>
                    <Icon
                        name="chevron-right"
                        type="font-awesome-5"
                        size={16}
                        color="#64748B"
                    />
                </TouchableOpacity>
                <Text style={styles.timeElapsed}>{elapsedTime}</Text>
            </View>

            {/* Información del paciente */}
            <View style={styles.patientInfo}>
                <Text style={styles.label}>Paciente:</Text>
                <Text style={styles.value}>{request.patientInfo.name}</Text>
                {request.patientInfo.age && (
                    <Text style={styles.value}>{request.patientInfo.age} años</Text>
                )}
            </View>

            {/* Ubicación */}
            <View style={styles.locationContainer}>
                <Icon
                    name="map-marker-alt"
                    type="font-awesome-5"
                    size={16}
                    color="#64748B"
                />
                <Text style={styles.address}>{request.location.address}</Text>
            </View>

            {/* Botones de acción */}
            <View style={styles.actions}>
                <TouchableOpacity 
                    style={[styles.button, styles.navigationButton]} 
                    onPress={handleOpenMaps}
                >
                    <Icon
                        name="directions"
                        type="font-awesome-5"
                        size={16}
                        color="#FFFFFF"
                    />
                    <Text style={styles.buttonText}>Navegar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.callButton]} 
                    onPress={handleCall}
                >
                    <Icon
                        name="phone"
                        type="font-awesome-5"
                        size={16}
                        color="#FFFFFF"
                    />
                    <Text style={styles.buttonText}>Llamar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.updateButton]} 
                    onPress={onUpdateStatus}
                >
                    <Icon
                        name="clock"
                        type="font-awesome-5"
                        size={16}
                        color="#FFFFFF"
                    />
                    <Text style={styles.buttonText}>
                        {getUpdateButtonText(request.status)}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    timeElapsed: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    patientInfo: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '500',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    address: {
        fontSize: 14,
        color: '#64748B',
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 8,
    },
    navigationButton: {
        backgroundColor: '#3B82F6',
    },
    callButton: {
        backgroundColor: '#22C55E',
    },
    updateButton: {
        backgroundColor: '#6366F1',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
}); 