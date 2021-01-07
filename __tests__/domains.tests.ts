import { getCustomDomain } from '../src/utils/domain';

describe('domains', () => {
  describe('getCustomDomain', () => {
    it('returns domain as expected', async () => {
      const properties = {
        owner: 'ehesp',
        repository: 'testing',
      } as any;

      const domain = await getCustomDomain(properties);

      expect(domain).toEqual('ehesp.invertase.io');
    });

    it('returns null if no domains are matched', async () => {
      const properties = {
        owner: 'not',
        repository: 'found',
      } as any;

      const domain = await getCustomDomain(properties);

      expect(domain).toEqual(null);
    });
  });
});
