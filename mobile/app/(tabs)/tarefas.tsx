import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

type Filter = 'Todas' | 'Pendentes' | 'Concluídas';

type Task = {
  id: string;
  title: string;
  subject: string;
  date: string;
  type: string;
  done: boolean;
};

const filters: Filter[] = ['Todas', 'Pendentes', 'Concluídas'];

const tasks: Task[] = [
  {
    id: '1',
    title: 'Entregar protótipo mobile',
    subject: 'Programação para Dispositivos Móveis',
    date: '30/07/2026',
    type: 'Trabalho',
    done: false,
  },
  {
    id: '2',
    title: 'Revisar requisitos do MVP',
    subject: 'Engenharia de Software',
    date: '02/08/2026',
    type: 'Atividade',
    done: false,
  },
  {
    id: '3',
    title: 'Preparar apresentação do projeto',
    subject: 'Projeto Integrador',
    date: '05/08/2026',
    type: 'Seminário',
    done: false,
  },
  {
    id: '4',
    title: 'Definir identidade visual',
    subject: 'Programação para Dispositivos Móveis',
    date: '25/07/2026',
    type: 'Atividade',
    done: true,
  },
];

const newTaskRoute = '/nova-tarefa' as Href;

export default function TasksScreen() {
  const [activeFilter, setActiveFilter] = useState<Filter>('Todas');

  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === 'Pendentes') {
      return !task.done;
    }

    if (activeFilter === 'Concluídas') {
      return task.done;
    }

    return true;
  });

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
            const isActive = filter === activeFilter;

            return (
              <Pressable
                accessibilityRole="button"
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[styles.filterButton, isActive && styles.activeFilterButton]}>
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.taskList}>
          {visibleTasks.map((task) => (
            <View key={task.id} style={[styles.taskCard, task.done && styles.completedTaskCard]}>
              <View style={[styles.checkBox, task.done && styles.checkedBox]}>
                {task.done ? (
                  <MaterialIcons color={colors.white} name="check" size={16} />
                ) : null}
              </View>
              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, task.done && styles.completedTaskTitle]}>
                  {task.title}
                </Text>
                <Text style={styles.taskSubject}>{task.subject}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.taskType}>{task.type}</Text>
                  <Text style={styles.taskDate}>{task.date}</Text>
                </View>
              </View>
            </View>
          ))}
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
