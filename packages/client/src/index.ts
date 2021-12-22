import { useMemo, FunctionComponent } from 'react';
import { getMDXComponent, MDXContentProps } from 'mdx-bundler/client';

interface UseHydratedProps {
  code: string;
}

function getMDXComp(code : string): FunctionComponent<MDXContentProps>   {
  console.log('MDX COMPONENT:',getMDXComponent(code));
  
  return getMDXComponent(code)
}

export function useHydratedMdx({ code }: UseHydratedProps): FunctionComponent<MDXContentProps> {
  return useMemo<FunctionComponent<MDXContentProps>>(() => getMDXComp(code), [code]);
}
