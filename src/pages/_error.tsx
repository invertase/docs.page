import { NextPage } from 'next';
import { ErrorType, IRenderError, RenderError } from '../utils/error';
import { Error } from '../templates/error';

interface ErrorProps {
  error: IRenderError;
}

const ErrorPage: NextPage<ErrorProps> = (props: ErrorProps) => {
  return <Error {...props.error} />;
};

ErrorPage.getInitialProps = ctx => {
  const { res, err } = ctx;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return {
    error: RenderError.error(statusCode || 500, ErrorType.errorPage, err).toObject(),
  };
};

export default ErrorPage;
