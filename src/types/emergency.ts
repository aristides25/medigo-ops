export type EmergencyType = 'CARDIAC' | 'TRAUMA' | 'RESPIRATORY' | 'GENERAL';
export type EmergencyStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type ParamedicStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
}

export interface PatientInfo {
    name: string;
    age?: number;
    gender?: string;
    phone?: string;
}

export interface EmergencyRequest {
    id: string;
    type: EmergencyType;
    status: EmergencyStatus;
    priority: Priority;
    location: Location;
    patientInfo: PatientInfo;
    description: string;
    createdAt: Date;
    distance?: number; // Distancia calculada al paramédico
} 