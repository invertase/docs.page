import { getPullRequestMetadata } from './github.js';

export async function formatSourceAndRef(owner: string, repository: string, ref?: string) {
  let source: {
    type: 'PR' | 'commit' | 'branch';
    owner: string;
    repository: string;
    ref?: string;
  } = {
    type: 'branch',
    owner: owner || '',
    repository,
    ref: ref,
  };

  if (ref && /^[0-9]*$/.test(ref)) {
    // Fetch the PR metadata
    const metadata = await getPullRequestMetadata(owner, repository, ref);
    // If the PR was found, update the pointer and source
    if (metadata) {
      ref = metadata.ref;
      source = {
        type: 'PR',
        ...metadata,
      };
    }
  } else if (ref && /^[a-fA-F0-9]{40}$/.test(ref)) {
    source = {
      type: 'commit',
      owner,
      repository,
      ref,
    };
  } else if (ref) {
    source = {
      type: 'branch',
      owner,
      repository,
      ref,
    };
  }

  return { source, ref };
}
