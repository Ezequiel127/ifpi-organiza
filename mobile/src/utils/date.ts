const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

const SHORT_MONTHS = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
] as const;

type DateParts = {
  year: number;
  month: number;
  day: number;
};

export function parseISODate(value: string): DateParts | null {
  const match = ISO_DATE_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isValid ? { year, month, day } : null;
}

export function isValidISODate(value: string) {
  return parseISODate(value) !== null;
}

export function formatBrazilianDate(value: string) {
  const parts = parseISODate(value);

  if (!parts) {
    return 'Data inválida';
  }

  const day = String(parts.day).padStart(2, '0');
  const month = String(parts.month).padStart(2, '0');

  return `${day}/${month}/${parts.year}`;
}

export function formatLongBrazilianDate(value: string) {
  const parts = parseISODate(value);

  if (!parts) {
    return 'Data inválida';
  }

  return `${parts.day} de ${MONTHS[parts.month - 1]} de ${parts.year}`;
}

export function getBrazilianDateParts(value: string) {
  const parts = parseISODate(value);

  if (!parts) {
    return null;
  }

  return {
    day: String(parts.day).padStart(2, '0'),
    month: SHORT_MONTHS[parts.month - 1],
  };
}
