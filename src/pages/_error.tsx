import { NextPageContext } from "next";
import NextHead from "next/head";
import { ErrorType } from "../error";
import { SlugProperties } from "../properties";

import { RepositoryNotFound } from "../templates/error";

interface ErrorProps {
  statusCode: number;
  errorType?: ErrorType;
  properties?: SlugProperties;
}

// TODO make me pretty!
function Error({ statusCode, errorType, properties }: ErrorProps) {
  if (errorType === ErrorType.repositoryNotFound) {
    return <RepositoryNotFound properties={properties} />;
  }

  // if (errorType === ErrorType.pageNotFound) {
  //   return <PageNotFound properties={properties} />;
  // }

  return (
    <>
      <div className="max-w-4xl mx-auto text-center text-white py-32">
        Server Error
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = err?.statusCode ?? res?.statusCode ?? 500;

  if (res) {
    res.statusCode = statusCode;
  }

  return {
    statusCode,
    // @ts-ignore
    errorType: err?.errorType,
    // @ts-ignore
    properties: err?.properties,
  };
};

export default Error;
