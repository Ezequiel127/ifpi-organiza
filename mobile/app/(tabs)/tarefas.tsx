import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '@/src/contexts/TasksContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { formatBrazilianDate } from '@/src/utils/date';

type Filter = 'all' | 'pending' | 'completed';

const filters: { label: string; value: Filter }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Concluídas', value: 'completed' },
];

const newTaskRoute = '/nova-tarefa' as Href;

export default function TasksScreen() {
  const { tasks, toggleTask } = useTasks();
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (activeFilter === 'pending') {
          return !task.completed;
        }

        if (activeFilter === 'completed') {
          return task.completed;
        }

        return true;
      }),
    [activeFilter, tasks]
  );

  function openNewTask() {
    router.push(newTaskRoute);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>Minhas tarefas</Text>
            <Text style={styles.title}>Atividades acadêmicas</Text>
          </View>
          <Pressable
            accessibilityLabel="Criar nova tarefa"
            accessibilityRole="button"
            onPress={openNewTask}
            style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}>
            <MaterialIcons color={colors.white} name="add" size={26} />
          </Pressable>
        </View>

        <View style={styles.filters}>
          {filters.map((filter) => {
            const isActive = filter.value === activeFilter;

            return (
              <Pressable
                accessibilityRole="button"
                key={filter.value}
                onPress={() => setActiveFilter(filter.value)}
                style={[styles.filterButton, isActive && styles.activeFilterButton]}>
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.taskList}>
          {visibleTasks.map((task) => (
            <View
              key={task.id}
              style={[styles.taskCard, task.completed && styles.completedTaskCard]}>
              <Pressable
                accessibilityLabel={`Marcar ${task.title} como ${
                  task.completed ? 'pendente' : 'concluída'
                }`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.completed }}
                hitSlop={8}
                onPress={() => toggleTask(task.id)}
                style={[styles.checkBox, task.completed && styles.checkedBox]}>
                {task.completed ? (
                  <MaterialIcons color={colors.white} name="check" size={16} />
                ) : null}
              </Pressable>
              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>
                  {task.title}
                </Text>
                <Text style={styles.taskSubject}>{task.subject}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.taskType}>{task.type}</Text>
                  <Text style={styles.taskDate}>{formatBrazilianDate(task.deadline)}</Text>
                </View>
              </View>
            </View>
          ))}

          {visibleTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhuma tarefa neste filtro.</Text>
            </View>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={openNewTask}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}>
          <MaterialIcons color={colors.white} name="add-task" size={22} />
          <Text style={styles.primaryButtonText}>Criar nova tarefa</Text>
        </Pressable>
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    paddingRight: spacing.md,
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
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: spacing.sm,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  activeFilterText: {
    color: colors.white,
  },
  taskList: {
    gap: spacing.md,
  },
  taskCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  completedTaskCard: {
    opacity: 0.72,
  },
  checkBox: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderRadius: 6,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginTop: 2,
    width: 24,
  },
  checkedBox: {
    backgroundColor: colors.primary,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  completedTaskTitle: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  taskSubject: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  taskType: {
    backgroundColor: colors.primarySoft,
    borderRadius: 99,
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  taskDate: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: spacing.lg,
  },
  emptyStateText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 52,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
