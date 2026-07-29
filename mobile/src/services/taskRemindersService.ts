import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  ACADEMIC_REMINDERS_CHANNEL_ID,
  configureAndroidNotificationChannel,
  hasNotificationPermission,
  requestNotificationPermission,
} from '@/src/services/notificationsService';
import type { Task } from '@/src/types/task';
import {
  getTaskReminderCandidates,
  isTaskReminderMetadata,
  type TaskReminderCandidate,
  type TaskReminderMetadata,
  type TaskReminderType,
} from '@/src/utils/taskReminderPolicy';

export type TaskReminderPermissionStatus = 'granted' | 'denied' | 'error';

export type TaskReminderReconciliationOperation =
  | 'configure'
  | 'permission'
  | 'list'
  | 'cancel'
  | 'schedule'
  | 'reconcile';

export interface TaskReminderReconciliationError {
  operation: TaskReminderReconciliationOperation;
  message: string;
  taskId?: string;
  reminderType?: TaskReminderType;
  notificationId?: string;
}

export interface TaskReminderReconciliationSummary {
  kept: number;
  scheduled: number;
  cancelled: number;
  skipped: number;
  errors: TaskReminderReconciliationError[];
  permissionStatus: TaskReminderPermissionStatus;
}

export interface TaskReminderReconciliationOptions {
  requestPermission?: boolean;
  now?: Date;
}

interface ReconciliationRequest {
  tasks: Task[];
  options: TaskReminderReconciliationOptions;
}

interface ManagedScheduledNotification {
  identifier: string;
  metadata: TaskReminderMetadata;
  title: string | null;
  body: string | null;
}

type SummaryResolver = (summary: TaskReminderReconciliationSummary) => void;

let reconciliationRunning = false;
let queuedRequest: ReconciliationRequest | null = null;
let queuedResolvers: SummaryResolver[] = [];

function createSummary(
  permissionStatus: TaskReminderPermissionStatus = 'error'
): TaskReminderReconciliationSummary {
  return {
    kept: 0,
    scheduled: 0,
    cancelled: 0,
    skipped: 0,
    errors: [],
    permissionStatus,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Erro desconhecido.';
}

function getReminderKey(taskId: string, reminderType: TaskReminderType): string {
  return JSON.stringify([taskId, reminderType]);
}

function getCandidateKey(candidate: TaskReminderCandidate): string {
  return getReminderKey(candidate.metadata.taskId, candidate.reminderType);
}

function getScheduledKey(notification: ManagedScheduledNotification): string {
  return getReminderKey(notification.metadata.taskId, notification.metadata.reminderType);
}

function isExactMatch(
  notification: ManagedScheduledNotification,
  candidate: TaskReminderCandidate
): boolean {
  const { metadata } = notification;

  return (
    metadata.taskId === candidate.metadata.taskId &&
    metadata.reminderType === candidate.metadata.reminderType &&
    metadata.deadline === candidate.metadata.deadline &&
    metadata.scheduledFor === candidate.metadata.scheduledFor &&
    metadata.contentSignature === candidate.metadata.contentSignature &&
    notification.title === candidate.title &&
    notification.body === candidate.body
  );
}

function getDesiredReminders(
  tasks: readonly Task[],
  now?: Date
): Map<string, TaskReminderCandidate> {
  const desiredReminders = new Map<string, TaskReminderCandidate>();

  for (const task of tasks) {
    for (const candidate of getTaskReminderCandidates(task, now)) {
      desiredReminders.set(getCandidateKey(candidate), candidate);
    }
  }

  return desiredReminders;
}

function getManagedScheduledNotifications(
  notifications: readonly Notifications.NotificationRequest[]
): ManagedScheduledNotification[] {
  const managedNotifications: ManagedScheduledNotification[] = [];

  for (const notification of notifications) {
    const metadata = notification.content.data;

    if (!isTaskReminderMetadata(metadata)) {
      continue;
    }

    managedNotifications.push({
      identifier: notification.identifier,
      metadata,
      title: notification.content.title,
      body: notification.content.body,
    });
  }

  return managedNotifications;
}

async function cancelManagedNotification(
  notification: ManagedScheduledNotification,
  summary: TaskReminderReconciliationSummary
): Promise<boolean> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    summary.cancelled += 1;
    return true;
  } catch (error) {
    summary.errors.push({
      operation: 'cancel',
      message: getErrorMessage(error),
      taskId: notification.metadata.taskId,
      reminderType: notification.metadata.reminderType,
      notificationId: notification.identifier,
    });
    return false;
  }
}

async function cancelAllManagedNotifications(
  notifications: readonly ManagedScheduledNotification[],
  summary: TaskReminderReconciliationSummary
): Promise<void> {
  for (const notification of notifications) {
    await cancelManagedNotification(notification, summary);
  }
}

