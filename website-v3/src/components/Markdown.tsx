import { getMDXComponent } from 'mdx-bundler/client/index.js';
import context from 'src/context';

import Link from './Link';
import Image from './mdx/Image';
import YouTube from './mdx/YouTube';
import Table from './mdx/Table';

const Markdown: React.FC = () => {
  const code = context.get().code;
  const MDX = getMDXComponent(code);

  return (
    <main className="prose prose-slate dark:prose-invert prose-p:leading-loose dark:prose-a:text-white prose-a:font-bold prose-a:underline-offset-[5px] prose-a:decoration-docs-theme prose-a:decoration-2 hover:prose-a:decoration-4 prose-headings:mb-[1rem] max-w-none">
      <MDX
        components={{
          a: props => <Link {...props} href={props.href || '/'} />,
          img: props => <Image {...props} />,
          table: props => <Table {...props} />,
          code: props => <code {...props} className="before:content-[''] after:content-['']" />,
          Image,
          YouTube,
        }}
      />
    </main>
  );
};

export default Markdown;
