import React, { createContext, useContext } from 'react';
import { useEmergencyState } from '../hooks/useEmergencyState';
import { EmergencyStatus, Location } from '../types/emergency';

interface EmergencyStateContextType {
    currentState: EmergencyStatus;
    updateState: (newState: EmergencyStatus, location?: Location, notes?: string) => Promise<void>;
    isTransitionAllowed: (fromState: EmergencyStatus, toState: EmergencyStatus) => boolean;
    stateHistory: any[];
    isLoading: boolean;
}

const EmergencyStateContext = createContext<EmergencyStateContextType | null>(null);

export const EmergencyStateProvider: React.FC<{
    children: React.ReactNode;
    emergencyId: string;
    initialState?: EmergencyStatus;
}> = ({ children, emergencyId, initialState }) => {
    const state = useEmergencyState({ emergencyId, initialState });

    return (
        <EmergencyStateContext.Provider value={state}>
            {children}
        </EmergencyStateContext.Provider>
    );
};

export const useEmergencyStateContext = () => {
    const context = useContext(EmergencyStateContext);
    if (!context) {
        throw new Error('useEmergencyStateContext must be used within an EmergencyStateProvider');
    }
    return context;
}; 