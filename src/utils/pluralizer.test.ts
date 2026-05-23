import { pluralize, countLabel, isAre, wasWere } from "./pluralizer";

describe("pluralize", () => {
  it("returns singular when count is 1", () => {
    expect(pluralize("commit", 1)).toBe("commit");
    expect(pluralize("file", 1)).toBe("file");
  });

  it("returns irregular plural for known words", () => {
    expect(pluralize("commit", 2)).toBe("commits");
    expect(pluralize("fix", 3)).toBe("fixes");
    expect(pluralize("dependency", 5)).toBe("dependencies");
    expect(pluralize("entry", 2)).toBe("entries");
  });

  it("preserves capitalization for irregular plurals", () => {
    expect(pluralize("Commit", 2)).toBe("Commits");
    expect(pluralize("Fix", 3)).toBe("Fixes");
  });

  it("uses customPlural when provided", () => {
    expect(pluralize("person", 2, "people")).toBe("people");
    expect(pluralize("person", 1, "people")).toBe("person");
  });

  it("applies -es rule for words ending in s, x, z, ch, sh", () => {
    expect(pluralize("branch", 2)).toBe("branches");
    expect(pluralize("patch", 4)).toBe("patches");
    expect(pluralize("box", 2)).toBe("boxes");
  });

  it("applies -ies rule for words ending in consonant+y", () => {
    expect(pluralize("story", 2)).toBe("stories");
    expect(pluralize("query", 3)).toBe("queries");
  });

  it("appends -s for regular words", () => {
    expect(pluralize("token", 2)).toBe("tokens");
    expect(pluralize("label", 4)).toBe("labels");
  });
});

describe("countLabel", () => {
  it("formats count with singular word", () => {
    expect(countLabel(1, "commit")).toBe("1 commit");
  });

  it("formats count with plural word", () => {
    expect(countLabel(5, "commit")).toBe("5 commits");
  });

  it("uses customPlural when provided", () => {
    expect(countLabel(2, "person", "people")).toBe("2 people");
  });

  it("handles zero correctly", () => {
    expect(countLabel(0, "file")).toBe("0 files");
  });
});

describe("isAre", () => {
  it("returns 'is' for count 1", () => expect(isAre(1)).toBe("is"));
  it("returns 'are' for count > 1", () => expect(isAre(3)).toBe("are"));
  it("returns 'are' for count 0", () => expect(isAre(0)).toBe("are"));
});

describe("wasWere", () => {
  it("returns 'was' for count 1", () => expect(wasWere(1)).toBe("was"));
  it("returns 'were' for count > 1", () => expect(wasWere(2)).toBe("were"));
});
