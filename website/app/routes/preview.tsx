import { useHydratedMdx } from '@docs.page/client';
import { MetaFunction, useLoaderData, LinksFunction, useCatch } from 'remix';
import { detect } from 'detect-browser';
import cx from 'classnames';

import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { Sidebar } from '~/components/Sidebar';
import { Theme } from '~/components/Theme';
import components from '~/components/mdx';
import { DocumentationProvider } from '~/context';
import codeHikeStyles from '@code-hike/mdx/dist/index.css';
import {
    docsLoader,
    DocumentationLoader,
    ThrownBundleError,
    ThrownError,
    ThrownNotFoundError,
} from '../loaders/documentation.server';
import docsearch from '../styles/docsearch.css';
import { ScrollSpy } from '~/components/ScrollSpy';
import { BadRequest, NotFound, ServerError } from '~/components/Errors';
import { GitHub } from '~/components/Icons';
import { useDirectorySelector, usePollLocalDocs } from '~/utils/local-preview-mode';
import Documentation from '~/components/Documentation';

export let links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@docsearch/css@alpha' },
        { rel: 'stylesheet', href: docsearch },
        { rel: 'stylesheet', href: codeHikeStyles }
    ];
};

export const meta: MetaFunction = () => {

    return {
        title: 'docs.page Local Preview Mode' ?? '',
        description: '',
    };
};

export default function LocalPreview() {
    const { select, handles, configHandle, error: directoryError } = useDirectorySelector();

    const [data, pollErrorCode] = usePollLocalDocs(handles, configHandle, 500);

    if (!handles || !data || !data.code) {
        return <LandingPage onSelect={select} />
    }
    console.log('data', data);

    return <Documentation data={data} />
}


function LandingPage({ onSelect }: { onSelect: () => void }): JSX.Element {
    const browser = detect();

    return (
        <div className="dark:text-white">
            <section className="py-16 lg:py-32 items-center text-center px-4 lg:text-left">
                <div className="max-w-6xl mx-auto tracking-wider">
                    <div className="flex items-center justify-center lg:justify-between mb-4 space-x-4">
                        <div className="flex items-center justify-start space-x-4">
                            <h3 className="font-anton text-4xl">docs.page</h3>
                            <a
                                href="https://github.com/invertase/docs.page"
                                className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-100"
                            >
                                <GitHub size={40} />
                            </a>
                            <h3 className="italic">Local Preview Mode (Beta)</h3>
                        </div>
                    </div>
                    <h1 className=" text-center font-anton mt-40 mb-4 text-2xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-br from-gray-900 dark:from-gray-100 via-gray-700 dark:via-gray-300 to-gray-900 dark:to-gray-200">
                        Preview from your machine, with{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-red-600 to-black dark:from-yellow-200 dark:to-red-400">
                            hot reload.
                        </span>{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-red-800 to-violet-500"></span>
                    </h1>
                    {browser?.name === 'chrome' ? (
                        <>
                            <p suppressHydrationWarning className="text-center pt-20">
                                To get started, simply select the local directory containing your docs.json config file:
                            </p>
                            <div className="w-100% pt-8 text-center items-center justify-center content-center">
                                <button
                                    className="cursor-pointer bg-green-600 hover:bg-green-500 px-3 py-2 text-s rounded-lg shadow text-white transition-colors whitespace-nowrap"
                                    onClick={onSelect}
                                >
                                    Select Directory!
                                </button>
                            </div>
                        </>
                    ) : (
                        <p suppressHydrationWarning className="text-center pt-20">
                            Local Preview Mode is only available on Chrome at the moment, sorry :(
                        </p>
                    )}
                </div>
                <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0">
                    <Footer />
                </div>
            </section>
        </div>
    );
}


// TODO handle me
export function CatchBoundary() {
    const e = useCatch<ThrownError>();
    let child: JSX.Element;

    if (e.status === 404) {
        child = <NotFound error={e as ThrownNotFoundError} />;
    } else if (e.status === 500) {
        child = <ServerError title="Internal server error" />;
    } else if (e.status === 400) {
        child = <BadRequest error={e as ThrownBundleError} />;
    } else {
        child = <ServerError title="Something went wrong" />;
    }

    return <div data-testid={'error-container'}>{child!}<Footer /></div>;
}

export function ErrorBoundary() {

    return <ServerError title="An uncaught error was thrown" />
}