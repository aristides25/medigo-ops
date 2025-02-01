import { EmergencyRequest, Location } from '../types/emergency';

// Ubicación base (Ciudad de México)
export const INITIAL_LOCATION: Location = {
    latitude: 19.4326,
    longitude: -99.1332,
    address: "Ciudad de México, CDMX"
};

// Función auxiliar para crear fechas serializadas
const createMockDate = (minutesAgo: number = 0): string => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - minutesAgo);
    return date.toISOString();
};

// Solicitudes de emergencia mock
export const MOCK_EMERGENCY_REQUESTS: EmergencyRequest[] = [
    {
        id: '1',
        type: 'CARDIAC',
        status: 'PENDING',
        priority: 'HIGH',
        location: {
            latitude: 19.4326,
            longitude: -99.1332,
            address: "Av. Insurgentes Sur 1234, CDMX",
            reference: "Edificio azul, frente al parque",
            buildingDetails: "Piso 3, Apartamento 302",
            accessNotes: "Entrada por la puerta principal, hay vigilancia 24/7"
        },
        patientInfo: {
            name: "Juan Pérez",
            age: 65,
            gender: "M",
            phone: "5555555555",
            bloodType: "O+",
            medicalConditions: ["Hipertensión", "Diabetes"],
            allergies: ["Penicilina"],
            medications: ["Metformina", "Losartán"],
            preferredLanguage: "Español",
            emergencyContact: {
                name: "María Pérez",
                relationship: "Esposa",
                phone: "5555555556"
            }
        },
        description: "Dolor en el pecho y dificultad para respirar",
        createdAt: createMockDate(),
        distance: 1.5,
        serviceDetails: {
            startTime: createMockDate(),
            notes: [],
            stateHistory: [
                {
                    state: 'PENDING',
                    timestamp: createMockDate(),
                    notes: "Solicitud recibida"
                }
            ]
        }
    },
    {
        id: '2',
        type: 'TRAUMA',
        status: 'PENDING',
        priority: 'MEDIUM',
        location: {
            latitude: 19.4326,
            longitude: -99.1332,
            address: "Av. Reforma 567, CDMX",
            reference: "Centro comercial Plaza Central",
            buildingDetails: "Área de comidas, cerca de la fuente",
            accessNotes: "Entrada por el estacionamiento nivel 1"
        },
        patientInfo: {
            name: "María García",
            age: 45,
            gender: "F",
            phone: "5555555556",
            bloodType: "A+",
            medicalConditions: [],
            allergies: [],
            medications: [],
            preferredLanguage: "Español",
            emergencyContact: {
                name: "Carlos García",
                relationship: "Hermano",
                phone: "5555555557"
            }
        },
        description: "Caída desde escalera, posible fractura",
        createdAt: createMockDate(30),
        distance: 2.8,
        serviceDetails: {
            startTime: createMockDate(30),
            notes: [],
            stateHistory: [
                {
                    state: 'PENDING',
                    timestamp: createMockDate(30),
                    notes: "Solicitud recibida"
                }
            ]
        }
    },
    {
        id: '3',
        type: 'RESPIRATORY',
        status: 'PENDING',
        priority: 'HIGH',
        location: {
            latitude: 19.4326,
            longitude: -99.1332,
            address: "Calle Durango 789, CDMX",
            reference: "Casa amarilla de dos pisos",
            buildingDetails: "Planta baja",
            accessNotes: "Timbre en la puerta principal"
        },
        patientInfo: {
            name: "Carlos Ruiz",
            age: 28,
            gender: "M",
            phone: "5555555557",
            bloodType: "B+",
            medicalConditions: ["Asma"],
            allergies: ["Polvo", "Polen"],
            medications: ["Salbutamol"],
            preferredLanguage: "Español",
            emergencyContact: {
                name: "Ana Ruiz",
                relationship: "Madre",
                phone: "5555555558"
            }
        },
        description: "Crisis asmática severa",
        createdAt: createMockDate(20),
        distance: 0.8,
        serviceDetails: {
            startTime: createMockDate(20),
            notes: [],
            stateHistory: [
                {
                    state: 'PENDING',
                    timestamp: createMockDate(20),
                    notes: "Solicitud recibida"
                }
            ]
        }
    }
]; 