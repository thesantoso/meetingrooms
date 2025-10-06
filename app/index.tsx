import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>Selamat Datang</Text>
                    <Text style={[styles.subtitle, { color: colors.secondary }]}>Di Aplikasi</Text>
                    <Text style={[styles.appName, { color: colors.tint }]}>Ruang Meeting</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Link href="/login" asChild>
                    <PrimaryButton title="Next" style={styles.button} />
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textContainer: {
        width: '100%',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '400',
        marginBottom: 4,
    },
    appName: {
        fontSize: 24,
        fontWeight: '600',
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    button: {
        width: 200,
    },
});