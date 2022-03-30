import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBaseUrl } from '~/context';

/**
 * Renders a switch which toggles locale
 */

export function DocsRefsSwitch({
  isReference,
  referencePath,
}: {
  isReference: boolean;
  referencePath: string;
}) {
  const navigate = useNavigate();
  const baseUrl = useBaseUrl();

  const onChange = (value: string) => {
    navigate(value === 'DOCS' ? baseUrl : referencePath, { replace: true });
  };

  const container = (children?: React.ReactElement) => (
    <div className="relative flex h-8 w-full items-center rounded border bg-[#fbfbfb] px-1 hover:border-gray-300 hover:bg-transparent focus:outline-none dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:border-gray-600">
      {children}
    </div>
  );

  return container(
    <>
      <select
        role="button"
        className="inset-0 flex w-full appearance-none items-center bg-transparent pl-10 pr-3 text-xs font-medium text-gray-600 hover:text-black focus:outline-none dark:text-gray-300 dark:hover:text-white"
        value={isReference ? `/${referencePath}` : '/'}
        onChange={e => {
          onChange(e.target.value);
        }}
      >
        <option className="dark:text-white" value={'DOCS'}>
          {'Docs'}
        </option>
        <option className="dark:text-white" value={`REFS`}>
          {referencePath}
        </option>
      </select>
    </>,
  );
}
