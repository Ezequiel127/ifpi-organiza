import { getDatabase, initializeDatabase } from '@/src/database/database';
import type { Task } from '@/src/types/task';

type TaskRow = {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  type: string;
  description: string;
  completed: number;
  created_at: string;
};

function mapRowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    subject: row.subject,
    deadline: row.deadline,
    type: row.type,
    description: row.description,
    completed: Number(row.completed) === 1,
    createdAt: row.created_at,
  };
}

export async function getAllTasks(): Promise<Task[]> {
  await initializeDatabase();
  const database = await getDatabase();
  const rows = await database.getAllAsync<TaskRow>(`
    SELECT
      id,
      title,
      subject,
      deadline,
      type,
      description,
      completed,
      created_at
    FROM tasks
    ORDER BY created_at DESC, id ASC
  `);

  return rows.map(mapRowToTask);
}

export async function insertTask(task: Task): Promise<boolean> {
  await initializeDatabase();
  const database = await getDatabase();
  const result = await database.runAsync(
    `INSERT OR IGNORE INTO tasks (
      id,
      title,
      subject,
      deadline,
      type,
      description,
      completed,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task.id,
      task.title,
      task.subject,
      task.deadline,
      task.type,
      task.description,
      task.completed ? 1 : 0,
      task.createdAt,
    ]
  );

  return result.changes > 0;
}

export async function updateTaskCompleted(
  id: string,
  completed: boolean
): Promise<boolean> {
  await initializeDatabase();
  const database = await getDatabase();
  const result = await database.runAsync(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    completed ? 1 : 0,
    id
  );

  return result.changes > 0;
}
