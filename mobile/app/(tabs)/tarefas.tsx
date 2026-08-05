import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '@/src/contexts/TasksContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import type { Task } from '@/src/types/task';
import { formatBrazilianDate, isValidISODate } from '@/src/utils/date';

type Filter = 'all' | 'pending' | 'completed';
type SortOption = 'deadlineAsc' | 'deadlineDesc' | 'recent';

const filters: { label: string; value: Filter }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Concluídas', value: 'completed' },
];

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Prazo mais próximo', value: 'deadlineAsc' },
  { label: 'Prazo mais distante', value: 'deadlineDesc' },
  { label: 'Mais recentes', value: 'recent' },
];

const DIACRITICS_PATTERN = /[\u0300-\u036f]/g;
const newTaskRoute = '/nova-tarefa' as Href;

function normalizeSearchValue(value: string) {
  return value
    .trim()
    .normalize('NFD')
    .replace(DIACRITICS_PATTERN, '')
    .toLocaleLowerCase('pt-BR');
}

function compareCreatedAtDescending(first: Task, second: Task) {
  const firstTimestamp = Date.parse(first.createdAt);
  const secondTimestamp = Date.parse(second.createdAt);
  const firstIsValid = Number.isFinite(firstTimestamp);
  const secondIsValid = Number.isFinite(secondTimestamp);

  if (firstIsValid && secondIsValid) {
    return secondTimestamp - firstTimestamp;
  }

  if (firstIsValid) {
    return -1;
  }

  if (secondIsValid) {
    return 1;
  }

  return 0;
}

function compareDeadlines(
  first: Task,
  second: Task,
  direction: 'ascending' | 'descending'
) {
  const firstIsValid = isValidISODate(first.deadline);
  const secondIsValid = isValidISODate(second.deadline);

  if (firstIsValid && secondIsValid) {
    const comparison = first.deadline.localeCompare(second.deadline);
    return direction === 'ascending' ? comparison : -comparison;
  }

  if (firstIsValid) {
    return -1;
  }

  if (secondIsValid) {
    return 1;
  }

  return 0;
}

function compareTasks(first: Task, second: Task, sortOption: SortOption) {
  let comparison = 0;

  if (sortOption === 'deadlineAsc') {
    comparison = compareDeadlines(first, second, 'ascending');
  } else if (sortOption === 'deadlineDesc') {
    comparison = compareDeadlines(first, second, 'descending');
  } else {
    comparison = compareCreatedAtDescending(first, second);
  }

  if (comparison !== 0) {
    return comparison;
  }

  const recentComparison = compareCreatedAtDescending(first, second);

  if (recentComparison !== 0) {
    return recentComparison;
  }

  return first.id.localeCompare(second.id);
}

