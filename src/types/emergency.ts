export type EmergencyType = 'CARDIAC' | 'TRAUMA' | 'RESPIRATORY' | 'GENERAL';
export type EmergencyStatus = 
    | 'PENDING'
    | 'ACTIVE'
    | 'IN_PROGRESS'
    | 'ON_SITE'
    | 'COMPLETED'
    | 'CANCELLED';
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
    bloodType?: string;
    medicalConditions?: string[];
    allergies?: string[];
    medications?: string[];
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
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
    acceptedAt?: Date;
    completedAt?: Date;
    distance?: number;
    notes?: string[];
} 