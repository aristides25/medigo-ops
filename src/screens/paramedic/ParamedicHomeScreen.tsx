import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import { Text, Icon, Overlay } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmergencyRequestCard } from '../../components/EmergencyRequestCard';
import { ActiveEmergencyCard } from '../../components/ActiveEmergencyCard';
import { MOCK_EMERGENCY_REQUESTS } from '../../constants/mockData';
import { EmergencyRequest } from '../../types/emergency';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/ParamedicStack';
import { serializeDate } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface EmergencyNotificationProps {
  request: EmergencyRequest | null;
  visible: boolean;
  onClose: () => void;
  onAccept: (request: EmergencyRequest) => void;
  onReject: (requestId: string) => void;
}

const EmergencyNotification: React.FC<EmergencyNotificationProps> = ({ 
  request, 
  visible, 
  onClose,
  onAccept,
  onReject
}) => {
  const slideAnim = React.useRef(new Animated.Value(-300)).current;
  const shakeAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  const startShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 15,
        duration: 80,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: -15,
        duration: 80,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 15,
        duration: 80,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: -15,
        duration: 80,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 80,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 80,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true
      })
    ]).start(() => {
      setTimeout(startShakeAnimation, 1500);
    });
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 12,
          bounciness: 8
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(() => {
        startShakeAnimation();
      });
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [visible]);

  if (!request) return null;

  const getPriorityColor = () => {
    switch (request.priority) {
      case 'HIGH':
        return '#DC2626';
      case 'MEDIUM':
        return '#F59E0B';
      case 'LOW':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getEmergencyIcon = () => {
    switch (request.type) {
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

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={onClose}
      overlayStyle={styles.overlay}
      backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <Animated.View
        style={[
          styles.notificationContainer,
          {
            width: width - 32,
            transform: [
              { translateY: slideAnim },
              { translateX: shakeAnim }
            ],
            opacity: fadeAnim
          }
        ]}
      >
        <View style={styles.notificationContent}>
          {/* Header */}
          <View style={styles.notificationHeader}>
            <View style={styles.notificationTitleContainer}>
              <Icon
                name={getEmergencyIcon()}
                type="font-awesome-5"
                size={24}
                color={getPriorityColor()}
              />
              <Text style={styles.notificationTitle}>¡Nueva Emergencia!</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" type="feather" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Tipo y Prioridad */}
          <View style={styles.emergencyTypeContainer}>
            <Text style={styles.emergencyType}>{request.type}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
              <Text style={styles.priorityText}>{request.priority}</Text>
            </View>
          </View>

          {/* Descripción */}
          <Text style={styles.description}>{request.description}</Text>

          {/* Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Icon name="map-pin" type="feather" size={16} color="#64748B" />
              <Text style={styles.infoText}>{request.location.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="navigation" type="feather" size={16} color="#64748B" />
              <Text style={styles.infoText}>
                {request.distance ? `${request.distance.toFixed(1)} km` : 'Calculando...'}
              </Text>
            </View>
          </View>

          {/* Botones */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.acceptButton]}
              onPress={() => {
                onAccept(request);
                onClose();
              }}
            >
              <Icon name="check" type="feather" size={20} color="#FFFFFF" />
              <Text style={styles.acceptButtonText}>Aceptar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => {
                onReject(request.id);
                onClose();
              }}
            >
              <Icon name="x" type="feather" size={20} color="#DC2626" />
              <Text style={styles.rejectButtonText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Overlay>
  );
};

export const ParamedicHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null);
  const [pendingRequests, setPendingRequests] = useState<EmergencyRequest[]>(MOCK_EMERGENCY_REQUESTS);
  const [newEmergency, setNewEmergency] = useState<EmergencyRequest | null>(null);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const handleAcceptRequest = (request: EmergencyRequest) => {
    const updatedRequest = {
      ...request,
      status: 'ACTIVE' as const,
      acceptedAt: new Date()
    };
    setActiveRequest(updatedRequest);
    setPendingRequests(prev => prev.filter(r => r.id !== request.id));
    setIsAvailable(false);
  };

  const handleRejectRequest = (requestId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleUpdateStatus = () => {
    if (!activeRequest) return;

    const nextStatus = (() => {
      switch (activeRequest.status) {
        case 'ACTIVE':
          return 'IN_PROGRESS';
        case 'IN_PROGRESS':
          return 'ON_SITE';
        case 'ON_SITE':
          return 'COMPLETED';
        default:
          return activeRequest.status;
      }
    })();

    setActiveRequest({
      ...activeRequest,
      status: nextStatus,
      ...(nextStatus === 'COMPLETED' ? { completedAt: new Date() } : {})
    });

    if (nextStatus === 'COMPLETED') {
      setActiveRequest(null);
      setIsAvailable(true);
    }
  };

  const handleViewDetails = (request: EmergencyRequest) => {
    const serializedRequest = {
      ...request,
      createdAt: serializeDate(request.createdAt),
      acceptedAt: request.acceptedAt ? serializeDate(request.acceptedAt) : undefined,
      completedAt: request.completedAt ? serializeDate(request.completedAt) : undefined,
    };
    navigation.navigate('EmergencyDetails', { request: serializedRequest });
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  const handleCloseNotification = () => {
    setNotificationVisible(false);
    setNewEmergency(null);
  };

  // Efecto para mostrar la notificación inicial
  useEffect(() => {
    const cardiacEmergency = pendingRequests.find(request => request.type === 'CARDIAC');
    if (cardiacEmergency && !notificationVisible) {
      setNewEmergency(cardiacEmergency);
      setNotificationVisible(true);
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.connectionStatus}>
            <View style={[styles.connectionIndicator, { backgroundColor: '#22C55E' }]} />
            <Text style={styles.connectionText}>Online</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon
              name="power-off"
              type="font-awesome"
              size={16}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Estado Actual</Text>
              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: '#E2E8F0', true: '#BBF7D0' }}
                thumbColor={isAvailable ? '#22C55E' : '#94A3B8'}
                disabled={!!activeRequest}
              />
            </View>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: isAvailable ? '#22C55E' : '#94A3B8' }
                ]}
              />
              <Text style={styles.statusText}>
                {isAvailable ? 'Disponible' : 'No Disponible'}
              </Text>
            </View>
          </View>

          {activeRequest && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Solicitud Activa</Text>
              <ActiveEmergencyCard
                request={activeRequest}
                onUpdateStatus={handleUpdateStatus}
                onViewDetails={() => handleViewDetails(activeRequest)}
              />
            </View>
          )}

          {isAvailable && pendingRequests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Solicitudes Pendientes</Text>
              {pendingRequests.map(request => (
                <EmergencyRequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => handleAcceptRequest(request)}
                  onReject={() => handleRejectRequest(request.id)}
                  onPress={() => handleViewDetails(request)}
                />
              ))}
            </View>
          )}

          {isAvailable && pendingRequests.length === 0 && !activeRequest && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Solicitudes Pendientes</Text>
              <Text style={styles.emptyText}>
                No hay solicitudes pendientes en este momento
              </Text>
            </View>
          )}
        </ScrollView>

        {newEmergency && (
          <EmergencyNotification
            request={newEmergency}
            visible={notificationVisible}
            onClose={handleCloseNotification}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    color: '#64748B',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#475569',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 14,
    fontStyle: 'italic',
  },
  overlay: {
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationContent: {
    padding: 20,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  emergencyTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emergencyType: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
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
    marginBottom: 16,
  },
  infoContainer: {
    gap: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#22C55E',
  },
  rejectButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  rejectButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
}); 