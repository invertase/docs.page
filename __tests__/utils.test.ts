import { getString, getNumber, getBoolean } from '../src/utils';

describe('utils', () => {
  describe('getString', () => {
    it('returns a string value if provided', () => {
      const obj = {
        foo: {
          bar: 'foo',
        },
        bar: 'foo',
        baz: [
          {
            foo: 'foo',
          },
          'foo',
        ],
      };

      expect(getString(obj, 'foo.bar', 'baz')).toBe('foo');
      expect(getString(obj, 'bar', 'baz')).toBe('foo');
      expect(getString(obj, 'baz[0].foo', 'baz')).toBe('foo');
      expect(getString(obj, 'baz[1]', 'baz')).toBe('foo');
    });

    it('returns a default string value if provided value is not a string', () => {
      const obj = {
        foo: {
          bar: 123,
        },
      };

      expect(getString(obj, 'foo.bar', 'foo')).toBe('foo');
    });
  });

  describe('getNumber', () => {
    it('returns a number value if provided', () => {
      const obj = {
        foo: {
          bar: 1234,
        },
        bar: 1234,
        baz: [
          {
            foo: 1234,
          },
          1234,
        ],
      };

      expect(getNumber(obj, 'foo.bar', 9876)).toBe(1234);
      expect(getNumber(obj, 'bar', 9876)).toBe(1234);
      expect(getNumber(obj, 'baz[0].foo', 9876)).toBe(1234);
      expect(getNumber(obj, 'baz[1]', 9876)).toBe(1234);
    });

    it('returns a default number value if provided value is not a number', () => {
      const obj = {
        foo: {
          bar: '123',
        },
      };

      expect(getNumber(obj, 'foo.bar', 9876)).toBe(9876);
    });
  });

  describe('getBoolean', () => {
    it.only('returns a boolean value if provided', () => {
      const obj = {
        foo: true,
        bar: false,
      };

      expect(getBoolean(obj, 'foo', false)).toBe(true);
      expect(getBoolean(obj, 'bar', true)).toBe(false);
    });

    it('returns a boolean value if returned value is string truthy', () => {
      const obj = {
        foo: 'true',
        bar: 'false',
      };

      expect(getBoolean(obj, 'foo', false)).toBe(true);
      expect(getBoolean(obj, 'bar', true)).toBe(false);
    });

    it('returns a default number value if provided value is not a boolean', () => {
      const obj = {
        bar: 'foo',
        baz: 1,
      };

      expect(getBoolean(obj, 'foo', true)).toBe(true);
      expect(getBoolean(obj, 'baz', false)).toBe(false);
    });
  });
});
