import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';

import { TasksProvider } from '@/src/contexts/TasksContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <TasksProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="nova-tarefa" />
        <Stack.Screen name="editar-tarefa/[id]" />
      </Stack>
      <StatusBar style="dark" />
    </TasksProvider>
  );
}
