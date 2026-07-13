/**
 * Bank Mandiri KPR rate snapshots.
 *
 * Keep all promotional figures in this module so an expired offer cannot be
 * mistaken for a permanent rate in a UI component.
 */

export const mandiriKprPrograms = [
  {
    id: "mandiri-fixed-berjenjang-2026",
    label: "Mandiri KPR Fixed Berjenjang 10 Tahun",
    eligibilityLabel: "Wajib dikonfirmasi Bank Mandiri",
    propertyType: "house",
    minTenorYears: 10,
    // Meka Asia intentionally caps the website simulator at 20 years.
    maxTenorYears: 20,
    tiers: [
      { months: 36, annualRate: 6.88 },
      { months: 36, annualRate: 8.88 },
      { months: 48, annualRate: 9.88 },
    ],
    floatingRate: null,
    verifiedAt: "2026-07-13",
    validUntil: "2026-07-31",
    sourceUrl:
      "https://www.bankmandiri.co.id/en/kpr-bunga-fixed-berjenjang",
  },
];

function isValidDateParts(year, month, day) {
  const candidate = new Date(Date.UTC(year, month - 1, day));

  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  );
}

/**
 * Converts a Date or ISO-like date string to a comparable YYYY-MM-DD key.
 * Date objects use their local calendar day so an offer does not expire early
 * for visitors in a positive UTC offset such as Indonesia or Singapore.
 */
export function toDateKey(value = new Date()) {
  let year;
  let month;
  let day;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;

    year = value.getFullYear();
    month = value.getMonth() + 1;
    day = value.getDate();
  } else if (typeof value === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
    if (!match) return null;

    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
  } else {
    return null;
  }

  if (!isValidDateParts(year, month, day)) return null;

  return `${String(year).padStart(4, "0")}-${String(month).padStart(
    2,
    "0",
  )}-${String(day).padStart(2, "0")}`;
}

/**
 * Promotional rates remain active through the complete validUntil date.
 */
export function isProgramActive(program, asOfDate = new Date()) {
  const asOfKey = toDateKey(asOfDate);
  const validUntilKey = toDateKey(program?.validUntil);

  return Boolean(asOfKey && validUntilKey && asOfKey <= validUntilKey);
}

export function getActiveMandiriKprPrograms(asOfDate = new Date()) {
  return mandiriKprPrograms.filter((program) =>
    isProgramActive(program, asOfDate),
  );
}

export function getMandiriKprProgram(programId) {
  return (
    mandiriKprPrograms.find((program) => program.id === programId) ?? null
  );
}
