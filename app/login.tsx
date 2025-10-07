import { AlertModal } from '@/components/ui/AlertModal';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { LoginCredentials } from '@/types';
import { loginValidationRules } from '@/utils/validation';
import { Stack } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const initialValues: LoginCredentials = {
    email: 'yosi@gmail.com',
    password: 'password',
};

export default function LoginScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { login, loading, showAlert, alertConfig, closeAlert } = useAuth();
    const { values, errors, validate, setValue } = useForm(initialValues, loginValidationRules);

    const handleSubmit = async () => {
        if (validate()) {
            await login(values);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardContainer}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>Ruangan Meeting</Text>
                        <Text style={[styles.subtitle, { color: colors.tint }]}>Sign In</Text>
                    </View>

                    <View style={styles.form}>
                        <FormInput
                            label="Email"
                            value={values.email}
                            onChangeText={(text) => setValue('email', text)}
                            keyboardType="email-address"
                            placeholder="Masukkan email Anda"
                            error={errors.email}
                        />
                        <FormInput
                            label="Password"
                            value={values.password}
                            onChangeText={(text) => setValue('password', text)}
                            secureTextEntry
                            placeholder="Masukkan password Anda"
                            error={errors.password}
                        />

                        <View style={styles.buttonContainer}>
                            <PrimaryButton
                                title={loading ? 'Signing In...' : 'Sign In'}
                                onPress={handleSubmit}
                                style={styles.submitButton}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <AlertModal
                visible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={closeAlert}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    keyboardContainer: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    form: {
        gap: 16,
    },
    buttonContainer: {
        marginTop: 8,
    },
    submitButton: {
        width: '100%',
    },
});
