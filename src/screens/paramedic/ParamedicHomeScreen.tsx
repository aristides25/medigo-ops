import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmergencyRequestCard } from '../../components/EmergencyRequestCard';
import { ActiveEmergencyCard } from '../../components/ActiveEmergencyCard';
import { MOCK_EMERGENCY_REQUESTS } from '../../constants/mockData';
import { EmergencyRequest } from '../../types/emergency';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamedicStackParamList } from '../../navigation/ParamedicStack';
import { serializeDate } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<ParamedicStackParamList>;

export const ParamedicHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null);
  const [pendingRequests, setPendingRequests] = useState(MOCK_EMERGENCY_REQUESTS);

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
  };

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
}); 