import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '@/src/contexts/TasksContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import { formatLongBrazilianDate } from '@/src/utils/date';
import { isTaskOverdue } from '@/src/utils/taskStatus';

const tasksRoute = '/(tabs)/tarefas' as Href;

function formatCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data não disponível';
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { tasks } = useTasks();
  const taskId = Array.isArray(id) ? id[0] : id;
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return <TaskNotFound />;
  }

  const currentTaskId = task.id;
  const taskIsOverdue = isTaskOverdue(task);
  const statusLabel = task.completed
    ? 'Concluída'
    : taskIsOverdue
      ? 'Atrasada'
      : 'Pendente';

  function openEditTask() {
    router.push(`/editar-tarefa/${encodeURIComponent(currentTaskId)}` as Href);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Voltar"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}>
          <MaterialIcons color={colors.primaryDark} name="arrow-back" size={24} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Tarefa acadêmica</Text>
          <Text style={styles.screenTitle}>Detalhes da tarefa</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View
            accessibilityLabel={`Status: ${statusLabel.toLocaleLowerCase('pt-BR')}`}
            accessible
            style={[
              styles.statusBadge,
              task.completed
                ? styles.completedBadge
                : taskIsOverdue
                  ? styles.overdueBadge
                  : styles.pendingBadge,
            ]}>
            <MaterialIcons
              color={
                task.completed
                  ? colors.primaryDark
                  : taskIsOverdue
                    ? colors.danger
                    : colors.text
              }
              name={
                task.completed
                  ? 'check-circle'
                  : taskIsOverdue
                    ? 'error-outline'
                    : 'schedule'
              }
              size={17}
            />
            <Text
              style={[
                styles.statusText,
                task.completed && styles.completedStatusText,
                taskIsOverdue && styles.overdueStatusText,
              ]}>
              {statusLabel}
            </Text>
          </View>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskSubject}>{task.subject}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MaterialIcons color={colors.primaryDark} name="category" size={20} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.fieldLabel}>Tipo</Text>
              <Text style={styles.fieldValue}>{task.type}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MaterialIcons color={colors.primaryDark} name="event" size={20} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.fieldLabel}>Prazo</Text>
              <Text style={styles.fieldValue}>
                {formatLongBrazilianDate(task.deadline)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <MaterialIcons color={colors.primaryDark} name="today" size={20} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.fieldLabel}>Criada em</Text>
              <Text style={styles.fieldValue}>{formatCreatedAt(task.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>
            {task.description.trim() || 'Não há descrição cadastrada.'}
          </Text>
        </View>

        <Pressable
          accessibilityLabel={`Editar tarefa ${task.title}`}
          accessibilityRole="button"
          onPress={openEditTask}
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.buttonPressed,
          ]}>
          <MaterialIcons color={colors.white} name="edit" size={21} />
          <Text style={styles.editButtonText}>Editar tarefa</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function TaskNotFound() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.notFoundContainer}>
        <MaterialIcons color={colors.textMuted} name="search-off" size={48} />
        <Text style={styles.notFoundTitle}>Tarefa não encontrada</Text>
        <Text style={styles.notFoundText}>
          Não foi possível localizar os detalhes da tarefa solicitada.
        </Text>
        <Pressable
          accessibilityLabel="Voltar para a lista de tarefas"
          accessibilityRole="button"
          onPress={() => router.replace(tasksRoute)}
          style={({ pressed }) => [
            styles.notFoundButton,
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.notFoundButtonText}>Voltar para tarefas</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.screen,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  screenTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  content: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.lg,
  },
  statusBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 99,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  pendingBadge: {
    backgroundColor: colors.warningSoft,
  },
  completedBadge: {
    backgroundColor: colors.primarySoft,
  },
  overdueBadge: {
    backgroundColor: colors.dangerSoft,
  },
  statusText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  completedStatusText: {
    color: colors.primaryDark,
  },
  overdueStatusText: {
    color: colors.danger,
  },
  taskTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 31,
    marginTop: spacing.md,
  },
  taskSubject: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.lg,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  infoIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  infoContent: {
    flex: 1,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  fieldValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: spacing.md,
  },
  descriptionCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  descriptionText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 52,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  notFoundContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  notFoundText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  notFoundButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  notFoundButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