async function getPermissionStatus(
  requestPermission: boolean,
  summary: TaskReminderReconciliationSummary
): Promise<TaskReminderPermissionStatus> {
  try {
    await configureAndroidNotificationChannel();
  } catch (error) {
    summary.errors.push({
      operation: 'configure',
      message: getErrorMessage(error),
    });
  }

  try {
    let granted = await hasNotificationPermission();

    if (!granted && requestPermission) {
      granted = await requestNotificationPermission();
    }

    return granted ? 'granted' : 'denied';
  } catch (error) {
    summary.errors.push({
      operation: 'permission',
      message: getErrorMessage(error),
    });
    return 'error';
  }
}

async function scheduleCandidate(
  candidate: TaskReminderCandidate,
  summary: TaskReminderReconciliationSummary
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: candidate.title,
        body: candidate.body,
        data: candidate.metadata,
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: candidate.trigger,
        ...(Platform.OS === 'android'
          ? { channelId: ACADEMIC_REMINDERS_CHANNEL_ID }
          : {}),
      },
    });
    summary.scheduled += 1;
  } catch (error) {
    summary.skipped += 1;
    summary.errors.push({
      operation: 'schedule',
      message: getErrorMessage(error),
      taskId: candidate.metadata.taskId,
      reminderType: candidate.reminderType,
    });
  }
}

async function runReconciliation(
  request: ReconciliationRequest
): Promise<TaskReminderReconciliationSummary> {
  const summary = createSummary();
  const desiredReminders = getDesiredReminders(request.tasks, request.options.now);
  summary.permissionStatus = await getPermissionStatus(
    request.options.requestPermission === true,
    summary
  );

  let scheduledNotifications: Notifications.NotificationRequest[];

  try {
    scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    summary.skipped += desiredReminders.size;
    summary.errors.push({
      operation: 'list',
      message: getErrorMessage(error),
    });
    return summary;
  }

  const managedNotifications = getManagedScheduledNotifications(scheduledNotifications);

  if (summary.permissionStatus !== 'granted') {
    await cancelAllManagedNotifications(managedNotifications, summary);
    summary.skipped += desiredReminders.size;
    return summary;
  }

  const notificationsByKey = new Map<string, ManagedScheduledNotification[]>();

  for (const notification of managedNotifications) {
    const key = getScheduledKey(notification);
    const notificationsForKey = notificationsByKey.get(key) ?? [];
    notificationsForKey.push(notification);
    notificationsByKey.set(key, notificationsForKey);
  }

  const keptKeys = new Set<string>();
  const blockedKeys = new Set<string>();

  for (const [key, notificationsForKey] of notificationsByKey) {
    const desiredCandidate = desiredReminders.get(key);
    const exactNotification = desiredCandidate
      ? notificationsForKey.find((notification) =>
          isExactMatch(notification, desiredCandidate)
        )
      : undefined;

    if (exactNotification) {
      summary.kept += 1;
      keptKeys.add(key);
    }

    for (const notification of notificationsForKey) {
      if (notification === exactNotification) {
        continue;
      }

      const cancelled = await cancelManagedNotification(notification, summary);

      if (!cancelled) {
        blockedKeys.add(key);
      }
    }
  }

  for (const [key, candidate] of desiredReminders) {
    if (keptKeys.has(key)) {
      continue;
    }

    if (blockedKeys.has(key)) {
      summary.skipped += 1;
      continue;
    }

    await scheduleCandidate(candidate, summary);
  }

  return summary;
}

function createUnexpectedFailureSummary(error: unknown): TaskReminderReconciliationSummary {
  const summary = createSummary();
  summary.errors.push({
    operation: 'reconcile',
    message: getErrorMessage(error),
  });
  return summary;
}

async function processReconciliationQueue(
  initialRequest: ReconciliationRequest,
  initialResolvers: SummaryResolver[]
): Promise<void> {
  let currentRequest = initialRequest;
  let currentResolvers = initialResolvers;

  while (true) {
    let summary: TaskReminderReconciliationSummary;

    try {
      summary = await runReconciliation(currentRequest);
    } catch (error) {
      summary = createUnexpectedFailureSummary(error);
    }

    for (const resolve of currentResolvers) {
      resolve(summary);
    }

    if (!queuedRequest) {
      reconciliationRunning = false;
      return;
    }

    currentRequest = queuedRequest;
    currentResolvers = queuedResolvers;
    queuedRequest = null;
    queuedResolvers = [];
  }
}

export function reconcileTaskReminders(
  tasks: readonly Task[],
  options: TaskReminderReconciliationOptions = {}
): Promise<TaskReminderReconciliationSummary> {
  const request: ReconciliationRequest = {
    tasks: tasks.map((task) => ({ ...task })),
    options: {
      ...options,
      now: options.now ? new Date(options.now.getTime()) : undefined,
    },
  };

  return new Promise((resolve) => {
    if (reconciliationRunning) {
      queuedRequest = request;
      queuedResolvers.push(resolve);
      return;
    }

    reconciliationRunning = true;
    void processReconciliationQueue(request, [resolve]);
  });
}
