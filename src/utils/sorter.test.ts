import {
  sortStrings,
  sortByKey,
  sortByNumericKey,
  sortCommitTypes,
  stableSort,
} from './sorter';

describe('sortStrings', () => {
  it('sorts strings ascending by default', () => {
    expect(sortStrings(['banana', 'apple', 'cherry'])).toEqual(['apple', 'banana', 'cherry']);
  });

  it('sorts strings descending', () => {
    expect(sortStrings(['banana', 'apple', 'cherry'], 'desc')).toEqual(['cherry', 'banana', 'apple']);
  });

  it('does not mutate the original array', () => {
    const original = ['b', 'a', 'c'];
    sortStrings(original);
    expect(original).toEqual(['b', 'a', 'c']);
  });
});

describe('sortByKey', () => {
  const items = [
    { name: 'Charlie', age: 30 },
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 28 },
  ];

  it('sorts objects by string key ascending', () => {
    const result = sortByKey(items, 'name');
    expect(result.map((i) => i.name)).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('sorts objects by string key descending', () => {
    const result = sortByKey(items, 'name', 'desc');
    expect(result.map((i) => i.name)).toEqual(['Charlie', 'Bob', 'Alice']);
  });
});

describe('sortByNumericKey', () => {
  const items = [
    { label: 'a', count: 3 },
    { label: 'b', count: 1 },
    { label: 'c', count: 2 },
  ];

  it('sorts by numeric key descending by default', () => {
    const result = sortByNumericKey(items, 'count');
    expect(result.map((i) => i.count)).toEqual([3, 2, 1]);
  });

  it('sorts by numeric key ascending', () => {
    const result = sortByNumericKey(items, 'count', 'asc');
    expect(result.map((i) => i.count)).toEqual([1, 2, 3]);
  });
});

describe('sortCommitTypes', () => {
  it('places feat before fix and chore', () => {
    const result = sortCommitTypes(['chore', 'feat', 'fix']);
    expect(result).toEqual(['feat', 'fix', 'chore']);
  });

  it('places breaking first', () => {
    const result = sortCommitTypes(['docs', 'breaking', 'feat']);
    expect(result[0]).toBe('breaking');
  });

  it('handles unknown types by placing them last', () => {
    const result = sortCommitTypes(['unknown', 'feat']);
    expect(result[0]).toBe('feat');
    expect(result[1]).toBe('unknown');
  });
});

describe('stableSort', () => {
  it('preserves order for equal elements', () => {
    const items = [
      { val: 1, id: 'a' },
      { val: 1, id: 'b' },
      { val: 1, id: 'c' },
    ];
    const result = stableSort(items, (a, b) => a.val - b.val);
    expect(result.map((i) => i.id)).toEqual(['a', 'b', 'c']);
  });

  it('correctly sorts non-equal elements', () => {
    const items = [{ val: 3 }, { val: 1 }, { val: 2 }];
    const result = stableSort(items, (a, b) => a.val - b.val);
    expect(result.map((i) => i.val)).toEqual([1, 2, 3]);
  });
});
