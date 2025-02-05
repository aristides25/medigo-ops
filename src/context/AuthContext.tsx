import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthState, LoginCredentials, ParamedicProfile } from '../types/auth.types';
import { Role, OperatorType, BaseUser } from '../types/roles.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Datos de prueba para simular paramédicos registrados
const MOCK_PARAMEDICS: Array<{ 
  user: BaseUser, 
  profile: ParamedicProfile, 
  password: string 
}> = [
  {
    user: {
      id: 'P001',
      role: Role.OPERATOR,
      operatorType: OperatorType.PARAMEDIC,
      providerId: 'H001'
    },
    profile: {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@medigo.com',
      phone: '+58 412-1234567',
      licenseNumber: 'PM-12345',
      ambulanceUnit: 'AMB-001',
      hospitalId: 'H001',
      status: 'available' as const,
      currentLocation: {
        latitude: 10.4806,
        longitude: -66.9036,
      },
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 4.8,
      totalServices: 156,
      certifications: ['BLS', 'ACLS', 'PHTLS'],
      specializations: ['Trauma', 'Emergencias Cardiovasculares'],
      lastActive: new Date()
    },
    password: '123456'
  },
  {
    user: {
      id: 'P002',
      role: Role.OPERATOR,
      operatorType: OperatorType.PARAMEDIC,
      providerId: 'H001'
    },
    profile: {
      firstName: 'María',
      lastName: 'Rodríguez',
      email: 'maria.rodriguez@medigo.com',
      phone: '+58 414-7654321',
      licenseNumber: 'PM-12346',
      ambulanceUnit: 'AMB-002',
      hospitalId: 'H001',
      status: 'available' as const,
      currentLocation: {
        latitude: 10.4806,
        longitude: -66.9036,
      },
      profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 4.9,
      totalServices: 203,
      certifications: ['BLS', 'ACLS', 'PHTLS', 'AMLS'],
      specializations: ['Trauma', 'Emergencias Pediátricas'],
      lastActive: new Date()
    },
    password: '123456'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    profile: null,
    error: null,
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar paramédico por email
      const paramedic = MOCK_PARAMEDICS.find(p => p.profile.email === credentials.email);
      
      if (!paramedic || paramedic.password !== credentials.password) {
        throw new Error('Credenciales inválidas');
      }

      // Actualizamos el estado con user y profile separados
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: paramedic.user,
        profile: paramedic.profile,
        error: null,
      });

    } catch (error) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        profile: null,
        error: 'Credenciales inválidas. Por favor verifica tus datos.',
      });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      profile: null,
      error: null,
    });
  }, []);

  const value = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 