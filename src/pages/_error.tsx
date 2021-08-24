import { GetStaticProps, InferGetStaticPropsType } from 'next';
// import { ErrorType, IRenderError, RenderError } from '../utils/error';
// import { Error } from '../templates/error';

// interface ErrorProps {
//   error: IRenderError;
// }

export default function ErrorPage({
  owner,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  return <>{owner}</>;
}

type StaticProps = {
  owner: string;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ctx => {
  const originalSlug = (ctx.params.slug || []) as string[];
  const owner = originalSlug[0];
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
