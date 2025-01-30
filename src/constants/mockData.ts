import { EmergencyRequest, Location } from '../types/emergency';

// Ubicación base (Ciudad de México)
export const INITIAL_LOCATION: Location = {
    latitude: 19.4326,
    longitude: -99.1332,
    address: "Ciudad de México, CDMX"
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
            address: "Av. Insurgentes Sur 1234, CDMX"
        },
        patientInfo: {
            name: "Juan Pérez",
            age: 65,
            gender: "M",
            phone: "5555555555"
        },
        description: "Dolor en el pecho y dificultad para respirar",
        createdAt: new Date(),
        distance: 1.5
    },
    {
        id: '2',
        type: 'TRAUMA',
        status: 'PENDING',
        priority: 'MEDIUM',
        location: {
            latitude: 19.4326,
            longitude: -99.1332,
            address: "Av. Reforma 567, CDMX"
        },
        patientInfo: {
            name: "María García",
            age: 45,
            gender: "F",
            phone: "5555555556"
        },
        description: "Caída desde escalera, posible fractura",
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutos atrás
        distance: 2.8
    },
    {
        id: '3',
        type: 'RESPIRATORY',
        status: 'PENDING',
        priority: 'HIGH',
        location: {
            latitude: 19.4326,
            longitude: -99.1332,
            address: "Calle Durango 789, CDMX"
        },
        patientInfo: {
            name: "Carlos Ruiz",
            age: 28,
            gender: "M",
            phone: "5555555557"
        },
        description: "Crisis asmática severa",
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
        distance: 0.8
    }
]; 