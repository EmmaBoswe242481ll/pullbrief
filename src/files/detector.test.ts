import {
  parseFileLine,
  categorizeFile,
  groupFilesByCategory,
  ChangedFile,
} from "./detector";

describe("parseFileLine", () => {
  it("parses an added file", () => {
    const result = parseFileLine("A\tsrc/index.ts");
    expect(result).toEqual({
      path: "src/index.ts",
      status: "added",
      category: "source",
    });
  });

  it("parses a modified file", () => {
    const result = parseFileLine("M\tREADME.md");
    expect(result).toEqual({
      path: "README.md",
      status: "modified",
      category: "docs",
    });
  });

  it("parses a deleted file", () => {
    const result = parseFileLine("D\tsrc/old.ts");
    expect(result?.status).toBe("deleted");
  });

  it("parses a renamed file using last path segment", () => {
    const result = parseFileLine("R100\tsrc/old.ts\tsrc/new.ts");
    expect(result?.path).toBe("src/new.ts");
    expect(result?.status).toBe("renamed");
  });

  it("returns null for invalid line", () => {
    expect(parseFileLine("")).toBeNull();
    expect(parseFileLine("badline")).toBeNull();
  });
});

describe("categorizeFile", () => {
  it("categorizes test files", () => {
    expect(categorizeFile("src/foo.test.ts")).toBe("tests");
    expect(categorizeFile("src/bar.spec.ts")).toBe("tests");
  });

  it("categorizes source files", () => {
    expect(categorizeFile("src/index.ts")).toBe("source");
  });

  it("categorizes config files", () => {
    expect(categorizeFile("action.yml")).toBe("config");
    expect(categorizeFile("package.json")).toBe("config");
  });

  it("categorizes docs files", () => {
    expect(categorizeFile("README.md")).toBe("docs");
  });

  it("categorizes ci files", () => {
    expect(categorizeFile(".github/workflows/ci.yml")).toBe("ci");
  });

  it("falls back to other", () => {
    expect(categorizeFile("Makefile")).toBe("other");
  });
});

describe("groupFilesByCategory", () => {
  it("groups files by their category", () => {
    const files: ChangedFile[] = [
      { path: "src/a.ts", status: "added", category: "source" },
      { path: "src/b.test.ts", status: "modified", category: "tests" },
      { path: "src/c.ts", status: "modified", category: "source" },
    ];
    const grouped = groupFilesByCategory(files);
    expect(grouped["source"]).toHaveLength(2);
    expect(grouped["tests"]).toHaveLength(1);
  });
});
