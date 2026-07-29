import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import { mockTasks } from '@/src/data/mock-tasks';
import type { NewTask, Task } from '@/src/types/task';
import { isValidISODate } from '@/src/utils/date';

type TasksState = {
  tasks: Task[];
};

type TasksAction =
  | { type: 'add'; payload: Task }
  | { type: 'toggle'; payload: { id: string } };

type TasksContextValue = {
  tasks: Task[];
  addTask: (task: NewTask) => void;
  toggleTask: (id: string) => void;
  pendingCount: number;
  completedCount: number;
  nextDeadline: Task | null;
};

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  if (action.type === 'add') {
    return {
      tasks: [action.payload, ...state.tasks],
    };
  }

  if (action.type === 'toggle') {
    return {
      tasks: state.tasks.map((task) =>
        task.id === action.payload.id ? { ...task, completed: !task.completed } : task
      ),
    };
  }

  return state;
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, { tasks: mockTasks });

  const addTask = useCallback((task: NewTask) => {
    dispatch({
      type: 'add',
      payload: {
        ...task,
        id: `task-${Date.now()}`,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: 'toggle', payload: { id } });
  }, []);

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
      toggleTask,
      ...derivedState,
    }),
    [addTask, derivedState, state.tasks, toggleTask]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasks deve ser usado dentro de TasksProvider.');
  }

  return context;
}
