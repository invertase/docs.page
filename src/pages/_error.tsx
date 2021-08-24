import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { isProduction } from '../utils';
import { getRepositoryPaths } from '../utils/github';
// import { ErrorType, IRenderError, RenderError } from '../utils/error';
// import { Error } from '../templates/error';

// interface ErrorProps {
//   error: IRenderError;
// }

import repositories from '../../repositories.json';
import union from 'lodash.union';

export default function ErrorPage({
  owner,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  return <>{owner}</>;
}

type StaticProps = {
  owner: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  let paths = [];

  // Since this call can be fairly large, only run it on production
  // and let the development pages fallback each time.
  if (isProduction()) {
    console.info(` fetching paths for ${repositories.length} repositories.`);
    console.time();
    const promises = repositories.map(repository =>
      getRepositoryPaths(repository).then(paths => paths.map(p => '/_debug' + p)),
    );
    const results = await Promise.all(promises);
    paths = union(...results);
    console.timeEnd();
  }

  return {
    paths: paths.concat(['/_debug/cabljac/test-docs']),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<StaticProps> = async ctx => {
  console.log(ctx);
  const originalSlug = (ctx?.params?.slug || []) as string[];
  const owner = originalSlug[0] || '500';
  // const name = originalSlug[1];
  // const base = owner + '/' + name;
  // const slug = originalSlug.slice(2);
  return {
    props: {
      owner,
    },
  };
};

// ErrorPage.getInitialProps = ctx => {
//   const { res, err } = ctx;
//   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

//   return {
//     error: RenderError.error(statusCode || 500, ErrorType.errorPage, err).toObject(),
//   };
// };

// export default ErrorPage;
