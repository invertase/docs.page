import * as runtime from 'react/jsx-runtime';
import { runSync } from '@mdx-js/mdx';
import context from 'src/context';

import Link from './Link';
import FontAwesome from './FontAwesome';

import CodeBlock, { CodeBlockProps } from './mdx/CodeBlock';
import Image from './mdx/Image';
import YouTube from './mdx/YouTube';
import Vimeo from './mdx/Vimeo';
import Table from './mdx/Table';
import Heading from './mdx/Heading';
import Tweet from './mdx/Tweet';
import Zapp from './mdx/Zapp';
import * as callouts from './mdx/callouts';
import Tabs, { TabItem } from './mdx/Tabs';

const Markdown: React.FC = () => {
  const code = context.get().code;
  const { default: MDX } = runSync(code, runtime);

  return (
    <main className="prose prose-slate dark:prose-invert prose-p:leading-loose dark:prose-a:text-white prose-a:font-bold prose-a:underline-offset-[5px] prose-a:decoration-docs-theme prose-a:decoration-2 hover:prose-a:decoration-4 prose-headings:mb-[1rem] prose-pre:m-0 prose-pre:rounded-none max-w-none">
      <MDX
        components={{
          a: (props: any) => <Link {...props} href={props.href || '/'} />,
          img: (props: any) => <Image {...props} />,
          table: (props: any) => <Table {...props} />,
          pre: (props: any) => <CodeBlock {...(props as CodeBlockProps)} />,
          code: (props: any) => (
            <code {...props} className="before:content-[''] after:content-['']" />
          ),
          h1: (props: any) => <Heading {...props} type="h1" />,
          h2: (props: any) => <Heading {...props} type="h2" />,
          h3: (props: any) => <Heading {...props} type="h3" />,
          h4: (props: any) => <Heading {...props} type="h4" />,
          h5: (props: any) => <Heading {...props} type="h5" />,
          h6: (props: any) => <Heading {...props} type="h6" />,
          section: (props: any) => <section {...props} className="-mt-16 pt-16" />,
          Icon: (props: any) => <FontAwesome name={props.name} />,
          Info: (props: any) => <callouts.Info>{props.children}</callouts.Info>,
          Warning: (props: any) => <callouts.Warning>{props.children}</callouts.Warning>,
          Error: (props: any) => <callouts.Error>{props.children}</callouts.Error>,
          Success: (props: any) => <callouts.Success>{props.children}</callouts.Success>,
          Heading,
          Tweet: (props: any) => <Tweet {...props} />,
          Tabs: (props: any) => <Tabs {...props} />,
          TabItem: (props: any) => <TabItem {...props} />,
          Image,
          YouTube,
          Vimeo,
          Zapp,
        }}
      />
    </main>
  );
};

export default Markdown;
