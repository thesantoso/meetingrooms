import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Meeting = { waktu_mulai: string; waktu_selesai: string; nama_ruangan: string };

export default function JadwalScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [data, setData] = useState<Meeting[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const res = await fetch('https://uat-api.ftlgym.com/api/v1/test/jadwalruangan');
                const json = await res.json();
                if (mounted) setData(json?.data ?? []);
            } catch (err) {
                if (mounted) setData([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    const [refreshing, setRefreshing] = useState(false);

    async function loadData() {
        try {
            const res = await fetch('https://uat-api.ftlgym.com/api/v1/test/jadwalruangan');
            const json = await res.json();
            setData(json?.data ?? []);
        } catch (err) {
            setData([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    function onRefresh() {
        setRefreshing(true);
        loadData();
    }

    function renderMeetingItem({ item, index }: { item: Meeting; index: number }) {
        return (
            <Card style={styles.meetingCard}>
                <View style={styles.meetingContent}>
                    <View style={styles.timeContainer}>
                        <Text style={[styles.timeText, { color: colors.text }]}>
                            {item.waktu_mulai} - {item.waktu_selesai}
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
                    data={data}
                    keyExtractor={(item, idx) => `${item.nama_ruangan}-${item.waktu_mulai}-${idx}`}
                    renderItem={renderMeetingItem}
                    ListEmptyComponent={renderEmptyState}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
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