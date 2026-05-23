import { formatDate, formatRelative, formatDateRange } from "./date-formatter";

describe("formatDate", () => {
  const fixed = new Date("2024-03-15T12:00:00Z");

  it("returns iso format", () => {
    expect(formatDate(fixed, "iso")).toBe("2024-03-15");
  });

  it("returns short format", () => {
    const result = formatDate(fixed, "short");
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/2024/);
  });

  it("returns long format", () => {
    const result = formatDate(fixed, "long");
    expect(result).toMatch(/March/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2024/);
  });

  it("accepts an ISO string input", () => {
    expect(formatDate("2024-03-15T12:00:00Z", "iso")).toBe("2024-03-15");
  });

  it("returns 'unknown date' for invalid input", () => {
    expect(formatDate("not-a-date")).toBe("unknown date");
  });

  it("defaults to short style", () => {
    const result = formatDate(fixed);
    expect(result).toMatch(/Mar/);
  });
});

describe("formatRelative", () => {
  const now = Date.now();

  it("formats seconds ago", () => {
    const d = new Date(now - 30_000);
    expect(formatRelative(d)).toBe("30 seconds ago");
  });

  it("formats 1 minute ago (singular)", () => {
    const d = new Date(now - 60_000);
    expect(formatRelative(d)).toBe("1 minute ago");
  });

  it("formats minutes ago", () => {
    const d = new Date(now - 5 * 60_000);
    expect(formatRelative(d)).toBe("5 minutes ago");
  });

  it("formats hours ago", () => {
    const d = new Date(now - 3 * 3_600_000);
    expect(formatRelative(d)).toBe("3 hours ago");
  });

  it("formats days ago", () => {
    const d = new Date(now - 2 * 86_400_000);
    expect(formatRelative(d)).toBe("2 days ago");
  });

  it("formats weeks ago", () => {
    const d = new Date(now - 14 * 86_400_000);
    expect(formatRelative(d)).toBe("2 weeks ago");
  });

  it("returns 'just now' for future dates", () => {
    const d = new Date(now + 10_000);
    expect(formatRelative(d)).toBe("just now");
  });
});

describe("formatDateRange", () => {
  it("formats a range between two dates", () => {
    const from = new Date("2024-01-01T00:00:00Z");
    const to = new Date("2024-03-15T00:00:00Z");
    const result = formatDateRange(from, to);
    expect(result).toContain("–");
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/Mar/);
  });
});
