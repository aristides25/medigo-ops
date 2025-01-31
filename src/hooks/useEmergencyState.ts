import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyStatus, EmergencyStateChange, ALLOWED_TRANSITIONS, Location } from '../types/emergency';

interface UseEmergencyStateProps {
    initialState?: EmergencyStatus;
    emergencyId: string;
}

export const useEmergencyState = ({ initialState = 'PENDING', emergencyId }: UseEmergencyStateProps) => {
    const [currentState, setCurrentState] = useState<EmergencyStatus>(initialState);
    const [stateHistory, setStateHistory] = useState<EmergencyStateChange[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar historial al iniciar
    useEffect(() => {
        const loadHistory = async () => {
            try {
                setIsLoading(true);
                const storageKey = `emergency_${emergencyId}_timeline`;
                const storedHistory = await AsyncStorage.getItem(storageKey);
                
                if (storedHistory) {
                    const parsedHistory = JSON.parse(storedHistory);
                    setStateHistory(parsedHistory);
                    const lastState = parsedHistory[parsedHistory.length - 1].status;
                    setCurrentState(lastState);
                } else {
                    // Si no hay historial, crear el estado inicial
                    const initialStateChange: EmergencyStateChange = {
                        status: initialState,
                        timestamp: new Date(),
                        notes: 'Estado inicial'
                    };
                    setStateHistory([initialStateChange]);
                    setCurrentState(initialState);
                    await AsyncStorage.setItem(storageKey, JSON.stringify([initialStateChange]));
                }
            } catch (error) {
                console.error('Error al cargar historial:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadHistory();
    }, [emergencyId, initialState]);

    // Validar si una transición es permitida
    const isTransitionAllowed = useCallback((fromState: EmergencyStatus, toState: EmergencyStatus): boolean => {
        if (!fromState || !toState) return false;
        const allowedStates = ALLOWED_TRANSITIONS[fromState];
        return allowedStates ? allowedStates.includes(toState) : false;
    }, []);

    // Actualizar el estado
    const updateState = useCallback(async (
        newState: EmergencyStatus,
        location?: Location,
        notes?: string
    ): Promise<boolean> => {
        // Si el estado actual es el mismo que el nuevo, no hacer nada
        if (currentState === newState) return true;

        // Validar la transición
        if (!isTransitionAllowed(currentState, newState)) {
            console.warn(`Transición no permitida de ${currentState} a ${newState}`);
            return false;
        }

        const stateChange: EmergencyStateChange = {
            status: newState,
            timestamp: new Date(),
            location,
            notes
        };

        try {
            const storageKey = `emergency_${emergencyId}_timeline`;
            const updatedHistory = [...stateHistory, stateChange];
            await AsyncStorage.setItem(storageKey, JSON.stringify(updatedHistory));
            setStateHistory(updatedHistory);
            setCurrentState(newState);
            return true;
        } catch (error) {
            console.error('Error al guardar estado:', error);
            return false;
        }
    }, [currentState, emergencyId, stateHistory, isTransitionAllowed]);

    // Obtener el tiempo en el estado actual
    const getCurrentStateDuration = useCallback((): number => {
        const lastChange = stateHistory[stateHistory.length - 1];
        if (!lastChange) return 0;
        return Date.now() - new Date(lastChange.timestamp).getTime();
    }, [stateHistory]);

    // Verificar si se debe cambiar a estado ARRIVING
    const checkArrivingState = useCallback((currentLocation: Location, targetLocation: Location) => {
        if (currentState === 'IN_PROGRESS') {
            const distance = calculateDistance(currentLocation, targetLocation); // Implementar esta función
            if (distance <= 0.5) { // 500 metros
                updateState('ARRIVING', currentLocation, 'Cambio automático a ARRIVING por proximidad');
            }
        }
    }, [currentState, updateState]);

    return {
        currentState,
        stateHistory,
        updateState,
        isTransitionAllowed,
        getCurrentStateDuration,
        checkArrivingState,
        isLoading
    };
};

// Función auxiliar para calcular distancia (implementación básica)
const calculateDistance = (location1: Location, location2: Location): number => {
    // Implementación básica del cálculo de distancia usando la fórmula de Haversine
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(location2.latitude - location1.latitude);
    const dLon = toRad(location2.longitude - location1.longitude);
    const lat1 = toRad(location1.latitude);
    const lat2 = toRad(location2.latitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const toRad = (value: number): number => {
    return value * Math.PI / 180;
}; 