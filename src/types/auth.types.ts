import { Role, OperatorType, BaseUser } from './roles.types';

// Estados posibles para un operador
export type OperatorStatus = 'available' | 'busy' | 'offline' | 'emergency';

// Información del perfil de operador
export interface OperatorProfile {
    // Campos base
    firstName: string;
    middleName?: string;
    lastNames: string;
    displayName?: string;
    email: string;
    phone: string;
    
    // Campos específicos del operador
    licenseNumber: string;
    status: OperatorStatus;
    currentLocation?: {
        latitude: number;
        longitude: number;
    };
    
    // Campos de servicio
    serviceUnit?: string;       // Unidad de servicio (ej: ambulancia, vehículo de delivery)
    providerId: string;         // ID del proveedor al que pertenece
    
    // Campos de perfil
    profileImage?: string;
    rating?: number;
    totalServices?: number;
    
    // Campos específicos por tipo de operador
    certifications?: string[];  // Certificaciones médicas/técnicas
    specializations?: string[]; // Especializaciones
    lastActive?: Date;
    
    // Campo de emergencia activa (solo para paramédicos)
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
}

// Estado de autenticación
export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: BaseUser | null;
    profile: OperatorProfile | null;
    error: string | null;
}

// Credenciales de login
export interface LoginCredentials {
    email: string;
    password: string;
} 