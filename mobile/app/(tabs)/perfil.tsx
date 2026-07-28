import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

const profileDetails = [
  { icon: 'school' as const, label: 'Curso', value: 'ADS 4' },
  { icon: 'account-balance' as const, label: 'Instituição', value: 'IFPI' },
  { icon: 'email' as const, label: 'E-mail', value: 'aluno@ifpi.edu.br' },
];

const loginRoute = '/(auth)/login' as Href;

export default function ProfileScreen() {
  function handleLogout() {
    router.replace(loginRoute);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Perfil</Text>
          <Text style={styles.title}>Dados do aluno</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>EV</Text>
          </View>
          <Text style={styles.name}>Ezequiel Victor</Text>
          <Text style={styles.role}>Estudante de Análise e Desenvolvimento de Sistemas</Text>

          <View style={styles.details}>
            {profileDetails.map((detail) => (
              <View key={detail.label} style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <MaterialIcons color={colors.primaryDark} name={detail.icon} size={22} />
                </View>
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.buttonPressed]}>
          <MaterialIcons color={colors.primaryDark} name="logout" size={21} />
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>

        <Text style={styles.versionText}>IFPI Organiza • Protótipo acadêmico</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.lg,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 36,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  avatarText: {
    color: colors.white,
    fontSize: 23,
    fontWeight: '800',
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  role: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
    maxWidth: 280,
    textAlign: 'center',
  },
  details: {
    alignSelf: 'stretch',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  detailValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 52,
  },
  logoutText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  versionText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
