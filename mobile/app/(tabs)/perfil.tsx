import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '@/src/contexts/TasksContext';
import {
  configureAndroidNotificationChannel,
  hasNotificationPermission,
  requestNotificationPermission,
  scheduleLocalTestNotification,
} from '@/src/services/notificationsService';
import { reconcileTaskReminders } from '@/src/services/taskRemindersService';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

const profileDetails = [
  { icon: 'school' as const, label: 'Curso', value: 'ADS 4' },
  { icon: 'account-balance' as const, label: 'Instituição', value: 'IFPI' },
  { icon: 'email' as const, label: 'E-mail', value: 'aluno@ifpi.edu.br' },
];

const loginRoute = '/(auth)/login' as Href;

export default function ProfileScreen() {
  const { tasks } = useTasks();
  const [isSchedulingNotification, setIsSchedulingNotification] =
    useState(false);
  const [isReconcilingReminders, setIsReconcilingReminders] = useState(false);
  const notificationOperationInProgress = useRef(false);
  const isNotificationOperationRunning =
    isSchedulingNotification || isReconcilingReminders;

  function handleLogout() {
    router.replace(loginRoute);
  }

  async function handleTestNotification() {
    if (notificationOperationInProgress.current) {
      return;
    }

    notificationOperationInProgress.current = true;
    setIsSchedulingNotification(true);

    try {
      await configureAndroidNotificationChannel();

      let hasPermission = await hasNotificationPermission();

      if (!hasPermission) {
        hasPermission = await requestNotificationPermission();
      }

      if (!hasPermission) {
        Alert.alert(
          'Permissão necessária',
          'As notificações estão desativadas. Autorize o Expo Go nas configurações do Android para realizar o teste.'
        );
        return;
      }

      await scheduleLocalTestNotification();
      Alert.alert(
        'Notificação agendada',
        'Aguarde cerca de 5 segundos para receber a notificação de teste.'
      );
    } catch (error) {
      console.error('Não foi possível agendar a notificação de teste.', error);
      Alert.alert(
        'Não foi possível enviar',
        'O teste de notificação não pôde ser agendado. Tente novamente.'
      );
    } finally {
      notificationOperationInProgress.current = false;
      setIsSchedulingNotification(false);
    }
  }

  async function handleReconcileTaskReminders() {
    if (notificationOperationInProgress.current) {
      return;
    }

    notificationOperationInProgress.current = true;
    setIsReconcilingReminders(true);

    try {
      const summary = await reconcileTaskReminders(tasks, {
        requestPermission: true,
      });
      const summaryMessage = [
        `Mantidos: ${summary.kept}`,
        `Agendados: ${summary.scheduled}`,
        `Cancelados: ${summary.cancelled}`,
        `Ignorados: ${summary.skipped}`,
        `Erros: ${summary.errors.length}`,
      ].join('\n');

      if (summary.permissionStatus === 'denied') {
        Alert.alert(
          'Permissão necessária',
          `As notificações estão desativadas. Nenhum lembrete foi agendado.\n\n${summaryMessage}`
        );
        return;
      }

      if (summary.permissionStatus === 'error') {
        Alert.alert(
          'Não foi possível verificar a permissão',
          `A sincronização não pôde agendar lembretes.\n\n${summaryMessage}`
        );
        return;
      }

      Alert.alert(
        summary.errors.length > 0
          ? 'Sincronização concluída com avisos'
          : 'Lembretes sincronizados',
        summaryMessage
      );
    } catch (error) {
      console.error('Não foi possível sincronizar os lembretes das tarefas.', error);
      Alert.alert(
        'Não foi possível sincronizar',
        'Os lembretes das tarefas não puderam ser sincronizados. Tente novamente.'
      );
    } finally {
      notificationOperationInProgress.current = false;
      setIsReconcilingReminders(false);
    }
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

        <View style={styles.notificationSection}>
          <View style={styles.notificationHeader}>
            <View style={styles.notificationIcon}>
              <MaterialIcons
                color={colors.primaryDark}
                name="notifications-active"
                size={22}
              />
            </View>
            <View style={styles.notificationHeaderText}>
              <Text style={styles.notificationTitle}>
                Teste de notificações
              </Text>
              <Text style={styles.notificationDescription}>
                Valide o recebimento de um lembrete local neste dispositivo.
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              busy: isSchedulingNotification,
              disabled: isNotificationOperationRunning,
            }}
            disabled={isNotificationOperationRunning}
            onPress={handleTestNotification}
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && styles.buttonPressed,
              isNotificationOperationRunning && styles.disabledButton,
            ]}>
            {isSchedulingNotification ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <MaterialIcons
                color={colors.white}
                name="notifications"
                size={20}
              />
            )}
            <Text style={styles.notificationButtonText}>
              {isSchedulingNotification
                ? 'Agendando...'
                : 'Enviar notificação de teste'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.notificationSection}>
          <View style={styles.notificationHeader}>
            <View style={styles.notificationIcon}>
              <MaterialIcons
                color={colors.primaryDark}
                name="event-repeat"
                size={22}
              />
            </View>
            <View style={styles.notificationHeaderText}>
              <Text style={styles.notificationTitle}>
                Lembretes das tarefas
              </Text>
              <Text style={styles.notificationDescription}>
                Sincronize manualmente os lembretes locais das tarefas pendentes.
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              busy: isReconcilingReminders,
              disabled: isNotificationOperationRunning,
            }}
            disabled={isNotificationOperationRunning}
            onPress={handleReconcileTaskReminders}
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && styles.buttonPressed,
              isNotificationOperationRunning && styles.disabledButton,
            ]}>
            {isReconcilingReminders ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <MaterialIcons color={colors.white} name="sync" size={20} />
            )}
            <Text style={styles.notificationButtonText}>
              {isReconcilingReminders
                ? 'Sincronizando...'
                : 'Sincronizar lembretes das tarefas'}
            </Text>
          </Pressable>
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
  notificationSection: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  notificationHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  notificationIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  notificationHeaderText: {
    flex: 1,
  },
  notificationTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  notificationDescription: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  notificationButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: 48,
  },
  notificationButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.65,
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
