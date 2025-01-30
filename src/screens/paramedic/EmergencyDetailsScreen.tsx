import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ParamedicStackParamList } from '../../navigation/ParamedicStack';
import { EmergencyRequest } from '../../types/emergency';
import { deserializeDate, formatDate } from '../../utils/dateUtils';

type EmergencyDetailsRouteProp = RouteProp<ParamedicStackParamList, 'EmergencyDetails'>;

export const EmergencyDetailsScreen = () => {
    const route = useRoute<EmergencyDetailsRouteProp>();
    const { request } = route.params;

    // Deserializamos las fechas
    const createdAt = deserializeDate(request.createdAt);
    const acceptedAt = request.acceptedAt ? deserializeDate(request.acceptedAt) : undefined;
    const completedAt = request.completedAt ? deserializeDate(request.completedAt) : undefined;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Tipo de Emergencia */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tipo de Emergencia</Text>
                <View style={styles.typeContainer}>
                    <Icon
                        name="ambulance"
                        type="font-awesome-5"
                        size={24}
                        color="#1E293B"
                    />
                    <Text style={styles.typeText}>{request.type}</Text>
                </View>
            </View>

            {/* Información del Paciente */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información del Paciente</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Nombre:</Text>
                        <Text style={styles.value}>{request.patientInfo.name}</Text>
                    </View>
                    {request.patientInfo.age && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Edad:</Text>
                            <Text style={styles.value}>{request.patientInfo.age} años</Text>
                        </View>
                    )}
                    {request.patientInfo.gender && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Género:</Text>
                            <Text style={styles.value}>{request.patientInfo.gender}</Text>
                        </View>
                    )}
                    {request.patientInfo.phone && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Teléfono:</Text>
                            <Text style={styles.value}>{request.patientInfo.phone}</Text>
                        </View>
                    )}
                    {request.patientInfo.bloodType && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Tipo de Sangre:</Text>
                            <Text style={styles.value}>{request.patientInfo.bloodType}</Text>
                        </View>
                    )}
                    {request.patientInfo.medicalConditions && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Condiciones Médicas:</Text>
                            <Text style={styles.value}>{request.patientInfo.medicalConditions.join(', ')}</Text>
                        </View>
                    )}
                    {request.patientInfo.allergies && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Alergias:</Text>
                            <Text style={styles.value}>{request.patientInfo.allergies.join(', ')}</Text>
                        </View>
                    )}
                    {request.patientInfo.medications && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Medicamentos:</Text>
                            <Text style={styles.value}>{request.patientInfo.medications.join(', ')}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Ubicación */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ubicación</Text>
                <View style={styles.locationContainer}>
                    <Icon
                        name="map-marker-alt"
                        type="font-awesome-5"
                        size={20}
                        color="#64748B"
                        style={styles.locationIcon}
                    />
                    <Text style={styles.address}>{request.location.address}</Text>
                </View>
            </View>

            {/* Detalles Adicionales */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detalles</Text>
                <Text style={styles.description}>{request.description}</Text>
            </View>

            {/* Tiempos */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tiempos</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Creado:</Text>
                        <Text style={styles.value}>{formatDate(createdAt)}</Text>
                    </View>
                    {acceptedAt && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Aceptado:</Text>
                            <Text style={styles.value}>{formatDate(acceptedAt)}</Text>
                        </View>
                    )}
                    {completedAt && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Completado:</Text>
                            <Text style={styles.value}>{formatDate(completedAt)}</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        padding: 16,
    },
    section: {
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 12,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    typeText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1E293B',
    },
    infoContainer: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        width: 100,
        fontSize: 14,
        color: '#64748B',
    },
    value: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    locationIcon: {
        marginTop: 2,
    },
    address: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
        lineHeight: 20,
    },
    description: {
        fontSize: 14,
        color: '#1E293B',
        lineHeight: 20,
    },
}); 