// Roles principales de la plataforma
export enum Role {
    OPERATOR = 'OPERATOR'  // Solo necesitamos OPERATOR en medigo-ops
}

// Tipos de operadores
export enum OperatorType {
    TRANSPORT = 'TRANSPORT',    // Para MEDICAL_CENTER
    COURIER = 'COURIER',        // Para PHARMACY
    TECHNICIAN = 'TECHNICIAN',  // Para LABORATORY
    PARAMEDIC = 'PARAMEDIC',    // Para EMERGENCY
    CAREGIVER = 'CAREGIVER'     // Para HOMECARE
}

// Tipos de proveedores
export enum ProviderType {
    MEDICAL_CENTER = 'MEDICAL_CENTER',
    PHARMACY = 'PHARMACY',
    LABORATORY = 'LABORATORY',
    EMERGENCY = 'EMERGENCY',
    HOMECARE = 'HOMECARE',
    OFFICE_SPECIALIST = 'OFFICE_SPECIALIST',
    VIRTUAL_SPECIALIST = 'VIRTUAL_SPECIALIST'
}

// Estructura base de usuario
export interface BaseUser {
    id: string;
    role: Role;                 // Siempre será OPERATOR en medigo-ops
    operatorType: OperatorType; // Tipo específico de operador
    providerId: string;         // ID del proveedor al que pertenece
} 