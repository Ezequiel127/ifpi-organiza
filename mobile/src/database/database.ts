import * as SQLite from 'expo-sqlite';

import { mockTasks } from '@/src/data/mock-tasks';

const DATABASE_NAME = 'ifpi-organiza.db';

type TaskCountRow = {
  count: number;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
let initializationPromise: Promise<void> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME).catch((error: unknown) => {
      databasePromise = null;
      throw error;
    });
  }

  return databasePromise;
}

async function createSchemaAndSeed() {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      deadline TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      completed INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await database.withTransactionAsync(async () => {
    const result = await database.getFirstAsync<TaskCountRow>(
      'SELECT COUNT(*) AS count FROM tasks'
    );

    if ((result?.count ?? 0) > 0) {
      return;
    }

    for (const task of mockTasks) {
      await database.runAsync(
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
    }
  });
}

export function initializeDatabase(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = createSchemaAndSeed().catch((error: unknown) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
}
