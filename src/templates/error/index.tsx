import React from "react";

import { SlugProperties } from "../../properties";
import { QuickLinks } from "./QuickLinks";

export function RepositoryNotFound({
  properties,
}: {
  properties: SlugProperties;
}) {
  const { owner, repository } = properties;

  return (
    <>
      <div className="p-6 max-w-2xl mx-auto my-24 border border-gray-700 rounded dark:text-white">
        <div>
          <h1 className="text-3xl font-semibold mb-6">Repository Not Found</h1>
          <p className="text-gray-200">
            The GitHub repository{" "}
            <a
              className="font-mono underline hover:opacity-75"
              target="_blank"
              href={`https://github.com/${owner}/${repository}`}
            >
              {owner}/{repository}
            </a>{" "}
            was not found. To get started, create a new repository on{" "}
            <a
              className="font-mono underline hover:opacity-75"
              href="https://github.com/new"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
      <QuickLinks />
    </>
  );
}
