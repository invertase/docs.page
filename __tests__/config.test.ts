import { mergeConfig } from '../src/utils/config';

function isValidConfigTypes(config: any) {
  expect(typeof config.name).toBe('string');
  expect(typeof config.logo).toBe('string');
  expect(typeof config.theme).toBe('string');
  expect(Array.isArray(config.navigation)).toBe(true);
  expect(Array.isArray(config.sidebar)).toBe(true);
  expect(typeof config.defaultLayout).toBe('string');
  expect(typeof config.headerDepth).toBe('number');
}

describe('config', () => {
  it('should mergeConfig data with any invalid value', () => {
    isValidConfigTypes(mergeConfig(null));
    isValidConfigTypes(mergeConfig(123));
    isValidConfigTypes(mergeConfig('foo'));
    isValidConfigTypes(mergeConfig({}));
  });

  it('should mergeConfig data with any valid value', () => {
    const merged = mergeConfig({
      name: 'foo',
      logo: 'bar',
      theme: 'baz',
      docsearch: {
        apiKey: 'foo',
        indexName: 'bar',
      },
      defaultLayout: 'foo',
      headerDepth: 1234,
    });

    isValidConfigTypes(merged);
    expect(merged.name).toBe('foo');
    expect(merged.logo).toBe('bar');
    expect(merged.theme).toBe('baz');
    expect(merged.theme).toBe('baz');
    expect(merged.docsearch?.apiKey).toBe('foo');
    expect(merged.docsearch?.indexName).toBe('bar');
    expect(merged.defaultLayout).toBe('foo');
    expect(merged.headerDepth).toBe(1234);
  });

  // Navigation
  it('should return an empty array if no navigation provided', () => {
    const { navigation } = mergeConfig({});

    expect(navigation).toEqual([]);
  });

  it('should return a correct number of navigation items', () => {
    const { navigation } = mergeConfig({
      navigation: [
        ['example1', '/Example1'],
        ['example2', '/Example2'],
      ],
    });

    expect(navigation.length).toEqual(2);
  });

  it('should return a navigation item in the correct format', () => {
    const { navigation } = mergeConfig({
      navigation: [['example1', '/Example1']],
    });

    expect(navigation[0][0]).toEqual('example1');
    expect(navigation[0][1]).toEqual('/Example1');
  });

  it('should return empty for a navigation item in a non array format', () => {
    const { navigation } = mergeConfig({
      navigation: [{ foo: 'bar' }, ['example1', '/Example1']],
    });

    expect(navigation[0][0]).toEqual('example1');
    expect(navigation.length).toEqual(1);
  });

  it('should return null for a navigation item element with a non string first element', () => {
    const { navigation } = mergeConfig({
      navigation: [
        [true, 1],
        ['example1', '/Example1'],
      ],
    });

    expect(navigation[0][0]).toEqual('example1');
    expect(navigation[0][1]).toEqual('/Example1');

    expect(navigation.length).toEqual(1);
  });

  it('should return null for a navigation item element with a non string second element', () => {
    const { navigation } = mergeConfig({
      navigation: [
        ['example1', 1],
        ['example2', '/Example2'],
      ],
    });

    expect(navigation[0][0]).toEqual('example2');
    expect(navigation[0][1]).toEqual('/Example2');

    expect(navigation.length).toEqual(1);
  });

  it('should return the default navigation if navigation config is invalid', () => {
    const { navigation } = mergeConfig({
      navigation: { foo: 'bar' },
    });

    expect(navigation).toEqual([]);
  });

  // Sidebar
  it('should return an empty array if no sidebar provided', () => {
    const { sidebar } = mergeConfig({});

    expect(sidebar).toEqual([]);
  });

  it('should return an empty array if no sidebar provided', () => {
    const { sidebar } = mergeConfig({});

    expect(sidebar).toEqual([]);
  });

  it('should return a correct number of sidebar items', () => {
    const { sidebar } = mergeConfig({
      sidebar: [
        ['example1', '/Example1'],
        ['example2', '/Example2'],
      ],
    });

    expect(sidebar.length).toEqual(2);
  });

  it('should return a sidebar item in the correct format', () => {
    const { sidebar } = mergeConfig({
      sidebar: [['example1', '/Example1']],
    });

    expect(sidebar[0][0]).toEqual('example1');
    expect(sidebar[0][1]).toEqual('/Example1');
  });

  it('should return a sidebar item in the correct format', () => {
    const { sidebar } = mergeConfig({
      sidebar: [['example1', '/Example1']],
    });

    expect(sidebar[0][0]).toEqual('example1');
    expect(sidebar[0][1]).toEqual('/Example1');
  });

  it('should return a sub sidebar item in the correct format', () => {
    const { sidebar } = mergeConfig({
      sidebar: [['example1', [['example2', '/Example2']]]],
    });

    const first = sidebar[0][0];
    const second = sidebar[0][1][0];

    expect(first).toEqual('example1');
    expect(second).toEqual(['example2', '/Example2']);
  });

  it('should return a sidebar item in the correct format', () => {
    const { sidebar } = mergeConfig({
      sidebar: [['example1', '/Example1']],
    });

    expect(sidebar[0][0]).toEqual('example1');
    expect(sidebar[0][1]).toEqual('/Example1');
  });

  it('should return empty for a sidebar item in a non array format', () => {
    const { sidebar } = mergeConfig({
      sidebar: [{ foo: 'bar' }, ['example1', '/Example1']],
    });

    expect(sidebar[0][0]).toEqual('example1');
    expect(sidebar.length).toEqual(1);
  });

  it('should return null for a sidebar item element with a non string first element', () => {
    const { sidebar } = mergeConfig({
      sidebar: [
        [true, 1],
        ['example1', '/Example1'],
      ],
    });

    expect(sidebar[0][0]).toEqual('example1');
    expect(sidebar[0][1]).toEqual('/Example1');

    expect(sidebar.length).toEqual(1);
  });

  it('should return null for a sidebar item element with a non string second element', () => {
    const { sidebar } = mergeConfig({
      sidebar: [
        ['example1', 1],
        ['example2', '/Example2'],
      ],
    });

    expect(sidebar[0][0]).toEqual('example2');
    expect(sidebar[0][1]).toEqual('/Example2');

    expect(sidebar.length).toEqual(1);
  });

  it('should return the default sidebar if sidebar config is invalid', () => {
    const { sidebar } = mergeConfig({
      sidebar: { foo: 'bar' },
    });

    expect(sidebar).toEqual([]);
  });
});

export default null;
