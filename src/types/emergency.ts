export type EmergencyType = 'CARDIAC' | 'TRAUMA' | 'RESPIRATORY' | 'GENERAL';
export type EmergencyStatus = 
    | 'PENDING'
    | 'ACTIVE'
    | 'IN_PROGRESS'
    | 'ARRIVING'
    | 'ON_SITE'
    | 'COMPLETED'
    | 'CANCELLED';
export type ParamedicStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
    reference?: string;
    buildingDetails?: string;
    accessNotes?: string;
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
    preferredLanguage?: string;
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
}

export interface StateHistoryEntry {
    state: EmergencyStatus;
    timestamp: string;
    notes?: string;
}

export interface ServiceDetails {
    startTime: string;
    endTime?: string;
    duration?: number;
    notes: string[];
    stateHistory: StateHistoryEntry[];
}

export interface EmergencyRequest {
    id: string;
    type: EmergencyType;
    status: EmergencyStatus;
    priority: Priority;
    location: Location;
    patientInfo: PatientInfo;
    description: string;
    createdAt: string;
    acceptedAt?: string;
    completedAt?: string;
    distance?: number;
    notes?: string[];
    serviceDetails?: ServiceDetails;
} 