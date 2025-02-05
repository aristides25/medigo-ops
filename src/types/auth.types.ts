import { Role, OperatorType, BaseUser } from './roles.types';

export type OperatorRole = 'paramedic' | 'nurse' | 'delivery';
export type OperatorStatus = 'available' | 'busy' | 'offline' | 'emergency';

// Información del perfil específica del paramédico
export interface ParamedicProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  ambulanceUnit: string;
  hospitalId?: string;  // Legacy - será reemplazado por providerId
  status: OperatorStatus;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  profileImage?: string;
  rating?: number;
  totalServices?: number;
  activeEmergency?: {
    id: string;
    patientId: string;
    location: {
      latitude: number;
      longitude: number;
    };
    status: 'en_route' | 'on_site' | 'transporting' | 'completed';
    startTime: Date;
  };
  certifications: string[];  // Lista de certificaciones médicas
  specializations: string[]; // Especializaciones (trauma, cardiología, etc.)
  lastActive?: Date;
}

// Estado de autenticación con User y Profile separados
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: BaseUser | null;
  profile: ParamedicProfile | null;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
} 