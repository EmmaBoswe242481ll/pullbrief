import {
  deduplicateStrings,
  deduplicateBy,
  deduplicateCommitMessages,
  countDuplicates,
} from "./deduplicator";

describe("deduplicateStrings", () => {
  it("removes exact duplicates", () => {
    expect(deduplicateStrings(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
  });

  it("trims whitespace before comparing", () => {
    expect(deduplicateStrings(["  foo", "foo  ", "foo"])).toEqual(["foo"]);
  });

  it("filters empty strings", () => {
    expect(deduplicateStrings(["", "  ", "hello"])).toEqual(["hello"]);
  });

  it("preserves first-occurrence order", () => {
    expect(deduplicateStrings(["z", "a", "z", "b"])).toEqual(["z", "a", "b"]);
  });

  it("returns empty array for empty input", () => {
    expect(deduplicateStrings([])).toEqual([]);
  });
});

describe("deduplicateBy", () => {
  it("deduplicates objects by key", () => {
    const items = [
      { id: "1", name: "Alice" },
      { id: "2", name: "Bob" },
      { id: "1", name: "Alice Duplicate" },
    ];
    const result = deduplicateBy(items, (i) => i.id);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Alice");
  });

  it("returns all items when keys are unique", () => {
    const items = [{ k: "a" }, { k: "b" }, { k: "c" }];
    expect(deduplicateBy(items, (i) => i.k)).toHaveLength(3);
  });
});

describe("deduplicateCommitMessages", () => {
  it("strips leading commit hashes before deduplication", () => {
    const msgs = [
      "abc1234 fix: correct typo",
      "def5678 fix: correct typo",
      "aaa0000 feat: add feature",
    ];
    const result = deduplicateCommitMessages(msgs);
    expect(result).toHaveLength(2);
  });
});

describe("countDuplicates", () => {
  it("counts occurrences of each item", () => {
    const counts = countDuplicates(["a", "b", "a", "a", "b"]);
    expect(counts.get("a")).toBe(3);
    expect(counts.get("b")).toBe(2);
  });

  it("returns 1 for unique items", () => {
    const counts = countDuplicates(["x"]);
    expect(counts.get("x")).toBe(1);
  });
});
