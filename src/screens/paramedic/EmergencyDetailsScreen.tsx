import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Text, Icon, Button } from '@rneui/themed';
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

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const renderInfoRow = (label: string, value: string | undefined) => {
        if (!value) return null;
        return (
            <View style={styles.infoRow}>
                <Text style={styles.label}>{label}:</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        );
    };

    const renderArrayInfo = (label: string, items: string[] | undefined) => {
        if (!items || items.length === 0) return null;
        return (
            <View style={styles.infoRow}>
                <Text style={styles.label}>{label}:</Text>
                <Text style={styles.value}>{items.join(', ')}</Text>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Tipo de Emergencia y Prioridad */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Emergencia {request.type}</Text>
                <View style={styles.priorityContainer}>
                    <Icon
                        name={request.type === 'CARDIAC' ? 'heartbeat' : 
                             request.type === 'RESPIRATORY' ? 'lungs' : 
                             request.type === 'TRAUMA' ? 'hospital-user' : 'first-aid'}
                        type="font-awesome-5"
                        size={24}
                        color="#DC2626"
                    />
                    <View style={[styles.priorityBadge, { 
                        backgroundColor: request.priority === 'HIGH' ? '#DC2626' : 
                                       request.priority === 'MEDIUM' ? '#F59E0B' : '#10B981'
                    }]}>
                        <Text style={styles.priorityText}>{request.priority}</Text>
                    </View>
                </View>
                <Text style={styles.description}>{request.description}</Text>
            </View>

            {/* Información del Paciente */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información del Paciente</Text>
                <View style={styles.infoContainer}>
                    {renderInfoRow('Nombre', request.patientInfo.name)}
                    {renderInfoRow('Edad', request.patientInfo.age?.toString())}
                    {renderInfoRow('Género', request.patientInfo.gender)}
                    {renderInfoRow('Tipo de Sangre', request.patientInfo.bloodType)}
                    {renderInfoRow('Idioma', request.patientInfo.preferredLanguage)}
                    {renderArrayInfo('Condiciones Médicas', request.patientInfo.medicalConditions)}
                    {renderArrayInfo('Alergias', request.patientInfo.allergies)}
                    {renderArrayInfo('Medicamentos', request.patientInfo.medications)}
                    
                    {request.patientInfo.phone && (
                        <TouchableOpacity 
                            style={styles.phoneContainer}
                            onPress={() => handleCall(request.patientInfo.phone!)}
                        >
                            <Icon name="phone" type="feather" size={20} color="#22C55E" />
                            <Text style={styles.phoneText}>{request.patientInfo.phone}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Contacto de Emergencia */}
            {request.patientInfo.emergencyContact && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>
                    <View style={styles.infoContainer}>
                        {renderInfoRow('Nombre', request.patientInfo.emergencyContact.name)}
                        {renderInfoRow('Relación', request.patientInfo.emergencyContact.relationship)}
                        {request.patientInfo.emergencyContact.phone && (
                            <TouchableOpacity 
                                style={styles.phoneContainer}
                                onPress={() => handleCall(request.patientInfo.emergencyContact!.phone)}
                            >
                                <Icon name="phone" type="feather" size={20} color="#22C55E" />
                                <Text style={styles.phoneText}>
                                    {request.patientInfo.emergencyContact.phone}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Ubicación */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ubicación</Text>
                {/* Vista previa del mapa (placeholder) */}
                <View style={styles.mapPreview}>
                    <Icon name="map" type="feather" size={40} color="#94A3B8" />
                    <Text style={styles.mapPlaceholderText}>Vista previa del mapa</Text>
                </View>
                <View style={styles.infoContainer}>
                    {renderInfoRow('Dirección', request.location.address)}
                    {renderInfoRow('Referencia', request.location.reference)}
                    {renderInfoRow('Detalles del Edificio', request.location.buildingDetails)}
                    {renderInfoRow('Notas de Acceso', request.location.accessNotes)}
                    {renderInfoRow('Distancia', request.distance ? `${request.distance.toFixed(1)} km` : undefined)}
                </View>
            </View>

            {/* Tiempos */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tiempos</Text>
                <View style={styles.infoContainer}>
                    {renderInfoRow('Creado', formatDate(createdAt))}
                    {acceptedAt && renderInfoRow('Aceptado', formatDate(acceptedAt))}
                    {completedAt && renderInfoRow('Completado', formatDate(completedAt))}
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
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 16,
    },
    priorityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    priorityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    description: {
        fontSize: 16,
        color: '#475569',
        marginTop: 8,
    },
    infoContainer: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    label: {
        width: 140,
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    value: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    phoneText: {
        color: '#22C55E',
        fontSize: 16,
        fontWeight: '600',
    },
    mapPreview: {
        height: 200,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    mapPlaceholderText: {
        color: '#94A3B8',
        marginTop: 8,
        fontSize: 14,
    },
}); 