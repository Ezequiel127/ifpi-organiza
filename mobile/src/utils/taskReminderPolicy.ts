import type { Task } from '@/src/types/task';
import { parseISODate } from '@/src/utils/date';

export const TASK_REMINDER_SOURCE = 'ifpi-organiza.task-reminder';
export const TASK_REMINDER_METADATA_VERSION = 1;

export type TaskReminderType = 'day-before' | 'deadline-day';

export type TaskReminderMetadata = {
  source: typeof TASK_REMINDER_SOURCE;
  version: typeof TASK_REMINDER_METADATA_VERSION;
  taskId: string;
  reminderType: TaskReminderType;
  deadline: string;
};

export type TaskReminderCandidate = {
  trigger: Date;
  reminderType: TaskReminderType;
  title: string;
  body: string;
  metadata: TaskReminderMetadata;
};

type TaskReminderInput = Pick<
  Task,
  'id' | 'title' | 'deadline' | 'completed'
>;

const NOTIFICATION_TITLE = 'IFPI Organiza';
const DAY_BEFORE_HOUR = 18;
const DEADLINE_DAY_HOUR = 8;
const SAFETY_MARGIN_MS = 60_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTaskReminderType(value: unknown): value is TaskReminderType {
  return value === 'day-before' || value === 'deadline-day';
}

export function isTaskReminderMetadata(
  value: unknown
): value is TaskReminderMetadata {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.source === TASK_REMINDER_SOURCE &&
    value.version === TASK_REMINDER_METADATA_VERSION &&
    typeof value.taskId === 'string' &&
    value.taskId.trim().length > 0 &&
    isTaskReminderType(value.reminderType) &&
    typeof value.deadline === 'string' &&
    parseISODate(value.deadline) !== null
  );
}

function createLocalDate(
  year: number,
  month: number,
  day: number,
  hour: number
): Date | null {
  const date = new Date(year, month - 1, day, hour, 0, 0, 0);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour;

  return isValid ? date : null;
}

function createMetadata(
  taskId: string,
  reminderType: TaskReminderType,
  deadline: string
): TaskReminderMetadata {
  return {
    source: TASK_REMINDER_SOURCE,
    version: TASK_REMINDER_METADATA_VERSION,
    taskId,
    reminderType,
    deadline,
  };
}

function getCalendarDateKey(year: number, month: number, day: number) {
  return year * 10_000 + month * 100 + day;
}

function getNotificationBody(title: string, reminderType: TaskReminderType) {
  const normalizedTitle = title.trim();

  if (!normalizedTitle) {
    return reminderType === 'day-before'
      ? 'Sua tarefa vence amanhã.'
      : 'Sua tarefa vence hoje.';
  }

  return reminderType === 'day-before'
    ? `A tarefa "${normalizedTitle}" vence amanhã.`
    : `A tarefa "${normalizedTitle}" vence hoje.`;
}

export function getTaskReminderCandidates(
  task: TaskReminderInput,
  now: Date = new Date()
): TaskReminderCandidate[] {
  const deadlineParts = parseISODate(task.deadline);
  const taskId = task.id.trim();
  const nowTimestamp = now.getTime();

  if (
    task.completed ||
    !deadlineParts ||
    !taskId ||
    !Number.isFinite(nowTimestamp)
  ) {
    return [];
  }

  const deadlineDateKey = getCalendarDateKey(
    deadlineParts.year,
    deadlineParts.month,
    deadlineParts.day
  );
  const todayDateKey = getCalendarDateKey(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );

  if (deadlineDateKey < todayDateKey) {
    return [];
  }

  const dayBeforeTrigger = createLocalDate(
    deadlineParts.year,
    deadlineParts.month,
    deadlineParts.day,
    DAY_BEFORE_HOUR
  );
  dayBeforeTrigger?.setDate(dayBeforeTrigger.getDate() - 1);

  const deadlineDayTrigger = createLocalDate(
    deadlineParts.year,
    deadlineParts.month,
    deadlineParts.day,
    DEADLINE_DAY_HOUR
  );
  const triggerDefinitions: {
    trigger: Date | null;
    reminderType: TaskReminderType;
  }[] = [
    { trigger: dayBeforeTrigger, reminderType: 'day-before' },
    { trigger: deadlineDayTrigger, reminderType: 'deadline-day' },
  ];
  const minimumTriggerTimestamp = nowTimestamp + SAFETY_MARGIN_MS;

  return triggerDefinitions
    .filter(
      (
        definition
      ): definition is { trigger: Date; reminderType: TaskReminderType } =>
        definition.trigger !== null &&
        Number.isFinite(definition.trigger.getTime()) &&
        definition.trigger.getTime() > minimumTriggerTimestamp
    )
    .map(({ trigger, reminderType }) => ({
      trigger,
      reminderType,
      title: NOTIFICATION_TITLE,
      body: getNotificationBody(task.title, reminderType),
      metadata: createMetadata(taskId, reminderType, task.deadline),
    }))
    .sort(
      (firstCandidate, secondCandidate) =>
        firstCandidate.trigger.getTime() - secondCandidate.trigger.getTime()
    );
}
