import { mergeConfig } from "../src/utils/config";

function isValidConfigTypes(config: any) {
  expect(typeof config.name).toBe("string");
  expect(typeof config.logo).toBe("string");
  expect(typeof config.theme).toBe("string");
  expect(Array.isArray(config.navigation)).toBe(true);
  expect(Array.isArray(config.sidebar)).toBe(true);
  expect(typeof config.defaultLayout).toBe("string");
  expect(typeof config.headerDepth).toBe("number");
}

describe("conifg", () => {
  it("should mergeConfig data with any invalid value", () => {
    isValidConfigTypes(mergeConfig(null));
    isValidConfigTypes(mergeConfig(123));
    isValidConfigTypes(mergeConfig('foo'));
    isValidConfigTypes(mergeConfig({}));
  });

  it("should mergeConfig data with any valid value", () => {
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

  // TODO test merge navigation
  // TODO test merge sidebars
});

export default null;
