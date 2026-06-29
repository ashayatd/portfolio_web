// Single source of truth for career facts shown across the portfolio.
// Update these and every section (Hero, About, etc.) stays in sync.

/** First day at CIS. */
export const JOIN_DATE = new Date(2023, 9, 5); // 5 October 2023 (month is 0-indexed)

/** Production projects shipped (kept as a "N+" style claim). */
export const PROJECT_COUNT = "7+";

export interface Experience {
  years: number;
  months: number;
  /** e.g. "2 Years 9 Months" */
  label: string;
  /** compact form for tight stat boxes, e.g. "2Y 9M" */
  short: string;
}

/** Work experience from JOIN_DATE up to `now`, in whole years and months. */
export function getExperience(now: Date = new Date()): Experience {
  let months =
    (now.getFullYear() - JOIN_DATE.getFullYear()) * 12 +
    (now.getMonth() - JOIN_DATE.getMonth());

  // If we haven't reached the joining day-of-month yet, drop the partial month.
  if (now.getDate() < JOIN_DATE.getDate()) months -= 1;
  if (months < 0) months = 0;

  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "Year" : "Years"}`);
  if (remMonths > 0)
    parts.push(`${remMonths} ${remMonths === 1 ? "Month" : "Months"}`);
  const label = parts.join(" ") || "0 Months";
  const short = `${years}Y ${remMonths}M`;

  return { years, months: remMonths, label, short };
}
