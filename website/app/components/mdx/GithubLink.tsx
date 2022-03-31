import { useDocumentationContext } from '~/context';
import { DocsLink } from '../DocsLink';

export function GithubLink(props: { title: string; src: string }) {
  const { owner, repo, ref } = useDocumentationContext();
  const href = `https://github.com/${owner}/${repo}/blob/${ref || 'main'}/${props.src}`;
  return <DocsLink to={href}>{props.title}</DocsLink>;
}
