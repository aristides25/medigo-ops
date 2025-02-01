import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Alert, TextInput, ScrollView } from 'react-native';
import { Text, Icon, Button, Overlay } from '@rneui/themed';
import { EmergencyRequest, EmergencyStatus, Location } from '../types/emergency';

interface ActiveEmergencyCardProps {
    request: EmergencyRequest;
    onComplete?: (completionData: {
        endTime: string;
        duration: number;
        finalLocation: Location;
        notes: string;
        summary: string;
    }) => void;
    onUpdateStatus?: () => void;
    onViewDetails?: () => void;
}

const getStatusText = (status: EmergencyStatus) => {
    switch (status) {
        case 'ACTIVE':
            return 'En Camino';
        case 'IN_PROGRESS':
            return 'Llegando';
        case 'ARRIVING':
            return 'Muy Cerca';
        case 'ON_SITE':
            return 'En Sitio';
        case 'COMPLETED':
            return 'Completado';
        case 'CANCELLED':
            return 'Cancelado';
        default:
            return 'Activo';
    }
};

const getUpdateButtonText = (status: EmergencyStatus) => {
    switch (status) {
        case 'ACTIVE':
            return 'Marcar En Camino';
        case 'IN_PROGRESS':
        case 'ARRIVING':
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
    const [isViewingNotes, setIsViewingNotes] = useState(false);
    const [isCompletingService, setIsCompletingService] = useState(false);
    const [selectedQuickNote, setSelectedQuickNote] = useState<string>('');
    const [completionData, setCompletionData] = useState({
        notes: '',
    });

    const handleCallPatient = () => {
        if (request.patientInfo.phone) {
            Linking.openURL(`tel:${request.patientInfo.phone}`);
        } else {
            Alert.alert('Error', 'No hay número de teléfono disponible');
        }
    };

    const handleCallEmergencyContact = () => {
        if (request.patientInfo.emergencyContact?.phone) {
            Linking.openURL(`tel:${request.patientInfo.emergencyContact.phone}`);
        } else {
            Alert.alert('Error', 'No hay número de contacto de emergencia disponible');
        }
    };

    const handleOpenNavigation = () => {
        const { latitude, longitude } = request.location;
        Alert.alert(
            'Navegación',
            '¿Qué aplicación deseas usar?',
            [
                {
                    text: 'Google Maps',
                    onPress: () => {
                        Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
                    }
                },
                {
                    text: 'Waze',
                    onPress: () => {
                        Linking.openURL(`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`);
                    }
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        );
    };

    const handleUpdateStatus = () => {
        if (request.status === 'ON_SITE') {
            setIsCompletingService(true);
        } else {
            onUpdateStatus?.();
        }
    };

    const handleQuickNoteSelect = (note: string) => {
        setSelectedQuickNote(note);
        setCompletionData({ notes: note });
    };

    const handleCompleteService = () => {
        const endTime = new Date().toISOString();
        const startTime = new Date(request.serviceDetails?.startTime || request.createdAt);
        const duration = Math.floor((new Date(endTime).getTime() - startTime.getTime()) / 60000);

        onComplete?.({
            endTime,
            duration,
            finalLocation: request.location,
            notes: completionData.notes.trim(),
            summary: selectedQuickNote || 'Servicio completado'
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
                </View>
                <TouchableOpacity onPress={onViewDetails}>
                    <Icon name="chevron-right" type="feather" size={24} color="#64748B" />
                </TouchableOpacity>
            </View>

            <View style={styles.patientInfo}>
                <Text style={styles.label}>Paciente</Text>
                <Text style={styles.value}>{request.patientInfo.name}</Text>
                {request.serviceDetails?.notes && request.serviceDetails.notes.length > 0 && (
                    <TouchableOpacity 
                        style={styles.notesIndicator}
                        onPress={() => setIsViewingNotes(true)}
                    >
                        <Icon name="file-text" type="feather" size={16} color="#3B82F6" />
                        <Text style={styles.notesText}>
                            {request.serviceDetails.notes.length} nota{request.serviceDetails.notes.length !== 1 ? 's' : ''} del paciente
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.locationContainer}>
                <Icon name="map-pin" type="feather" size={16} color="#64748B" />
                <Text style={styles.address}>{request.location.address}</Text>
            </View>

            <View style={styles.actionsContainer}>
                {/* Botones de llamada */}
                <View style={styles.callButtons}>
                    <TouchableOpacity 
                        style={[styles.button, styles.callButton]}
                        onPress={handleCallPatient}
                    >
                        <Icon name="phone" type="feather" size={20} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Llamar al Paciente</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.emergencyContactButton]}
                        onPress={handleCallEmergencyContact}
                    >
                        <Icon name="phone-forwarded" type="feather" size={20} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Contacto de Emergencia</Text>
                    </TouchableOpacity>
                </View>

                {/* Botón de navegación */}
                <TouchableOpacity 
                    style={[styles.button, styles.navigationButton]}
                    onPress={handleOpenNavigation}
                >
                    <Icon name="navigation" type="feather" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Navegar</Text>
                </TouchableOpacity>

                {/* Botón de notas */}
                <TouchableOpacity 
                    style={[styles.button, styles.noteButton]}
                    onPress={() => setIsViewingNotes(true)}
                >
                    <Icon name="file-text" type="feather" size={20} color="#1E293B" />
                    <Text style={[styles.buttonText, { color: '#1E293B' }]}>Ver Notas</Text>
                </TouchableOpacity>

                {/* Botón de actualizar estado */}
                <TouchableOpacity 
                    style={[styles.button, styles.updateButton]}
                    onPress={handleUpdateStatus}
                >
                    <Icon name="check-circle" type="feather" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>{getUpdateButtonText(request.status)}</Text>
                </TouchableOpacity>
            </View>

            {/* Modal para completar servicio */}
            <Overlay
                isVisible={isCompletingService}
                onBackdropPress={() => setIsCompletingService(false)}
                overlayStyle={styles.overlay}
            >
                <View style={styles.completionContainer}>
                    <Text style={styles.completionTitle}>Completar Servicio</Text>
                    
                    {/* Duración del Servicio */}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Inicio del Servicio:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(request.serviceDetails?.startTime || request.createdAt).toLocaleTimeString()}
                        </Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ubicación Final:</Text>
                        <Text style={styles.infoValue}>{request.location.address}</Text>
                    </View>

                    {/* Opciones Rápidas */}
                    <View style={styles.quickOptions}>
                        <TouchableOpacity 
                            style={[
                                styles.quickOptionButton,
                                selectedQuickNote === 'Sin incidencias' && styles.quickOptionSelected
                            ]}
                            onPress={() => handleQuickNoteSelect('Sin incidencias')}
                        >
                            <Text style={[
                                styles.quickOptionText,
                                selectedQuickNote === 'Sin incidencias' && styles.quickOptionTextSelected
                            ]}>Sin incidencias</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.quickOptionButton,
                                selectedQuickNote === 'Paciente estable' && styles.quickOptionSelected
                            ]}
                            onPress={() => handleQuickNoteSelect('Paciente estable')}
                        >
                            <Text style={[
                                styles.quickOptionText,
                                selectedQuickNote === 'Paciente estable' && styles.quickOptionTextSelected
                            ]}>Paciente estable</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.quickOptionButton,
                                selectedQuickNote === 'Traslado completado' && styles.quickOptionSelected
                            ]}
                            onPress={() => handleQuickNoteSelect('Traslado completado')}
                        >
                            <Text style={[
                                styles.quickOptionText,
                                selectedQuickNote === 'Traslado completado' && styles.quickOptionTextSelected
                            ]}>Traslado completado</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Campo de Notas (Opcional) */}
                    <Text style={styles.inputLabel}>Notas Adicionales (Opcional)</Text>
                    <TextInput
                        style={styles.notesInput}
                        multiline
                        numberOfLines={4}
                        placeholder="Añade notas adicionales si es necesario..."
                        value={completionData.notes}
                        onChangeText={(text) => {
                            setCompletionData({ notes: text });
                            if (text !== selectedQuickNote) {
                                setSelectedQuickNote('');
                            }
                        }}
                    />

                    <View style={styles.completionActions}>
                        <Button
                            title="Cancelar"
                            type="clear"
                            onPress={() => {
                                setIsCompletingService(false);
                                setSelectedQuickNote('');
                                setCompletionData({ notes: '' });
                            }}
                        />
                        <Button
                            title="Completar"
                            onPress={handleCompleteService}
                            disabled={!selectedQuickNote}
                        />
                    </View>
                </View>
            </Overlay>

            {/* Modal para ver notas */}
            <Overlay
                isVisible={isViewingNotes}
                onBackdropPress={() => setIsViewingNotes(false)}
                overlayStyle={styles.overlay}
            >
                <View style={styles.noteContainer}>
                    <Text style={styles.noteTitle}>Notas del Paciente</Text>
                    <ScrollView style={styles.notesScrollView}>
                        {request.serviceDetails?.notes && request.serviceDetails.notes.length > 0 ? (
                            request.serviceDetails.notes.map((note, index) => (
                                <View key={index} style={styles.noteItem}>
                                    <Text style={styles.noteText}>{note}</Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.noteItem}>
                                <Text style={styles.noteText}>No hay notas disponibles</Text>
                            </View>
                        )}
                    </ScrollView>
                    <Button
                        title="Cerrar"
                        onPress={() => setIsViewingNotes(false)}
                    />
                </View>
            </Overlay>
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
    actionsContainer: {
        gap: 12,
    },
    callButtons: {
        flexDirection: 'row',
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
    callButton: {
        backgroundColor: '#22C55E',
        flex: 1,
    },
    navigationButton: {
        backgroundColor: '#3B82F6',
    },
    updateButton: {
        backgroundColor: '#6366F1',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    overlay: {
        width: '90%',
        borderRadius: 12,
        padding: 0,
    },
    noteContainer: {
        padding: 16,
    },
    noteTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 16,
    },
    notesIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    notesText: {
        fontSize: 14,
        color: '#3B82F6',
    },
    emergencyContactButton: {
        backgroundColor: '#DC2626',
        flex: 1,
    },
    noteButton: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    noteItem: {
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    noteText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    notesScrollView: {
        maxHeight: 300,
        marginBottom: 16,
    },
    completionContainer: {
        padding: 16,
    },
    completionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#64748B',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '500',
        flex: 2,
    },
    inputLabel: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
        marginTop: 12,
    },
    notesInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
        textAlignVertical: 'top',
        fontSize: 14,
        color: '#1E293B',
        backgroundColor: '#F8FAFC',
    },
    completionActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 20,
    },
    quickOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginVertical: 16,
    },
    quickOptionButton: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    quickOptionSelected: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    quickOptionText: {
        color: '#1E293B',
        fontSize: 14,
    },
    quickOptionTextSelected: {
        color: '#FFFFFF',
    },
}); 