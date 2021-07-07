import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { ErrorType, IRenderError, RenderError } from '../utils/error';
import { Error as ErrorPage } from '../templates/error';

type StaticProps = {
  error: IRenderError;
};

export default function Custom404(
  props: InferGetStaticPropsType<typeof getStaticProps>,
): JSX.Element {
  return <ErrorPage {...props.error} />;
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  return {
    props: {
      error: RenderError.error(404, ErrorType.errorPage, new Error('Page not found')).toObject(),
    },
  };
};
