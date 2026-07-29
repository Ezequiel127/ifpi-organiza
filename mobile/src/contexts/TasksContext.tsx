import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { mockTasks } from '@/src/data/mock-tasks';
import { initializeDatabase } from '@/src/database/database';
import {
  deleteTask as deleteTaskFromDatabase,
  getAllTasks,
  insertTask,
  updateTask as updateTaskInDatabase,
  updateTaskCompleted,
} from '@/src/database/tasksRepository';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';
import type { NewTask, Task, TaskUpdate } from '@/src/types/task';
import { isValidISODate } from '@/src/utils/date';

type TasksState = {
  tasks: Task[];
};

type TasksAction =
  | { type: 'load'; payload: Task[] }
  | { type: 'add'; payload: Task }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'update'; payload: { id: string; changes: TaskUpdate } }
  | { type: 'setCompleted'; payload: { id: string; completed: boolean } };

type TasksContextValue = {
  tasks: Task[];
  addTask: (task: NewTask) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  updateTask: (id: string, changes: TaskUpdate) => Promise<boolean>;
  toggleTask: (id: string) => void;
  isLoading: boolean;
  pendingCount: number;
  completedCount: number;
  nextDeadline: Task | null;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  if (action.type === 'load') {
    return {
      tasks: action.payload,
    };
  }

  if (action.type === 'add') {
    if (state.tasks.some((task) => task.id === action.payload.id)) {
      return state;
    }

    return {
      tasks: [action.payload, ...state.tasks],
    };
  }

  if (action.type === 'remove') {
    return {
      tasks: state.tasks.filter((task) => task.id !== action.payload.id),
    };
  }

  if (action.type === 'update') {
    return {
      tasks: state.tasks.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.changes }
          : task
      ),
    };
  }

  if (action.type === 'setCompleted') {
    return {
      tasks: state.tasks.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: action.payload.completed }
          : task
      ),
    };
  }

  return state;
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, { tasks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const pendingInsertions = useRef(new Map<string, Promise<boolean>>());
  const pendingDeletions = useRef(new Map<string, Promise<boolean>>());
  const pendingTaskUpdates = useRef(new Map<string, Promise<boolean>>());
  const pendingCompletionUpdates = useRef(new Set<string>());

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        await initializeDatabase();
        const tasks = await getAllTasks();

        if (isMounted) {
          dispatch({ type: 'load', payload: tasks });
        }
      } catch (error) {
        console.error('Não foi possível carregar as tarefas salvas.', error);

        if (isMounted) {
          dispatch({ type: 'load', payload: mockTasks });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const addTask = useCallback((task: NewTask): Promise<boolean> => {
    const insertionKey = JSON.stringify([
      task.title,
      task.subject,
      task.deadline,
      task.type,
      task.description,
    ]);
    const pendingInsertion = pendingInsertions.current.get(insertionKey);

    if (pendingInsertion) {
      return pendingInsertion;
    }

    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const insertion = insertTask(newTask)
      .then((wasInserted) => {
        if (wasInserted) {
          dispatch({ type: 'add', payload: newTask });
        }

        return wasInserted;
      })
      .catch((error: unknown) => {
        console.error('Não foi possível salvar a tarefa.', error);
        return false;
      })
      .finally(() => {
        pendingInsertions.current.delete(insertionKey);
      });

    pendingInsertions.current.set(insertionKey, insertion);

    return insertion;
  }, []);

  const deleteTask = useCallback((id: string): Promise<boolean> => {
    const pendingDeletion = pendingDeletions.current.get(id);

    if (pendingDeletion) {
      return pendingDeletion;
    }

    const deletion = deleteTaskFromDatabase(id)
      .then((wasDeleted) => {
        if (wasDeleted) {
          dispatch({ type: 'remove', payload: { id } });
        }

        return wasDeleted;
      })
      .catch((error: unknown) => {
        console.error('Não foi possível excluir a tarefa.', error);
        return false;
      })
      .finally(() => {
        pendingDeletions.current.delete(id);
      });

    pendingDeletions.current.set(id, deletion);

    return deletion;
  }, []);

  const updateTask = useCallback(
    (id: string, changes: TaskUpdate): Promise<boolean> => {
      const pendingUpdate = pendingTaskUpdates.current.get(id);

      if (pendingUpdate) {
        return pendingUpdate;
      }

      const update = updateTaskInDatabase(id, changes)
        .then((wasUpdated) => {
          if (wasUpdated) {
            dispatch({ type: 'update', payload: { id, changes } });
          }

          return wasUpdated;
        })
        .catch((error: unknown) => {
          console.error('Não foi possível editar a tarefa.', error);
          return false;
        })
        .finally(() => {
          pendingTaskUpdates.current.delete(id);
        });

      pendingTaskUpdates.current.set(id, update);

      return update;
    },
    []
  );

  const toggleTask = useCallback(
    (id: string) => {
      const task = state.tasks.find((item) => item.id === id);

      if (!task || pendingCompletionUpdates.current.has(id)) {
        return;
      }

      const completed = !task.completed;
      pendingCompletionUpdates.current.add(id);

      void updateTaskCompleted(id, completed)
        .then((wasUpdated) => {
          if (wasUpdated) {
            dispatch({ type: 'setCompleted', payload: { id, completed } });
          }
        })
        .catch((error: unknown) => {
          console.error('Não foi possível atualizar a tarefa.', error);
        })
        .finally(() => {
          pendingCompletionUpdates.current.delete(id);
        });
    },
    [state.tasks]
  );

  const derivedState = useMemo(() => {
    let pendingCount = 0;
    let completedCount = 0;
    let nextDeadline: Task | null = null;

    for (const task of state.tasks) {
      if (task.completed) {
        completedCount += 1;
        continue;
      }

      pendingCount += 1;

      if (
        isValidISODate(task.deadline) &&
        (!nextDeadline || task.deadline < nextDeadline.deadline)
      ) {
        nextDeadline = task;
      }
    }

    return { pendingCount, completedCount, nextDeadline };
  }, [state.tasks]);

  const value = useMemo(
    () => ({
      tasks: state.tasks,
      addTask,
      deleteTask,
      updateTask,
      toggleTask,
      isLoading,
      ...derivedState,
    }),
    [
      addTask,
      deleteTask,
      derivedState,
      isLoading,
      state.tasks,
      toggleTask,
      updateTask,
    ]
  );

  return (
    <TasksContext.Provider value={value}>
      {isLoading ? (
        <View
          accessibilityLabel="Carregando tarefas"
          accessibilityRole="progressbar"
          style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Carregando tarefas...</Text>
        </View>
      ) : (
        children
      )}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasks deve ser usado dentro de TasksProvider.');
  }

  return context;
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: colors.screen,
    flex: 1,
    gap: spacing.md,
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
