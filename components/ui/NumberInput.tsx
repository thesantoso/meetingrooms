import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface NumberInputProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    placeholder?: string;
    error?: string;
    minValue?: number;
    maxValue?: number;
    step?: number;
}

export function NumberInput({
    label,
    value,
    onValueChange,
    placeholder = '0',
    error,
    minValue = 1,
    maxValue = 100,
    step = 1,
}: NumberInputProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleIncrement = () => {
        const newValue = value + step;
        if (newValue <= maxValue) {
            onValueChange(newValue);
        }
    };

    const handleDecrement = () => {
        const newValue = value - step;
        if (newValue >= minValue) {
            onValueChange(newValue);
        }
    };

    const handleTextChange = (text: string) => {
        const numValue = parseInt(text) || 0;
        if (numValue >= minValue && numValue <= maxValue) {
            onValueChange(numValue);
        } else if (text === '') {
            onValueChange(0);
        }
    };

    const isDecrementDisabled = value <= minValue;
    const isIncrementDisabled = value >= maxValue;

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>

            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: colors.surface,
                    borderColor: error ? '#FF6B6B' : colors.border
                }
            ]}>
                {/* Decrement Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.decrementButton,
                        {
                            backgroundColor: isDecrementDisabled ? colors.background : colors.tint,
                            opacity: isDecrementDisabled ? 0.5 : 1
                        }
                    ]}
                    onPress={handleDecrement}
                    disabled={isDecrementDisabled}
                >
                    <Text style={[
                        styles.buttonText,
                        { color: isDecrementDisabled ? colors.secondary : '#FFFFFF' }
                    ]}>
                        −
                    </Text>
                </TouchableOpacity>

                {/* Number Input */}
                <TextInput
                    style={[
                        styles.input,
                        {
                            color: colors.text,
                            backgroundColor: colors.background
                        }
                    ]}
                    value={value > 0 ? value.toString() : ''}
                    onChangeText={handleTextChange}
                    placeholder={placeholder}
                    placeholderTextColor={colors.secondary}
                    keyboardType="number-pad"
                    textAlign="center"
                    maxLength={3}
                />

                {/* Increment Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.incrementButton,
                        {
                            backgroundColor: isIncrementDisabled ? colors.background : colors.tint,
                            opacity: isIncrementDisabled ? 0.5 : 1
                        }
                    ]}
                    onPress={handleIncrement}
                    disabled={isIncrementDisabled}
                >
                    <Text style={[
                        styles.buttonText,
                        { color: isIncrementDisabled ? colors.secondary : '#FFFFFF' }
                    ]}>
                        +
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Helper Text */}
            <View style={styles.helperContainer}>
                {error ? (
                    <Text style={[styles.errorText, { color: '#FF6B6B' }]}>
                        {error}
                    </Text>
                ) : (
                    <Text style={[styles.helperText, { color: colors.secondary }]}>
                        Min: {minValue}, Max: {maxValue} peserta
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        height: 52,
    },
    button: {
        width: 48,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    decrementButton: {
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    incrementButton: {
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 24,
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '600',
    },
    helperContainer: {
        marginTop: 4,
        minHeight: 16,
    },
    errorText: {
        fontSize: 14,
        fontWeight: '500',
    },
    helperText: {
        fontSize: 12,
        fontWeight: '400',
    },
});