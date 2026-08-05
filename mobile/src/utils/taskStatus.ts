import type { Task } from '@/src/types/task';

type TaskDeadlineStatus = Pick<Task, 'completed' | 'deadline'>;

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function getDaysInMonth(year: number, month: number) {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }

  if (month === 4 || month === 6 || month === 9 || month === 11) {
    return 30;
  }

  return 31;
}

function getDeadlineDateKey(value: string) {
  const match = ISO_DATE_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const isValid =
    year > 0 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= getDaysInMonth(year, month);

  return isValid ? year * 10_000 + month * 100 + day : null;
}

export function isTaskOverdue(
  task: TaskDeadlineStatus,
  today: Date = new Date()
) {
  if (task.completed || !Number.isFinite(today.getTime())) {
    return false;
  }

  const deadlineDateKey = getDeadlineDateKey(task.deadline);

  if (deadlineDateKey === null) {
    return false;
  }

  const todayDateKey =
    today.getFullYear() * 10_000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  return deadlineDateKey < todayDateKey;
}
