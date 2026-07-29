import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const ACADEMIC_REMINDERS_CHANNEL_ID = 'academic-reminders';
const TEST_NOTIFICATION_DELAY_SECONDS = 5;

export async function configureAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(
    ACADEMIC_REMINDERS_CHANNEL_ID,
    {
      name: 'Lembretes acadêmicos',
      description: 'Lembretes locais de atividades acadêmicas.',
      importance: Notifications.AndroidImportance.HIGH,
      lightColor: '#2E7D32',
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    }
  );
}

export async function hasNotificationPermission(): Promise<boolean> {
  const permissions = await Notifications.getPermissionsAsync();
  return permissions.granted;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const permissions = await Notifications.requestPermissionsAsync();
  return permissions.granted;
}

export async function scheduleLocalTestNotification(): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'IFPI Organiza',
      body: 'Teste concluído: seus lembretes acadêmicos estão funcionando.',
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      channelId:
        Platform.OS === 'android'
          ? ACADEMIC_REMINDERS_CHANNEL_ID
          : undefined,
      seconds: TEST_NOTIFICATION_DELAY_SECONDS,
    },
  });
}
