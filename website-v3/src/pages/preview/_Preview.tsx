import React, { useState } from 'react';
import context from 'src/context';
// import { map, atom } from 'nanostores';
// import { useStore } from '@nanostores/react';

// type DirectoryTree = { [path: string]: string };

// const stores = {
//   handle: atom<FileSystemDirectoryHandle | null>(null),
//   configuration: atom<File | undefined>(undefined),
//   docs: atom<FileSystemDirectoryHandle | undefined>(undefined),
//   tree: map<DirectoryTree>({}),
//   path: atom<string>('/'),
// };

// // Subscribes to the window hash and updates the path store.
// window.addEventListener('hashchange', () => {
//   stores.path.set(window.location.hash.slice(1) || '/');
// });

// // Subscribes to the directory handle the user provided access for,
// // and updates the configuration and docs stores.
// stores.handle.subscribe(async directory => {
//   if (directory) {
//     for await (const entry of directory.values()) {
//       if (entry.kind === 'file' && ['docs.json', 'docs.yaml'].includes(entry.name)) {
//         const file = await entry.getFile();
//         stores.configuration.set(file);
//       }

//       if (entry.kind === 'directory' && entry.name === 'docs') {
//         stores.docs.set(entry);
//       }
//     }
//   } else {
//     stores.configuration.set(undefined);
//   }
// });

// // Subscribes to the docs store and updates the tree store.
// stores.docs.subscribe(async handle => {
//   let id;
//   if (handle) {
//     id = setInterval(async () => {
//       stores.tree.set(await walkDirectoryHandle(handle, ''));
//     }, 1000);
//   } else {
//     clearTimeout(id);
//     stores.tree.set({});
//   }
// });

// // Walks the directory handle and returns a tree of file handles.
// async function walkDirectoryHandle(
//   handle: FileSystemDirectoryHandle,
//   prefix: string,
// ): Promise<DirectoryTree> {
//   let tree: DirectoryTree = {};

//   for await (const entry of handle.values()) {
//     if (entry.kind === 'file') {
//       const file = await entry.getFile();
//       const text = await file.text();
//       tree[`${prefix}/${entry.name}`] = text;
//     } else if (entry.kind === 'directory') {
//       tree = {
//         ...tree,
//         ...(await walkDirectoryHandle(entry, `${prefix}/${entry.name}`)),
//       };
//     }
//   }

//   return tree;
// }

export default function Preview(props: any) {
  // const handle = useStore(stores.handle);
  // const path = useStore(stores.path);
  // const tree = useStore(stores.tree);
  // const configuration = useStore(stores.configuration);

  const [ready, setReady] = useState(false);

  React.useEffect(() => {
    context.set({
      owner: 'foooo!',
      config: {},
    });
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div>
      {props.children}
    </div>
  );

  // if (!handle) {
  //   return (
  //     <button
  //       onClick={async () => {
  //         stores.handle.set((await window.showDirectoryPicker()) || null);
  //       }}
  //     >
  //       Select Directory
  //     </button>
  //   );
  // }

  // // No config = selected handle is not a docs directory, so they need to choose another.
  // if (!configuration) {
  //   return <div>Selected directory has no config file.</div>;
  // }

  // const file = path === '/' ? tree['/index.mdx'] : tree[`${path}.mdx`] || tree[`${path}/index.mdx`];

  // return (
  //   <div>
  //     <slot name="foo" />
  //     {file}
  //   </div>
  // );
}
