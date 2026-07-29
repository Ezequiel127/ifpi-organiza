import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  type AppStateStatus,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  configureAndroidNotificationChannel,
  getNotificationPermissionStatus,
  type NotificationPermissionStatus,
  requestNotificationPermission,
  scheduleLocalTestNotification,
} from '@/src/services/notificationsService';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

const profileDetails = [
  { icon: 'school' as const, label: 'Curso', value: 'ADS 4' },
  { icon: 'account-balance' as const, label: 'Instituição', value: 'IFPI' },
  { icon: 'email' as const, label: 'E-mail', value: 'aluno@ifpi.edu.br' },
];

const loginRoute = '/(auth)/login' as Href;

type PermissionViewStatus =
  | NotificationPermissionStatus
  | 'checking'
  | 'error';

function getPermissionStatusLabel(status: PermissionViewStatus) {
  if (status === 'granted') {
    return 'Notificações permitidas';
  }

  if (status === 'denied') {
    return 'Notificações bloqueadas';
  }

  if (status === 'undetermined') {
    return 'Permissão ainda não definida';
  }

  if (status === 'error') {
    return 'Não foi possível verificar a permissão';
  }

  return 'Verificando permissão...';
}

export default function ProfileScreen() {
  const [isSchedulingNotification, setIsSchedulingNotification] =
    useState(false);
  const [isOpeningSettings, setIsOpeningSettings] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionViewStatus>('checking');
  const notificationOperationInProgress = useRef(false);
  const isProfileFocused = useRef(false);
  const permissionCheckSequence = useRef(0);
  const currentAppState = useRef<AppStateStatus>(AppState.currentState);
  const isNotificationActionRunning =
    isSchedulingNotification || isOpeningSettings;

  const refreshPermissionStatus = useCallback(async () => {
    const checkSequence = permissionCheckSequence.current + 1;
    permissionCheckSequence.current = checkSequence;

    try {
      const status = await getNotificationPermissionStatus();

      if (
        isProfileFocused.current &&
        permissionCheckSequence.current === checkSequence
      ) {
        setPermissionStatus(status);
      }
    } catch (error) {
      console.error(
        'Não foi possível verificar a permissão de notificações.',
        error
      );

      if (
        isProfileFocused.current &&
        permissionCheckSequence.current === checkSequence
      ) {
        setPermissionStatus('error');
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      isProfileFocused.current = true;
      currentAppState.current = AppState.currentState;
      void refreshPermissionStatus();

      const subscription = AppState.addEventListener(
        'change',
        (nextAppState) => {
          const previousAppState = currentAppState.current;
          currentAppState.current = nextAppState;

          const returnedToActive =
            nextAppState === 'active' &&
            (previousAppState === 'background' ||
              previousAppState === 'inactive');

          if (returnedToActive) {
            void refreshPermissionStatus();
          }
        }
      );

      return () => {
        isProfileFocused.current = false;
        permissionCheckSequence.current += 1;
        subscription.remove();
      };
    }, [refreshPermissionStatus])
  );

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

      let hasPermission =
        (await getNotificationPermissionStatus()) === 'granted';

      if (!hasPermission) {
        hasPermission = await requestNotificationPermission();
      }

      if (!hasPermission) {
        Alert.alert(
          'Notificações não permitidas',
          'Não foi possível autorizar as notificações. Se elas estiverem bloqueadas, abra as configurações do celular.'
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
      await refreshPermissionStatus();
      setIsSchedulingNotification(false);
    }
  }

  async function handleOpenSettings() {
    if (notificationOperationInProgress.current) {
      return;
    }

    notificationOperationInProgress.current = true;
    setIsOpeningSettings(true);

    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Não foi possível abrir as configurações do celular.', error);
      Alert.alert(
        'Não foi possível abrir as configurações',
        'Abra manualmente as configurações do aplicativo no Android e verifique a permissão de notificações.'
      );
    } finally {
      notificationOperationInProgress.current = false;
      setIsOpeningSettings(false);
    }
  }

  const permissionStatusLabel = getPermissionStatusLabel(permissionStatus);
  const permissionStatusColor =
    permissionStatus === 'granted'
      ? colors.primaryDark
      : permissionStatus === 'denied' || permissionStatus === 'error'
        ? colors.danger
        : colors.text;

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
                Configurações de lembretes
              </Text>
              <Text style={styles.notificationDescription}>
                Tarefas pendentes podem gerar um lembrete às 18:00 no dia
                anterior e outro às 08:00 no dia do prazo. Se o horário já
                tiver passado, o lembrete não será enviado.
              </Text>
            </View>
          </View>

          <View
            accessible
            accessibilityLabel={permissionStatusLabel}
            accessibilityLiveRegion="polite"
            style={[
              styles.permissionStatus,
              permissionStatus === 'granted' &&
                styles.permissionStatusGranted,
              permissionStatus === 'denied' &&
                styles.permissionStatusDenied,
              permissionStatus === 'undetermined' &&
                styles.permissionStatusUndetermined,
              permissionStatus === 'error' && styles.permissionStatusDenied,
            ]}>
            {permissionStatus === 'checking' ? (
              <ActivityIndicator color={colors.textMuted} size="small" />
            ) : (
              <MaterialIcons
                color={permissionStatusColor}
                name={
                  permissionStatus === 'granted'
                    ? 'check-circle'
                    : permissionStatus === 'denied'
                      ? 'notifications-off'
                      : permissionStatus === 'undetermined'
                        ? 'help-outline'
                        : 'error-outline'
                }
                size={20}
              />
            )}
            <Text
              style={[
                styles.permissionStatusText,
                { color: permissionStatusColor },
              ]}>
              {permissionStatusLabel}
            </Text>
          </View>

          <Pressable
            accessibilityLabel="Testar notificação local"
            accessibilityRole="button"
            accessibilityState={{
              busy: isSchedulingNotification,
              disabled: isNotificationActionRunning,
            }}
            disabled={isNotificationActionRunning}
            onPress={handleTestNotification}
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && styles.buttonPressed,
              isNotificationActionRunning && styles.disabledButton,
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
                ? 'Preparando teste...'
                : 'Testar notificação'}
            </Text>
          </Pressable>

          {permissionStatus === 'denied' ? (
            <Pressable
              accessibilityLabel="Abrir configurações de notificações do celular"
              accessibilityRole="button"
              accessibilityState={{
                busy: isOpeningSettings,
                disabled: isNotificationActionRunning,
              }}
              disabled={isNotificationActionRunning}
              onPress={handleOpenSettings}
              style={({ pressed }) => [
                styles.settingsButton,
                pressed && styles.buttonPressed,
                isNotificationActionRunning && styles.disabledButton,
              ]}>
              {isOpeningSettings ? (
                <ActivityIndicator color={colors.primaryDark} size="small" />
              ) : (
                <MaterialIcons
                  color={colors.primaryDark}
                  name="settings"
                  size={20}
                />
              )}
              <Text style={styles.settingsButtonText}>
                {isOpeningSettings
                  ? 'Abrindo configurações...'
                  : 'Abrir configurações do celular'}
              </Text>
            </Pressable>
          ) : null}
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
  permissionStatus: {
    alignItems: 'center',
    backgroundColor: colors.screen,
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  permissionStatusGranted: {
    backgroundColor: colors.primarySoft,
  },
  permissionStatusDenied: {
    backgroundColor: colors.dangerSoft,
  },
  permissionStatusUndetermined: {
    backgroundColor: colors.warningSoft,
  },
  permissionStatusText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
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
  settingsButton: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  settingsButtonText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
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
