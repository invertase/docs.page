import {
  getRepositoriesPaths,
  getPullRequestMetadata,
  getRepositoryList,
} from '../src/utils/github';

describe('github', () => {
  describe('getRepositoriesPaths', () => {
    it('returns paths as expected', async () => {
      const respositories = [['invertase', 'docs.page']] as any;

      const paths = await getRepositoriesPaths(respositories);

      expect(paths[0]).toEqual('/invertase/docs.page/');
      expect(paths.length).toBeGreaterThanOrEqual(1);
    });

    it('returns an empty array if no respositories are provided', async () => {
      const respositories = [] as any;

      const paths = await getRepositoriesPaths(respositories);

      expect(paths).toEqual([]);
    });

    it('returns an empty array with invalid options', async () => {
      const respositories = [['', '']] as any;

      const paths = await getRepositoriesPaths(respositories);

      expect(paths).toEqual([]);
    });
  });

  describe('getPullRequestMetadata', () => {
    it('returns meta data as expected', async () => {
      const owner = 'invertase';
      const repository = 'docs.page';
      const pullRequest = 1;

      const meta = await getPullRequestMetadata(owner, repository, pullRequest);

      //TODO: Figure out why ref is undefined? Is it because the PR is closed?
      expect(meta).toEqual({ owner: 'invertase', ref: undefined, repository: 'docs.page' });
    });
  });

  describe('getRepositoryList', () => {
    it('returns an empty array with invalid options', async () => {
      const meta = await getRepositoryList();

      //TODO: Figure out why ref is undefined? Is it because the PR is closed?
      expect(meta).toEqual([
        ['invertase', 'docs.page'],
        ['invertase', 'melos'],
      ]);
    });
  });
});
