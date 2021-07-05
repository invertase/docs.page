export function DocsDirectory(): JSX.Element {
  return (
    <section>
      <div className="mx-6 py-3 border-t border-l border-r rounded-tr rounded-tl border-gray-700" />
      <div className="py-3 px-3 flex items-center border rounded border-gray-700 font-mono text-sm shadow-xl">
        <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" className="text-white mr-3">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3h-6.5a.25.25 0 01-.2-.1l-.9-1.2c-.33-.44-.85-.7-1.4-.7h-3.5z"
          />
        </svg>
        <span className="flex-1">docs</span>
        <span className="text-gray-600">A few seconds ago</span>
      </div>
      <div className="mx-6 py-3 border-b border-l border-r rounded-br rounded-bl border-gray-700" />
    </section>
  );
}

export function IndexExample(): JSX.Element {
  return (
    <section>
      <div className="border rounded-tr rounded-tl border-gray-700 px-3 py-2">
        <code className="text-sm">docs/index.mdx</code>
      </div>
      <div className="flex">
        <div className="bg-gradient-to-b from-gray-700 to-gray-900 w-[1px]" />
        <div className="flex-1 p-3 font-mono">
          <div># Installation</div>
          <br />
          <div>```bash</div>
          <div>npm install myawesomelib</div>
          ```
        </div>
        <div className="bg-gradient-to-b from-gray-700 to-gray-900 w-[1px]" />
      </div>
    </section>
  );
}
