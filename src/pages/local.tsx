import React, { useEffect, useRef, useState } from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextRouter, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { Layout } from '../components/Layout';
import { ConfigContext, mergeConfig } from '../utils/projectConfig';
import { PageContentContext } from '../utils/content';
import { EnvironmentContext } from '../utils/env';

NProgress.configure({ showSpinner: false });
NextRouter.events.on('routeChangeStart', NProgress.start);
NextRouter.events.on('routeChangeComplete', NProgress.done);
NextRouter.events.on('routeChangeError', NProgress.done);

const config = mergeConfig({});

export default function Documentation(): JSX.Element {
  const isAvailable = useRef<any>(false);
  let [clicked, setClicked] = useState(false);
  let [directory, setDirectory] = useState([]);

  useEffect(() => {
    if (clicked) {
      isAvailable.current =
        typeof window !== 'undefined' &&
        window
          .showDirectoryPicker()
          .then(async x => {
            const files = [];
            for await (let [name, handle] of x) {
              console.log(name);
              files.push(name);
            }
            setDirectory(files);
            return x;
          })
          .catch(console.error);
      setClicked(false);
    }
  }, [clicked]);

  return (
    <EnvironmentContext.Provider value={'preview'}>
      <ConfigContext.Provider value={config}>
        <PageContentContext.Provider
          value={{
            flags: { hasConfig: false, hasFrontmatter: true, isFork: false, isIndexable: false },
            frontmatter: {
              title: 'test',
              description: 'test',
              sidebar: false,
              redirect: 'test',
              image: '',
            },
            markdown: '',
            path: '',
            baseBranch: 'main',
            config,
            headings: [],
          }}
        >
          <Layout>
            <button className="border-solid" onClick={() => setClicked(true)}>
              click to pick directory
            </button>
            <div>{JSON.stringify(directory)}</div>
          </Layout>
        </PageContentContext.Provider>
      </ConfigContext.Provider>
    </EnvironmentContext.Provider>
  );
  //   return (
  //     <>
  //       <EnvironmentContext.Provider value={env}>
  //         <CustomDomainContext.Provider value={domain}>
  //           <ConfigContext.Provider value={content.config}>
  //             <SlugPropertiesContext.Provider value={properties}>
  //               <PageContentContext.Provider value={content}>
  //                 <DebugModeContext.Provider value={false}>
  //                   <Head />
  //                   <ThemeStyles />
  //                   <Layout>
  //                     <ErrorBoundary>
  //                       <Hydrate source={source} />
  //                     </ErrorBoundary>
  //                   </Layout>
  //                 </DebugModeContext.Provider>
  //               </PageContentContext.Provider>
  //             </SlugPropertiesContext.Provider>
  //           </ConfigContext.Provider>
  //         </CustomDomainContext.Provider>
  //       </EnvironmentContext.Provider>
  //     </>
  //   );
}
