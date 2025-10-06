import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Meeting = {
  waktu_mulai: string;
  waktu_selesai: string;
  nama_ruangan: string;
};

export default function HomeScreen() {
  const router = useRouter();
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.profileContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
            <Text style={styles.avatarText}>Y</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>Yosi</Text>
            <Text style={[styles.userRole, { color: colors.secondary }]}>Web Developer</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Schedule Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Jadwal Ruang Meeting Hari Ini
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.tint} />
              <Text style={[styles.loadingText, { color: colors.secondary }]}>
                Memuat jadwal...
              </Text>
            </View>
          ) : (
            <>
              {data && data.length > 0 ? (
                data.map((item, idx) => (
                  <Card key={item.nama_ruangan + idx} style={styles.meetingCard}>
                    <View style={styles.meetingInfo}>
                      <Text style={[styles.meetingTime, { color: colors.text }]}>
                        {item.waktu_mulai} - {item.waktu_selesai}
                      </Text>
                      <Text style={[styles.meetingRoom, { color: colors.tint }]}>
                        {item.nama_ruangan}
                      </Text>
                    </View>
                  </Card>
                ))
              ) : (
                <Card style={styles.emptyCard}>
                  <Text style={[styles.emptyText, { color: colors.secondary }]}>
                    Belum ada jadwal meeting hari ini
                  </Text>
                </Card>
              )}
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <View style={styles.actionRow}>
            <View style={styles.actionItem}>
              <Text style={[styles.actionIcon, { color: colors.tint }]}>📝</Text>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Jadwal Ruang Meeting</Text>
            </View>
            <PrimaryButton
              title="Lihat"
              onPress={() => router.push('/jadwal')}
              style={styles.actionButton}
            />
          </View>

          <View style={styles.actionRow}>
            <View style={styles.actionItem}>
              <Text style={[styles.actionIcon, { color: colors.tint }]}>🏢</Text>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Booking Ruang Meeting</Text>
            </View>
            <PrimaryButton
              title="Buat"
              onPress={() => router.push('/pesan')}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  meetingCard: {
    marginBottom: 8,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  meetingRoom: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCard: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionButton: {
    minWidth: 80,
  },
});
