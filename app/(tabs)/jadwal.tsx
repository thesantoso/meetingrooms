import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMeetings } from '@/hooks/useMeetings';
import { formatters } from '@/utils/formatters';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JadwalScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { meetings, loading, error, refreshMeetings } = useMeetings();

    function renderMeetingItem({ item, index }: { item: any; index: number }) {
        return (
            <Card style={styles.meetingCard}>
                <View style={styles.meetingContent}>
                    <View style={styles.timeContainer}>
                        <Text style={[styles.timeText, { color: colors.text }]}>
                            {formatters.formatTime(item.waktu_mulai)} - {formatters.formatTime(item.waktu_selesai)}
                        </Text>
                        <Text style={[styles.durationText, { color: colors.secondary }]}>
                            Durasi: {formatters.formatDuration(item.waktu_mulai, item.waktu_selesai)}
                        </Text>
                    </View>
                    <View style={styles.roomContainer}>
                        <Text style={[styles.roomText, { color: colors.tint }]}>
                            {item.nama_ruangan}
                        </Text>
                    </View>
                </View>
            </Card>
        );
    }

    function renderEmptyState() {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyIcon, { color: colors.secondary }]}>📅</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    Belum Ada Jadwal
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.secondary }]}>
                    Tidak ada jadwal ruang meeting untuk hari ini
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Jadwal Ruang Meeting
                </Text>
                <Text style={[styles.subtitle, { color: colors.secondary }]}>
                    Daftar semua jadwal meeting hari ini
                </Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.tint} />
                    <Text style={[styles.loadingText, { color: colors.secondary }]}>
                        Memuat jadwal...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={meetings}
                    keyExtractor={(item, idx) => `${item.nama_ruangan}-${item.waktu_mulai}-${idx}`}
                    renderItem={renderMeetingItem}
                    ListEmptyComponent={renderEmptyState}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={refreshMeetings}
                            colors={[colors.tint]}
                            tintColor={colors.tint}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    listContent: {
        padding: 24,
    },
    meetingCard: {
        marginBottom: 12,
    },
    meetingContent: {
        flex: 1,
    },
    timeContainer: {
        marginBottom: 8,
    },
    timeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    durationText: {
        fontSize: 12,
        marginTop: 4,
    },
    roomContainer: {
        flex: 1,
    },
    roomText: {
        fontSize: 18,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});