import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '@/src/contexts/TasksContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { formatBrazilianDate, formatLongBrazilianDate } from '@/src/utils/date';
import { isTaskOverdue } from '@/src/utils/taskStatus';

const newTaskRoute = '/nova-tarefa' as Href;

export default function DashboardScreen() {
  const { tasks, pendingCount, completedCount, nextDeadline, toggleTask } = useTasks();
  const today = new Date();
  const overdueCount = tasks.reduce(
    (count, task) => count + (isTaskOverdue(task, today) ? 1 : 0),
    0
  );

  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3),
    [tasks]
  );

  function openNewTask() {
    router.push(newTaskRoute);
  }

  function openTaskDetails(id: string) {
    router.push(`/detalhes-tarefa/${encodeURIComponent(id)}` as Href);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Bom dia, Ezequiel</Text>
            <Text style={styles.title}>Resumo acadêmico</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>EV</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>Pendentes</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{completedCount}</Text>
            <Text style={styles.summaryLabel}>Concluídas</Text>
          </View>
          <View
            accessibilityLabel={`${overdueCount} ${
              overdueCount === 1 ? 'tarefa atrasada' : 'tarefas atrasadas'
            }`}
            accessible
            style={[styles.summaryCard, styles.overdueSummaryCard]}>
            <Text style={[styles.summaryNumber, styles.overdueSummaryNumber]}>
              {overdueCount}
            </Text>
            <Text style={styles.summaryLabel}>Atrasadas</Text>
          </View>
        </View>

        <View style={styles.deadlineCard}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Próximo prazo</Text>
          </View>
          <Text style={styles.deadlineTitle}>
            {nextDeadline?.title ?? 'Nenhuma tarefa pendente'}
          </Text>
          <View style={styles.deadlineMeta}>
            <MaterialIcons color={colors.primaryDark} name="event" size={18} />
            <Text style={styles.deadlineText}>
              {nextDeadline
                ? `${formatLongBrazilianDate(nextDeadline.deadline)} • ${nextDeadline.subject}`
                : 'Todas as atividades cadastradas foram concluídas.'}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={openNewTask}
          style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}>
          <MaterialIcons color={colors.white} name="add" size={22} />
          <Text style={styles.addButtonText}>Nova tarefa</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Atividades recentes</Text>
          <Text style={styles.sectionCaption}>Últimas atualizações</Text>
        </View>

        <View style={styles.taskList}>
          {recentTasks.map((task) => (
            <View key={task.id} style={[styles.taskCard, task.completed && styles.completedTask]}>
              <Pressable
                accessibilityLabel={`Marcar ${task.title} como ${
                  task.completed ? 'pendente' : 'concluída'
                }`}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: task.completed }}
                hitSlop={8}
                onPress={() => toggleTask(task.id)}
                style={[styles.taskStatus, task.completed && styles.completedTaskStatus]}>
                {task.completed ? (
                  <MaterialIcons color={colors.white} name="check" size={16} />
                ) : null}
              </Pressable>
              <Pressable
                accessibilityLabel={`Ver detalhes da tarefa ${task.title}`}
                accessibilityRole="button"
                onPress={() => openTaskDetails(task.id)}
                style={({ pressed }) => [
                  styles.taskContent,
                  pressed && styles.taskContentPressed,
                ]}>
                <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>
                  {task.title}
                </Text>
                <Text style={styles.taskMeta}>
                  {task.subject} • {formatBrazilianDate(task.deadline)}
                </Text>
              </Pressable>
            </View>
          ))}

          {recentTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhuma atividade cadastrada.</Text>
            </View>
          ) : null}
        </View>
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
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  overdueSummaryCard: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  summaryNumber: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: '800',
  },
  overdueSummaryNumber: {
    color: colors.danger,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  deadlineCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderLeftColor: colors.primary,
    borderLeftWidth: 5,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: 99,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tagText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  deadlineTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  deadlineMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  deadlineText: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 52,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionCaption: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  taskList: {
    gap: spacing.sm,
  },
  taskCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  completedTask: {
    opacity: 0.72,
  },
  taskStatus: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderRadius: 6,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  completedTaskStatus: {
    backgroundColor: colors.primary,
  },
  taskContent: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  taskContentPressed: {
    opacity: 0.7,
  },
  taskTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  completedTaskTitle: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.xs,
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
});
