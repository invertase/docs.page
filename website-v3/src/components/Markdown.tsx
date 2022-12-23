import { getMDXComponent } from 'mdx-bundler/client/index.js';
import context from 'src/context';

import Link from './Link';
import Image from './mdx/Image';
import YouTube from './mdx/YouTube';
import Vimeo from './mdx/Vimeo';
import Table from './mdx/Table';
import Heading from './mdx/Heading';

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
          h1: props => <Heading {...props} type="h1" />,
          h2: props => <Heading {...props} type="h2" />,
          h3: props => <Heading {...props} type="h3" />,
          h4: props => <Heading {...props} type="h4" />,
          h5: props => <Heading {...props} type="h5" />,
          h6: props => <Heading {...props} type="h6" />,
          Heading,
          Tweet: props => <div>TODO</div>,
          Tabs: props => <div>TODO</div>,
          TabItem: props => <div>TODO</div>,
          Image,
          YouTube,
          Vimeo,
        }}
      />
    </main>
  );
};

export default Markdown;
