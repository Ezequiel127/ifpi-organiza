import * as SQLite from 'expo-sqlite';

import { mockTasks } from '@/src/data/mock-tasks';

const DATABASE_NAME = 'ifpi-organiza.db';
const INITIAL_TASKS_SEED_KEY = 'initial_tasks_seeded';

type TaskCountRow = {
  count: number;
};

type MetadataRow = {
  value: string;
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

    CREATE TABLE IF NOT EXISTS app_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await database.withTransactionAsync(async () => {
    const seedMarker = await database.getFirstAsync<MetadataRow>(
      'SELECT value FROM app_metadata WHERE key = ?',
      INITIAL_TASKS_SEED_KEY
    );

    if (seedMarker) {
      return;
    }

    const result = await database.getFirstAsync<TaskCountRow>(
      'SELECT COUNT(*) AS count FROM tasks'
    );

    if ((result?.count ?? 0) === 0) {
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
    }

    await database.runAsync(
      'INSERT OR IGNORE INTO app_metadata (key, value) VALUES (?, ?)',
      INITIAL_TASKS_SEED_KEY,
      '1'
    );
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
