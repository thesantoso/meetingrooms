import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Option = {
    label: string;
    value: string;
};

type Props = {
    label?: string;
    value: string;
    options: Option[];
    onSelect: (value: string) => void;
    placeholder?: string;
    error?: string | null;
};

export function Dropdown({ label, value, options, onSelect, placeholder, error }: Props) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(option => option.value === value);

    return (
        <View style={styles.container}>
            {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}

            <TouchableOpacity
                style={[
                    styles.selector,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error ? colors.error : colors.border
                    }
                ]}
                onPress={() => setIsOpen(true)}
            >
                <Text style={[
                    styles.selectorText,
                    { color: selectedOption ? colors.text : colors.secondary }
                ]}>
                    {selectedOption?.label || placeholder || 'Pilih opsi...'}
                </Text>
                <Text style={[styles.arrow, { color: colors.secondary }]}>▼</Text>
            </TouchableOpacity>

            {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={[styles.dropdown, { backgroundColor: colors.cardBackground }]}>
                        <FlatList
                            data={options}
                            keyExtractor={item => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        item.value === value && { backgroundColor: colors.tint + '15' }
                                    ]}
                                    onPress={() => {
                                        onSelect(item.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        { color: item.value === value ? colors.tint : colors.text }
                                    ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
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
    selector: {
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
    },
    selectorText: {
        fontSize: 15,
        flex: 1,
    },
    arrow: {
        fontSize: 12,
        marginLeft: 8,
    },
    error: {
        marginTop: 6,
        fontSize: 12,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    dropdown: {
        borderRadius: 8,
        maxHeight: 200,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    optionText: {
        fontSize: 15,
    },
});