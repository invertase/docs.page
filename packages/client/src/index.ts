import { useMemo, FunctionComponent } from 'react';
import { getMDXComponent, MDXContentProps } from 'mdx-bundler/client';

interface UseHydratedProps {
  code: string;
}

export function useHydratedMdx({ code }: UseHydratedProps): FunctionComponent<MDXContentProps> {
  return useMemo<FunctionComponent<MDXContentProps>>(() => getMDXComponent(code), [code]);
}
