import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { TasksProvider } from '@/src/contexts/TasksContext';

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
