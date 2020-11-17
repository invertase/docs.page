interface ErrorProps {
  statusCode: number;
  properties: any;
}

// TODO make me pretty!
function Error({ statusCode, properties }: ErrorProps) {
  return (
    <div className="max-w-4xl mx-auto text-center text-white py-32">
      Error! Status Code {statusCode} <br />
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = err?.statusCode ?? res?.statusCode ?? 500;

  if (res) {
    res.statusCode = statusCode;
  }

  return { statusCode };
};

export default Error;
