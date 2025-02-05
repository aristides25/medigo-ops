// Roles principales de la plataforma
export enum Role {
    OPERATOR = 'OPERATOR'  // Solo necesitamos OPERATOR en medigo-ops
}

// Tipos de operadores
export enum OperatorType {
    PARAMEDIC = 'PARAMEDIC'  // Solo necesitamos PARAMEDIC en esta app
}

// Tipos de proveedores
export enum ProviderType {
    EMERGENCY = 'EMERGENCY'  // Solo necesitamos EMERGENCY en esta app
}

// Estructura base de usuario
export interface BaseUser {
    id: string;
    role: Role;
    operatorType?: OperatorType;
    providerId?: string;
} 