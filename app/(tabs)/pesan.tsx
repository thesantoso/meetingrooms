import { AlertModal } from '@/components/ui/AlertModal';
import { DateTimePickerInput } from '@/components/ui/DateTimePickerInput';
import { Dropdown } from '@/components/ui/Dropdown';
import { FormInput } from '@/components/ui/FormInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ROOM_OPTIONS = [
    { label: 'Squats Room', value: 'squats' },
    { label: 'Lungles Room', value: 'lungles' },
];

export default function PesanScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [formData, setFormData] = useState({
        divisi: '',
        ruang: '',
        jumlah: '',
    });

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(() => {
        const defaultEnd = new Date();
        defaultEnd.setHours(defaultEnd.getHours() + 1);
        return defaultEnd;
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    function validateDateInput(date: Date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);

        return inputDate >= today;
    }

    function validateTimeRange(start: Date, end: Date) {
        return end.getTime() > start.getTime();
    }

    function validateForm() {
        const newErrors: Record<string, string> = {};

        if (!formData.divisi.trim()) {
            newErrors.divisi = 'Divisi wajib diisi';
        }

        if (!formData.ruang) {
            newErrors.ruang = 'Ruang meeting wajib dipilih';
        }

        // Validate selected date
        if (!validateDateInput(selectedDate)) {
            newErrors.tanggal = 'Tanggal meeting tidak boleh di masa lalu';
        }

        // Validate time range
        if (!validateTimeRange(startTime, endTime)) {
            newErrors.waktu = 'Waktu selesai harus setelah waktu mulai';
        }

        if (!formData.jumlah.trim()) {
            newErrors.jumlah = 'Jumlah peserta wajib diisi';
        } else if (isNaN(Number(formData.jumlah)) || Number(formData.jumlah) < 1) {
            newErrors.jumlah = 'Jumlah peserta harus berupa angka minimal 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit() {
        if (!validateForm()) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setShowAlert(true);
        }, 1500);
    }

    function handleAlertClose() {
        setShowAlert(false);
        // Reset form and navigate back to home
        setFormData({
            divisi: '',
            ruang: '',
            jumlah: '',
        });
        setSelectedDate(new Date());
        setStartTime(new Date());
        setEndTime(() => {
            const defaultEnd = new Date();
            defaultEnd.setHours(defaultEnd.getHours() + 1);
            return defaultEnd;
        });
        setErrors({});
        router.replace('/(tabs)');
    }

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
                            value={formData.divisi}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, divisi: text }))}
                            placeholder="Masukkan nama divisi"
                            error={errors.divisi}
                        />

                        <Dropdown
                            label="Ruang Meeting"
                            value={formData.ruang}
                            options={ROOM_OPTIONS}
                            onSelect={(value) => setFormData(prev => ({ ...prev, ruang: value }))}
                            placeholder="Pilih ruang meeting"
                            error={errors.ruang}
                        />

                        <DateTimePickerInput
                            label="Tanggal Meeting"
                            value={selectedDate}
                            mode="date"
                            onChange={setSelectedDate}
                            error={errors.tanggal}
                            minimumDate={new Date()}
                        />

                        <View style={styles.timeRow}>
                            <View style={styles.timeInput}>
                                <DateTimePickerInput
                                    label="Waktu Mulai"
                                    value={startTime}
                                    mode="time"
                                    onChange={setStartTime}
                                    error={errors.waktu}
                                />
                            </View>
                            <View style={styles.timeInput}>
                                <DateTimePickerInput
                                    label="Waktu Selesai"
                                    value={endTime}
                                    mode="time"
                                    onChange={setEndTime}
                                />
                            </View>
                        </View>

                        <FormInput
                            label="Jumlah Peserta"
                            value={formData.jumlah}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, jumlah: text }))}
                            placeholder="Masukkan jumlah peserta"
                            keyboardType="number-pad"
                            error={errors.jumlah}
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
                title="Booking Berhasil!"
                message="Ruang meeting berhasil dibooking. Anda akan kembali ke halaman utama."
                type="success"
                onClose={handleAlertClose}
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