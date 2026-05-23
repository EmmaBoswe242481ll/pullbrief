/**
 * Utilities for formatting dates in PR summaries and changelogs.
 */

export type DateStyle = "short" | "long" | "iso" | "relative";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Format a Date (or ISO string) into a human-readable string.
 */
export function formatDate(date: Date | string, style: DateStyle = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return "unknown date";
  }

  switch (style) {
    case "iso":
      return d.toISOString().slice(0, 10);
    case "long":
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "relative":
      return formatRelative(d);
    case "short":
    default:
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  }
}

/**
 * Format a date as a relative time string (e.g. "3 days ago").
 */
export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = Date.now();
  const diff = now - d.getTime();

  if (diff < 0) {
    return "just now";
  }
  if (diff < MINUTE) {
    const secs = Math.floor(diff / SECOND);
    return `${secs} second${secs !== 1 ? "s" : ""} ago`;
  }
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE);
    return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  }
  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
  if (diff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
  if (diff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  }
  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }
  const years = Math.floor(diff / YEAR);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

/**
 * Format a date range (e.g. for a PR's open period).
 */
export function formatDateRange(from: Date | string, to: Date | string): string {
  return `${formatDate(from, "short")} – ${formatDate(to, "short")}`;
}
