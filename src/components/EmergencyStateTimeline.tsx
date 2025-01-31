import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import { EmergencyStateChange, EmergencyStatus } from '../types/emergency';

interface EmergencyStateTimelineProps {
    stateHistory: EmergencyStateChange[];
    currentState: EmergencyStatus;
}

const getStateEmoji = (status: EmergencyStatus): string => {
    switch (status) {
        case 'PENDING': return '⏳';
        case 'ACCEPTED': return '✅';
        case 'IN_PROGRESS': return '🏃';
        case 'ARRIVING': return '🎯';
        case 'ON_SITE': return '🏥';
        case 'COMPLETED': return '✔️';
        case 'CANCELLED': return '❌';
        default: return '❓';
    }
};

const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStateDescription = (status: EmergencyStatus): string => {
    switch (status) {
        case 'PENDING': return 'Estado inicial';
        case 'ACCEPTED': return 'Emergencia aceptada';
        case 'IN_PROGRESS': return 'Paramédico en camino';
        case 'ARRIVING': return 'Paramédico llegando';
        case 'ON_SITE': return 'Paramédico en el sitio';
        case 'COMPLETED': return 'Emergencia completada';
        case 'CANCELLED': return 'Emergencia cancelada';
        default: return '';
    }
};

export const EmergencyStateTimeline: React.FC<EmergencyStateTimelineProps> = ({
    stateHistory,
    currentState
}) => {
    return (
        <View style={styles.container}>
            {/* Estado Actual */}
            <View style={styles.currentStateContainer}>
                <Text style={styles.currentStateLabel}>Estado Actual:</Text>
                <View style={styles.currentStateContent}>
                    <Text style={styles.currentStateEmoji}>{getStateEmoji(currentState)}</Text>
                    <Text style={styles.currentStateText}>{currentState}</Text>
                </View>
            </View>

            {/* Timeline */}
            <View style={styles.timeline}>
                {stateHistory.map((change, index) => (
                    <View key={index} style={styles.timelineItem}>
                        {/* Línea conectora */}
                        {index < stateHistory.length - 1 && (
                            <View style={styles.timelineLine} />
                        )}
                        
                        {/* Punto del timeline */}
                        <View style={styles.timelinePoint} />
                        
                        {/* Contenido */}
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTime}>
                                {formatTime(change.timestamp)}
                            </Text>
                            <View style={styles.timelineStatusContainer}>
                                <Text style={styles.timelineEmoji}>
                                    {getStateEmoji(change.status)}
                                </Text>
                                <Text style={styles.timelineStatus}>
                                    {change.status}
                                </Text>
                            </View>
                            <Text style={styles.timelineDescription}>
                                {getStateDescription(change.status)}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    currentStateContainer: {
        marginBottom: 24,
    },
    currentStateLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    currentStateContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    currentStateEmoji: {
        fontSize: 24,
    },
    currentStateText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    timeline: {
        paddingLeft: 24,
    },
    timelineItem: {
        position: 'relative',
        paddingBottom: 24,
    },
    timelinePoint: {
        position: 'absolute',
        left: -29,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3B82F6',
    },
    timelineLine: {
        position: 'absolute',
        left: -25,
        top: 10,
        bottom: 0,
        width: 2,
        backgroundColor: '#E2E8F0',
    },
    timelineContent: {
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 8,
    },
    timelineTime: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
    },
    timelineStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    timelineEmoji: {
        fontSize: 16,
    },
    timelineStatus: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1E293B',
    },
    timelineDescription: {
        fontSize: 14,
        color: '#64748B',
        fontStyle: 'italic',
    },
}); 