export default function TasksScreen() {
  const { deleteTask, tasks, toggleTask } = useTasks();
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('deadlineAsc');
  const [deletingTaskIds, setDeletingTaskIds] = useState<Set<string>>(
    () => new Set()
  );
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);

  const visibleTasks = useMemo(() => {
    const filteredByStatus = tasks.filter((task) => {
      if (activeFilter === 'pending') {
        return !task.completed;
      }

      if (activeFilter === 'completed') {
        return task.completed;
      }

      return true;
    });
    const filteredBySearch = normalizedSearchQuery
      ? filteredByStatus.filter((task) => {
          const searchableContent = normalizeSearchValue(
            `${task.title} ${task.subject}`
          );

          return searchableContent.includes(normalizedSearchQuery);
        })
      : filteredByStatus;

    return [...filteredBySearch].sort((first, second) =>
      compareTasks(first, second, sortOption)
    );
  }, [activeFilter, normalizedSearchQuery, sortOption, tasks]);

  function openNewTask() {
    router.push(newTaskRoute);
  }

  function openEditTask(id: string) {
    router.push(`/editar-tarefa/${encodeURIComponent(id)}` as Href);
  }

  function openTaskDetails(id: string) {
    router.push(`/detalhes-tarefa/${encodeURIComponent(id)}` as Href);
  }

  async function handleDelete(task: Pick<Task, 'id' | 'title'>) {
    setDeletingTaskIds((currentIds) => new Set(currentIds).add(task.id));
    const wasDeleted = await deleteTask(task.id);
    setDeletingTaskIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(task.id);
      return nextIds;
    });

    if (!wasDeleted) {
      Alert.alert(
        'Não foi possível excluir',
        `A tarefa "${task.title}" não pôde ser excluída. Tente novamente.`
      );
    }
  }

  function confirmDelete(task: Pick<Task, 'id' | 'title'>) {
    if (deletingTaskIds.has(task.id)) {
      return;
    }

    Alert.alert(
      'Excluir tarefa',
      `Deseja excluir permanentemente a tarefa "${task.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            void handleDelete(task);
          },
        },
      ]
    );
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

        <View style={styles.searchContainer}>
          <MaterialIcons color={colors.textMuted} name="search" size={21} />
          <TextInput
            accessibilityLabel="Pesquisar tarefas por título ou disciplina"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setSearchQuery}
            placeholder="Pesquisar por título ou disciplina"
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            style={styles.searchInput}
            value={searchQuery}
          />
          {searchQuery.length > 0 ? (
            <Pressable
              accessibilityLabel="Limpar pesquisa"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => setSearchQuery('')}
              style={({ pressed }) => [
                styles.clearSearchButton,
                pressed && styles.buttonPressed,
              ]}>
              <MaterialIcons color={colors.textMuted} name="close" size={19} />
            </Pressable>
          ) : null}
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

        <View style={styles.sortSection}>
          <Text style={styles.sortLabel}>Ordenar por</Text>
          <View style={styles.sortOptions}>
            {sortOptions.map((option) => {
              const isActive = option.value === sortOption;

              return (
                <Pressable
                  accessibilityLabel={`Ordenar por ${option.label.toLocaleLowerCase(
                    'pt-BR'
                  )}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  key={option.value}
                  onPress={() => setSortOption(option.value)}
                  style={[
                    styles.sortButton,
                    isActive && styles.activeSortButton,
                  ]}>
                  <Text
                    style={[
                      styles.sortButtonText,
                      isActive && styles.activeSortButtonText,
                    ]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.taskList}>
          {visibleTasks.map((task) => {
            const isDeleting = deletingTaskIds.has(task.id);

            return (
              <View
                key={task.id}
                style={[styles.taskCard, task.completed && styles.completedTaskCard]}>
                <Pressable
                  accessibilityLabel={`Marcar ${task.title} como ${
                    task.completed ? 'pendente' : 'concluída'
                  }`}
                  accessibilityRole="checkbox"
                  accessibilityState={{
                    checked: task.completed,
                    disabled: isDeleting,
                  }}
                  disabled={isDeleting}
                  hitSlop={8}
                  onPress={() => toggleTask(task.id)}
                  style={[styles.checkBox, task.completed && styles.checkedBox]}>
                  {task.completed ? (
                    <MaterialIcons color={colors.white} name="check" size={16} />
                  ) : null}
                </Pressable>
                <Pressable
                  accessibilityLabel={`Ver detalhes da tarefa ${task.title}`}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isDeleting }}
                  disabled={isDeleting}
                  onPress={() => openTaskDetails(task.id)}
                  style={({ pressed }) => [
                    styles.taskContent,
                    pressed && styles.taskContentPressed,
                    isDeleting && styles.actionButtonDisabled,
                  ]}>
                  <Text
                    style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskSubject}>{task.subject}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.taskType}>{task.type}</Text>
                    <Text style={styles.taskDate}>
                      {formatBrazilianDate(task.deadline)}
                    </Text>
                  </View>
                </Pressable>
                <View style={styles.actionColumn}>
                  <Pressable
                    accessibilityLabel={`Editar tarefa ${task.title}`}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isDeleting }}
                    disabled={isDeleting}
                    hitSlop={6}
                    onPress={() => openEditTask(task.id)}
                    style={({ pressed }) => [
                      styles.editButton,
                      pressed && styles.editButtonPressed,
                      isDeleting && styles.actionButtonDisabled,
                    ]}>
                    <MaterialIcons
                      color={colors.primaryDark}
                      name="edit"
                      size={20}
                    />
                  </Pressable>
                  <Pressable
                    accessibilityLabel={`Excluir tarefa ${task.title}`}
                    accessibilityRole="button"
                    accessibilityState={{ busy: isDeleting, disabled: isDeleting }}
                    disabled={isDeleting}
                    hitSlop={6}
                    onPress={() => confirmDelete(task)}
                    style={({ pressed }) => [
                      styles.deleteButton,
                      pressed && styles.deleteButtonPressed,
                      isDeleting && styles.actionButtonDisabled,
                    ]}>
                    {isDeleting ? (
                      <ActivityIndicator color={colors.danger} size="small" />
                    ) : (
                      <MaterialIcons
                        color={colors.danger}
                        name="delete-outline"
                        size={20}
                      />
                    )}
                  </Pressable>
                </View>
              </View>
            );
          })}

          {visibleTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons
                color={colors.textMuted}
                name="search-off"
                size={32}
              />
              <Text style={styles.emptyStateTitle}>Nenhuma tarefa encontrada</Text>
              <Text style={styles.emptyStateText}>
                {normalizedSearchQuery
                  ? 'Tente limpar a pesquisa ou selecionar outro filtro.'
                  : 'Não há tarefas disponíveis no filtro selecionado.'}
              </Text>
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
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: spacing.lg,
    minHeight: 50,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    minHeight: 48,
    paddingHorizontal: spacing.sm,
  },
  clearSearchButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
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
  sortSection: {
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  sortLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sortButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 9,
    borderWidth: 1,
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 38,
    minWidth: 132,
    paddingHorizontal: spacing.sm,
  },
  activeSortButton: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  sortButtonText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  activeSortButtonText: {
    color: colors.primaryDark,
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
  actionColumn: {
    gap: spacing.sm,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  editButtonPressed: {
    opacity: 0.75,
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: colors.dangerSoft,
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonPressed: {
    opacity: 0.75,
  },
  taskContent: {
    flex: 1,
    minHeight: 72,
  },
  taskContentPressed: {
    opacity: 0.7,
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
  emptyStateTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  emptyStateText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
    textAlign: 'center',
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
