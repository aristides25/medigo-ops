export type OperatorRole = 'paramedic' | 'nurse' | 'delivery';
export type OperatorStatus = 'available' | 'busy' | 'offline' | 'emergency';

export interface ParamedicProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  ambulanceUnit: string;
  hospitalId?: string;  // ID del hospital/clínica al que está asignado
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

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ParamedicProfile | null;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
} 