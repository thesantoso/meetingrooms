import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & {
    label?: string;
    error?: string | null;
};

export function FormInput({ label, error, style, ...props }: Props) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={styles.container}>
            {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}
            <TextInput
                placeholderTextColor={colors.secondary}
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface,
                        color: colors.text,
                        borderColor: error ? colors.error : colors.border
                    },
                    style
                ]}
                {...props}
            />
            {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
        </View>
    );
} const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 12,
    },
    label: {
        marginBottom: 6,
        fontSize: 13,
        fontWeight: '500',
    },
    input: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 14,
        fontSize: 15,
        borderWidth: 1,
    },
    error: {
        marginTop: 6,
        fontSize: 12,
    },
});
