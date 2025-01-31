import { EmergencyRequest, SerializedEmergencyRequest } from './emergency';

export type ParamedicStackParamList = {
    ParamedicHome: undefined;
    EmergencyDetails: {
        request: SerializedEmergencyRequest;
    };
    ActiveEmergency: {
        request: SerializedEmergencyRequest;
    };
    EmergencyCompletion: {
        request: SerializedEmergencyRequest;
    };
}; 