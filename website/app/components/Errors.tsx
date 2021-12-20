import type { ThrownBundleError, ThrownNotFoundError } from '../loaders/documentation.server';

// TODO descriptions etc

export function NotFound({ error }: { error: ThrownNotFoundError }) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mt-64 text-center">
        <h1 className="font-extrabold text-gray-900 tracking-tight dark:text-gray-200">
          <div className="text-4xl">{error.status}</div>
          <div className="text-3xl">This page could not be found.</div>
        </h1>
      </div>
    </div>
  );
}

export function BadRequest({ error }: { error: ThrownBundleError }) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mt-64 text-center">
        <h1 className="font-extrabold text-gray-900 tracking-tight dark:text-gray-200">
          <div className="text-4xl">{error.status}</div>
          <div className="text-3xl">This page could not be generated.</div>
        </h1>
      </div>
    </div>
  );
}

export function ServerError({ title }: { title: string }) {
  return (
    <div className="max-w-lg mx-auto">
      <div className="mt-64 text-center">
        <h1 className="font-extrabold text-gray-900 tracking-tight dark:text-gray-200">
          <div className="text-4xl">500</div>
          <div className="text-3xl">{title}</div>
        </h1>
      </div>
    </div>
  );
}