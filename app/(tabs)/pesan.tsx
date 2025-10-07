import { AlertModal } from '@/components/ui/AlertModal';
import { DateTimePickerInput } from '@/components/ui/DateTimePickerInput';
import { Dropdown } from '@/components/ui/Dropdown';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useBooking } from '@/hooks/useBooking';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ROOM_OPTIONS = [
    { label: 'Squats Room', value: 'squats' },
    { label: 'Lungles Room', value: 'lungles' },
];

export default function PesanScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const {
        values,
        errors,
        loading,
        showAlert,
        alertConfig,
        setValue,
        submitBooking,
        closeAlert,
    } = useBooking();

    const handleSubmit = async () => {
        const success = await submitBooking();
        if (success) {
            // Success handling is done in the hook
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardContainer}
            >
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Booking Ruang Meeting
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.secondary }]}>
                            Lengkapi form di bawah untuk membuat booking
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <FormInput
                            label="Divisi"
                            value={values.divisi}
                            onChangeText={(text) => setValue('divisi', text)}
                            placeholder="Masukkan nama divisi"
                            error={errors.divisi}
                        />

                        <Dropdown
                            label="Ruang Meeting"
                            value={values.ruangan}
                            options={ROOM_OPTIONS}
                            onSelect={(value) => setValue('ruangan', value)}
                            placeholder="Pilih ruang meeting"
                            error={errors.ruangan}
                        />

                        <DateTimePickerInput
                            label="Tanggal Meeting"
                            value={values.tanggal}
                            mode="date"
                            onChange={(date) => setValue('tanggal', date)}
                            error={errors.tanggal}
                            minimumDate={new Date()}
                        />

                        <View style={styles.timeRow}>
                            <View style={styles.timeInput}>
                                <DateTimePickerInput
                                    label="Waktu Mulai"
                                    value={values.waktu_mulai}
                                    mode="time"
                                    onChange={(time) => setValue('waktu_mulai', time)}
                                    error={errors.waktu_mulai}
                                />
                            </View>
                            <View style={styles.timeInput}>
                                <DateTimePickerInput
                                    label="Waktu Selesai"
                                    value={values.waktu_selesai}
                                    mode="time"
                                    onChange={(time) => setValue('waktu_selesai', time)}
                                    error={errors.waktu_selesai}
                                />
                            </View>
                        </View>

                        <FormInput
                            label="Jumlah Peserta"
                            value={values.jumlah_peserta.toString()}
                            onChangeText={(text) => setValue('jumlah_peserta', Number(text) || 0)}
                            placeholder="Masukkan jumlah peserta"
                            keyboardType="number-pad"
                            error={errors.jumlah_peserta}
                        />

                        <View style={styles.submitContainer}>
                            <PrimaryButton
                                title={loading ? 'Memproses...' : 'Submit Booking'}
                                onPress={handleSubmit}
                                style={styles.submitButton}
                            />
                        </View>
                    </View>
                </ScrollView>
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
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingTop: 12,
    },
    header: {
        marginBottom: 32,
        paddingTop: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
    },
    form: {
        gap: 16,
    },
    timeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    timeInput: {
        flex: 1,
    },
    submitContainer: {
        marginTop: 8,
    },
    submitButton: {
        width: '100%',
    },
});