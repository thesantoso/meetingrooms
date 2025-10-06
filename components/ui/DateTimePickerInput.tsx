import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    label?: string;
    value: Date;
    mode: 'date' | 'time';
    onChange: (date: Date) => void;
    placeholder?: string;
    error?: string | null;
    minimumDate?: Date;
};

export function DateTimePickerInput({
    label,
    value,
    mode,
    onChange,
    placeholder,
    error,
    minimumDate
}: Props) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [show, setShow] = useState(false);

    const formatDate = (date: Date) => {
        if (mode === 'date') {
            return date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else {
            return date.toTimeString().slice(0, 5); // HH:MM
        }
    };

    const handleChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            // Android: close picker immediately after selection or cancellation
            setShow(false);
            if (event.type === 'set' && selectedDate) {
                onChange(selectedDate);
            }
        } else {
            // iOS: update the temporary value but keep picker open
            if (selectedDate) {
                onChange(selectedDate);
            }
        }
    };

    const handleIOSConfirm = () => {
        setShow(false);
    };

    const handleIOSCancel = () => {
        setShow(false);
    };

    const showPicker = () => {
        setShow(true);
    };

    return (
        <View style={styles.container}>
            {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}

            <TouchableOpacity
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error ? colors.error : colors.border
                    }
                ]}
                onPress={showPicker}
            >
                <Text style={[styles.inputText, { color: colors.text }]}>
                    {formatDate(value)}
                </Text>
                <Text style={[styles.icon, { color: colors.secondary }]}>
                    {mode === 'date' ? '📅' : '🕐'}
                </Text>
            </TouchableOpacity>

            {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

            {show && Platform.OS === 'ios' && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={show}
                    onRequestClose={() => setShow(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={handleIOSCancel}>
                                    <Text style={[styles.modalButton, { color: colors.secondary }]}>Cancel</Text>
                                </TouchableOpacity>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>
                                    {mode === 'date' ? 'Pilih Tanggal' : 'Pilih Waktu'}
                                </Text>
                                <TouchableOpacity onPress={handleIOSConfirm}>
                                    <Text style={[styles.modalButton, { color: colors.tint }]}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={value}
                                mode={mode}
                                is24Hour={true}
                                display="spinner"
                                onChange={handleChange}
                                minimumDate={minimumDate}
                                style={styles.picker}
                            />
                        </View>
                    </View>
                </Modal>
            )}

            {show && Platform.OS === 'android' && (
                <DateTimePicker
                    value={value}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={handleChange}
                    minimumDate={minimumDate}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputText: {
        fontSize: 15,
        flex: 1,
    },
    icon: {
        fontSize: 16,
        marginLeft: 8,
    },
    error: {
        marginTop: 6,
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 34, // Safe area for iOS
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    modalButton: {
        fontSize: 16,
        fontWeight: '600',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    picker: {
        width: '100%',
        height: 200,
    },
});