import { AlertModal } from '@/components/ui/AlertModal';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { postJson } from '@/utils/api';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [email, setEmail] = useState('yosi@gmail.com');
    const [password, setPassword] = useState('password');
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'success' as any });

    const [errors, setErrors] = useState({ email: '', password: '' });

    function validateForm() {
        const newErrors = { email: '', password: '' };

        if (!email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Format email tidak valid';
        }

        if (!password.trim()) {
            newErrors.password = 'Password wajib diisi';
        } else if (password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
        }

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
    }

    async function handleSubmit() {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const json = await postJson('https://uat-api.ftlgym.com/api/v1/test/login', {
                email,
                password,
            });

            if (json?.status === 'success') {
                setAlertConfig({
                    title: 'Login Berhasil',
                    message: 'Selamat datang! Anda akan diarahkan ke halaman utama.',
                    type: 'success'
                });
                setShowAlert(true);

                setTimeout(() => {
                    setShowAlert(false);
                    router.replace('/(tabs)');
                }, 2000);
            } else {
                setAlertConfig({
                    title: 'Login Gagal',
                    message: json?.message || 'Email atau password salah',
                    type: 'error'
                });
                setShowAlert(true);
            }
        } catch (err: any) {
            setAlertConfig({
                title: 'Error',
                message: err.message || 'Terjadi kesalahan jaringan',
                type: 'error'
            });
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    }

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
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            placeholder="Masukkan email Anda"
                            error={errors.email}
                        />
                        <FormInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
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
                onClose={() => setShowAlert(false)}
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
