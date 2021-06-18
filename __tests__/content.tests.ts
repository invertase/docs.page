import { getPageContent } from '../src/utils/content';

describe('content', () => {
  describe('getPageContent', () => {
    it('returns default content', async () => {
      const properties = {
        owner: 'invertase',
        repository: 'docs.page',
        ref: 'HEAD',
        path: 'index',
        base: '/invertase/docs.page~HEAD',
      } as any;
      const contents = await getPageContent(properties);

      expect(contents.baseBranch).toEqual('master');
      expect(contents.config.name).toEqual('docs.page');
    });

    it('returns null if no file is found', async () => {
      const properties = {
        owner: 'invertase',
        repository: 'docs.page',
        ref: 'HEAD',
        path: 'notfound',
        base: '/invertase/docs.page~HEAD',
      } as any;
      const contents = await getPageContent(properties);

      expect(contents).toEqual(null);
    });

    it('returns null if no content is found', async () => {
      const properties = {} as any;

      const contents = await getPageContent(properties);

      expect(contents).toEqual(null);
    });
  });
});
