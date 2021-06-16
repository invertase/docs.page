interface TitleProps {
  statusCode: number;
}

export function Title({ statusCode }: TitleProps): JSX.Element {
  return (
    <div className="font-anton mb-4 text-center lg:text-left">
      <h1 className="text-6xl lg:text-9xl">
        <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
          {statusCode}
        </span>
      </h1>
      <h2 className="text-6xl lg:text-6xl text-gray-900 dark:text-white">
        {statusCode === 500 && 'Something went wrong'}
        {statusCode !== 500 && 'Page not found'}
      </h2>
    </div>
  );
}
