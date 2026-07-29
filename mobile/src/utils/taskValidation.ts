import { parseISODate } from '@/src/utils/date';

export const SUPPORTED_TASK_TYPES = [
  'Atividade',
  'Prova',
  'Seminário',
  'Trabalho',
] as const;

export type SupportedTaskType = (typeof SUPPORTED_TASK_TYPES)[number];

export type TaskFormValues = {
  title: string;
  subject: string;
  deadline: string;
  type: string;
  description: string;
};

export type TaskFormField = keyof TaskFormValues;

export type TaskFormErrors = Partial<Record<TaskFormField, string>>;

export type NormalizedTaskFormValues = TaskFormValues;

export type TaskFormValidationOptions = {
  now?: Date;
};

export type TaskFormValidationResult = {
  valid: boolean;
  normalizedValues: NormalizedTaskFormValues;
  errors: TaskFormErrors;
  firstInvalidField: TaskFormField | null;
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 100;
const SUBJECT_MIN_LENGTH = 2;
const SUBJECT_MAX_LENGTH = 60;
const DESCRIPTION_MAX_LENGTH = 500;
const FIELD_ORDER: readonly TaskFormField[] = [
  'title',
  'subject',
  'deadline',
  'type',
  'description',
];

function getCanonicalTaskType(value: string): SupportedTaskType | null {
  const normalizedValue = value.toLocaleLowerCase('pt-BR');

  return (
    SUPPORTED_TASK_TYPES.find(
      (taskType) =>
        taskType.toLocaleLowerCase('pt-BR') === normalizedValue
    ) ?? null
  );
}

function getCalendarDateKey(year: number, month: number, day: number) {
  return year * 10_000 + month * 100 + day;
}

export function validateTaskForm(
  values: TaskFormValues,
  options: TaskFormValidationOptions = {}
): TaskFormValidationResult {
  const title = values.title.trim();
  const subject = values.subject.trim();
  const deadline = values.deadline.trim();
  const type = values.type.trim();
  const description = values.description.trim();
  const canonicalTaskType = getCanonicalTaskType(type);
  const normalizedValues: NormalizedTaskFormValues = {
    title,
    subject,
    deadline,
    type: canonicalTaskType ?? type,
    description,
  };
  const errors: TaskFormErrors = {};

  if (!title) {
    errors.title = 'Informe o título da tarefa.';
  } else if (title.length < TITLE_MIN_LENGTH) {
    errors.title = 'O título deve ter pelo menos 3 caracteres.';
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = 'O título deve ter no máximo 100 caracteres.';
  }

  if (!subject) {
    errors.subject = 'Informe a disciplina da tarefa.';
  } else if (subject.length < SUBJECT_MIN_LENGTH) {
    errors.subject = 'A disciplina deve ter pelo menos 2 caracteres.';
  } else if (subject.length > SUBJECT_MAX_LENGTH) {
    errors.subject = 'A disciplina deve ter no máximo 60 caracteres.';
  }

  if (!deadline) {
    errors.deadline = 'Informe o prazo da tarefa.';
  } else if (!ISO_DATE_PATTERN.test(deadline)) {
    errors.deadline = 'A data deve estar no formato AAAA-MM-DD.';
  } else {
    const deadlineParts = parseISODate(deadline);

    if (!deadlineParts) {
      errors.deadline = 'Informe uma data válida.';
    } else {
      const now = options.now ?? new Date();
      const nowTimestamp = now.getTime();

      if (Number.isFinite(nowTimestamp)) {
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
          errors.deadline = 'O prazo não pode estar no passado.';
        }
      }
    }
  }

  if (!type) {
    errors.type = 'Informe o tipo da tarefa.';
  } else if (!canonicalTaskType) {
    errors.type = 'Informe um tipo de tarefa válido.';
  }

  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = 'A descrição deve ter no máximo 500 caracteres.';
  }

  const firstInvalidField =
    FIELD_ORDER.find((field) => errors[field] !== undefined) ?? null;

  return {
    valid: firstInvalidField === null,
    normalizedValues,
    errors,
    firstInvalidField,
  };
}
