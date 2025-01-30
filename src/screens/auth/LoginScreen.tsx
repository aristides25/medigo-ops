import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Button, Input, Text, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';

const TEST_CREDENTIALS = [
    { email: 'juan.perez@medigo.com', password: '123456' },
    { email: 'maria.rodriguez@medigo.com', password: '123456' }
];

export const LoginScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { login, error: authError, isLoading } = useAuth();
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async () => {
        if (!credentials.email || !credentials.password) {
            Alert.alert('Error', 'Por favor ingresa tu email y contraseña');
            return;
        }

        try {
            await login(credentials);
            navigation.replace('ParamedicHome');
        } catch (err) {
            // El error ya está manejado en el contexto
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.headerContainer}>
                    <Text h2 style={styles.title}>
                        MediGo Ops
                    </Text>
                    <Text h4 style={styles.subtitle}>
                        Portal de Paramédicos
                    </Text>
                    <Text style={styles.description}>
                        Acceso exclusivo para personal autorizado
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Input
                        placeholder="Correo electrónico institucional"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={credentials.email}
                        onChangeText={(text) => setCredentials(prev => ({ ...prev, email: text }))}
                        leftIcon={{ type: 'material', name: 'email', color: theme.colors.grey3 }}
                        containerStyle={styles.inputContainer}
                        disabled={isLoading}
                    />

                    <Input
                        placeholder="Contraseña"
                        secureTextEntry
                        value={credentials.password}
                        onChangeText={(text) => setCredentials(prev => ({ ...prev, password: text }))}
                        leftIcon={{ type: 'material', name: 'lock', color: theme.colors.grey3 }}
                        containerStyle={styles.inputContainer}
                        disabled={isLoading}
                    />

                    {authError ? (
                        <Text style={[styles.errorText, { color: theme.colors.error }]}>
                            {authError}
                        </Text>
                    ) : null}

                    <Button
                        title="Iniciar Sesión"
                        onPress={handleLogin}
                        loading={isLoading}
                        containerStyle={styles.buttonContainer}
                        disabled={isLoading}
                    />

                    <Button
                        title="¿Olvidaste tu contraseña?"
                        type="clear"
                        titleStyle={{ color: theme.colors.grey2 }}
                        disabled={isLoading}
                    />

                    <Text style={styles.helpText}>
                        Para obtener acceso, contacta a tu supervisor o al equipo de soporte de MediGo
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        marginBottom: 10,
        color: '#2563EB', // Color primario
    },
    subtitle: {
        color: '#64748B', // Color gris
        marginBottom: 10,
    },
    description: {
        color: '#64748B',
        textAlign: 'center',
        marginHorizontal: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    inputContainer: {
        paddingHorizontal: 0,
        marginBottom: 10,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    errorText: {
        textAlign: 'center',
        marginBottom: 10,
    },
    helpText: {
        textAlign: 'center',
        color: '#64748B',
        fontSize: 12,
        marginTop: 20,
    },
}); 