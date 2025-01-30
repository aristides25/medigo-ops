import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { EmergencyRequest } from '../types/emergency';

interface EmergencyRequestCardProps {
    request: EmergencyRequest;
    onAccept?: () => void;
    onReject?: () => void;
    onPress?: () => void;
}

const getEmergencyIcon = (type: EmergencyRequest['type']) => {
    switch (type) {
        case 'CARDIAC':
            return 'heartbeat';
        case 'RESPIRATORY':
            return 'lungs';
        case 'TRAUMA':
            return 'hospital-user';
        default:
            return 'first-aid';
    }
};

const getPriorityColor = (priority: EmergencyRequest['priority']) => {
    switch (priority) {
        case 'HIGH':
            return '#EF4444';
        case 'MEDIUM':
            return '#F59E0B';
        case 'LOW':
            return '#10B981';
        default:
            return '#6B7280';
    }
};

const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 1000 / 60);
    if (minutes < 1) return 'Ahora';
    if (minutes === 1) return 'Hace 1 minuto';
    if (minutes < 60) return `Hace ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return 'Hace 1 hora';
    return `Hace ${hours} horas`;
};

export const EmergencyRequestCard: React.FC<EmergencyRequestCardProps> = ({
    request,
    onAccept,
    onReject,
    onPress
}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.typeContainer}>
                        <Icon
                            name={getEmergencyIcon(request.type)}
                            type="font-awesome-5"
                            size={20}
                            color="#1E293B"
                        />
                        <Text style={styles.type}>{request.type}</Text>
                    </View>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(request.priority) }]}>
                        <Text style={styles.priorityText}>{request.priority}</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.description}>{request.description}</Text>
                    <Text style={styles.address}>{request.location.address}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.timeAgo}>{formatTimeAgo(request.createdAt)}</Text>
                        <Text style={styles.distance}>{request.distance} km</Text>
                    </View>
                </View>

                {/* Actions */}
                {(onAccept || onReject) && (
                    <View style={styles.actions}>
                        {onReject && (
                            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={onReject}>
                                <Text style={styles.buttonText}>Rechazar</Text>
                            </TouchableOpacity>
                        )}
                        {onAccept && (
                            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={onAccept}>
                                <Text style={[styles.buttonText, styles.acceptButtonText]}>Aceptar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
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
        marginBottom: 12,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    type: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        color: '#475569',
        marginBottom: 8,
    },
    address: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeAgo: {
        fontSize: 12,
        color: '#94A3B8',
    },
    distance: {
        fontSize: 12,
        color: '#94A3B8',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    rejectButton: {
        backgroundColor: '#FEE2E2',
    },
    acceptButton: {
        backgroundColor: '#22C55E',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EF4444',
    },
    acceptButtonText: {
        color: '#FFFFFF',
    },
}); 