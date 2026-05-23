import {
  passesFilter,
  filterSections,
  filterEmptySections,
  partitionSections,
  FilterableSection,
} from "./section-filter";

const makeSection = (
  type: string,
  items: string[],
  label?: string
): FilterableSection => ({ type, items, label });

describe("passesFilter", () => {
  it("excludes empty sections by default", () => {
    const section = makeSection("feat", []);
    expect(passesFilter(section)).toBe(false);
  });

  it("includes non-empty sections by default", () => {
    const section = makeSection("feat", ["add login"]);
    expect(passesFilter(section)).toBe(true);
  });

  it("allows empty sections when excludeEmpty is false", () => {
    const section = makeSection("feat", []);
    expect(passesFilter(section, { excludeEmpty: false })).toBe(true);
  });

  it("filters by includeTypes", () => {
    const feat = makeSection("feat", ["a"]);
    const fix = makeSection("fix", ["b"]);
    expect(passesFilter(feat, { includeTypes: ["feat"] })).toBe(true);
    expect(passesFilter(fix, { includeTypes: ["feat"] })).toBe(false);
  });

  it("filters by excludeTypes", () => {
    const chore = makeSection("chore", ["bump deps"]);
    expect(passesFilter(chore, { excludeTypes: ["chore"] })).toBe(false);
    expect(passesFilter(chore, { excludeTypes: ["feat"] })).toBe(true);
  });

  it("filters by minItemCount", () => {
    const section = makeSection("feat", ["a", "b"]);
    expect(passesFilter(section, { minItemCount: 2 })).toBe(true);
    expect(passesFilter(section, { minItemCount: 3 })).toBe(false);
  });
});

describe("filterSections", () => {
  it("returns only passing sections", () => {
    const sections = [
      makeSection("feat", ["a"]),
      makeSection("fix", []),
      makeSection("chore", ["b"]),
    ];
    const result = filterSections(sections);
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.type)).toEqual(["feat", "chore"]);
  });
});

describe("filterEmptySections", () => {
  it("removes sections with no items", () => {
    const sections = [
      makeSection("feat", ["x"]),
      makeSection("docs", []),
    ];
    expect(filterEmptySections(sections)).toHaveLength(1);
  });
});

describe("partitionSections", () => {
  it("splits into included and excluded", () => {
    const sections = [
      makeSection("feat", ["a"]),
      makeSection("fix", []),
      makeSection("chore", ["b"]),
    ];
    const { included, excluded } = partitionSections(sections, {
      excludeTypes: ["chore"],
    });
    expect(included.map((s) => s.type)).toEqual(["feat"]);
    expect(excluded.map((s) => s.type)).toEqual(["fix", "chore"]);
  });
});
