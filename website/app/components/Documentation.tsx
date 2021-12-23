
import { useHydratedMdx } from '@docs.page/client';
import cx from 'classnames';

import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { Sidebar } from '~/components/Sidebar';
import { Theme } from '~/components/Theme';
import components from '~/components/mdx';
import { DocumentationProvider } from '~/context';
import {
    DocumentationLoader,
} from '../loaders/documentation.server';
import { ScrollSpy } from '~/components/ScrollSpy';





export default function Documentation({ data }: { data: DocumentationLoader }) {
    console.log(data.config);

    const MDX = useHydratedMdx({ code: data.code });

    return (
        <DocumentationProvider data={data}>
            <Theme />
            <Header />
            <div data-test-id={'documentation-provider'} className="max-w-8xl mx-auto">
                <div className="fixed inset-0 py-10 px-8 overflow-x-auto top-14 left-[max(0px,calc(50%-45rem))] w-64">
                    <Sidebar />
                </div>
                <div className="pt-10 pl-72">
                    <div
                        className={cx({
                            'mr-52 pr-16': true,
                        })}
                    >
                        <main
                            className="prose dark:prose-invert max-w-none
              prose-code:font-fira prose-code:font-medium
            "
                        >
                            <MDX components={components} />
                        </main>
                        <Footer />
                    </div>
                    {!!data.headings && (
                        <aside className="pt-10 px-8 fixed top-14 bottom-0 w-52 overflow-y-auto right-[max(0px,calc(50%-45rem))]">
                            <ScrollSpy />
                        </aside>
                    )}
                </div>
            </div>
        </DocumentationProvider>
    )
}