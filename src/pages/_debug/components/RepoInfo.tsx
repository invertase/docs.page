function RepoInfo({ properties }) {
  return (
    <section className="mx-auto mt-10 max-w-3xl border rounded font-mono divide-y">
      <div className="flex p-3">
        <div className="flex-1">Owner</div>
        <div>{properties.owner}</div>
      </div>
      <div className="flex p-3">
        <div className="flex-1">Repository</div>
        <div>{properties.repository}</div>
      </div>
      <div className="flex p-3">
        <div className="flex-1">Ref (branch)</div>
        <div>{properties.ref || 'Repository not found'}</div>
      </div>
      <div className="flex p-3">
        <div className="flex-1">Config</div>
        <div>docs.yaml</div>
      </div>
    </section>
  );
}

export { RepoInfo };
