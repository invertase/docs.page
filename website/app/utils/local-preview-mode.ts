import { createContext, useCallback, useEffect, useState } from 'react';
import { mergeConfig } from './config';
export type PreviewMode = {
    enabled: boolean;
    onSelect: () => void;
    imageUrls: Record<string, string> | null;
};

export const PreviewModeContext = createContext<PreviewMode>({
    enabled: false,
    onSelect: () => {
        return;
    },
    imageUrls: null,
});

export async function extractContents(
    handle: FileSystemFileHandle,
    configHandle: FileSystemFileHandle,
    imageHandles: FileSystemFileHandles,
): Promise<[string, string, Record<string, string>, Error[]]> {
    let config = mergeConfig({});
    let text: string = ''
    let imageUrls;

    const errors: Error[] = [];
    try {
        // get docs.json from config handle
        const configFile = await configHandle.getFile();
        try {
            // build config from the file contents
            config = await mergeConfig(JSON.parse(await configFile.text()));
        } catch (e) {
            console.error('Problems with docs.json format');
            // errors.push(e);
        }
    } catch (e) {
        console.error('Unable to getFile config');
        // errors.push(e);
    }
    try {
        const file = await handle.getFile();
        try {
            text = await file.text();
        } catch (e) {
            console.error('unable to extract text from file.');
            errors.push(e as Error);
        }
    } catch (e) {
        console.error('unable to getFile page');
        errors.push(e as Error);
    }
    try {
        imageUrls = Object.fromEntries(
            await Promise.all(
                Object.entries(imageHandles).map(async ([key, handle]) => {
                    const url = URL.createObjectURL(await handle.getFile());
                    return [key, url];
                }),
            ),
        );
    } catch (_) { }

    return [text, JSON.stringify(config), imageUrls, errors];
}

export type FileSystemFileHandles = { [path: string]: FileSystemFileHandle };

export async function iterateDirectory(
    directory: FileSystemDirectoryHandle,
    relativePath?: string,
    other?: FileSystemFileHandles,
): Promise<FileSystemFileHandles> {
    let handles: FileSystemFileHandles = {
        ...other,
    };

    for await (const entry of directory.values()) {
        if (entry.kind === 'file') {
            if (entry.name.endsWith('.mdx')) {
                handles[`${relativePath ?? ''}/${entry.name.replace('.mdx', '')}`] = entry;
            }
            if (['.png', '.gif', '.jpeg', '.jpg'].filter(ext => entry.name.endsWith(ext))) {
                handles[`${relativePath ?? ''}/${entry.name}`] = entry;
            }
        }

        if (entry.kind === 'directory') {
            handles = {
                ...handles,
                ...(await iterateDirectory(entry, `${relativePath ?? ''}/${entry.name}`, handles)),
            };
        }
    }

    return handles;
}



export function useHashChange(): string {
    const [hash, setHash] = useState('');

    function onHashChange() {
        // TODO: probably have to handle deeper index files, and redirects somewhere
        const newHash =
            window.location.hash.replace('#', '') === '/'
                ? '/index'
                : window.location.hash.replace('#', '');
        return setHash(newHash);
    }

    useEffect(() => {
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    return hash;
}

export function useDirectorySelector(): {
    select: () => void;
    handles: FileSystemFileHandles | null;
    error: Error;
    pending: boolean;
    configHandle: FileSystemFileHandle | null;
} {
    const [error, setError] = useState<any>(null);
    const [pending, setPending] = useState(false);
    const [handles, setHandles] = useState<FileSystemFileHandles | null>(null);
    const [configHandle, setConfigHandle] = useState<FileSystemFileHandle | null>(null);

    const select = useCallback(async () => {
        setPending(true);
        try {
            const handle = (await window.showDirectoryPicker()) || null;
            let docs: FileSystemDirectoryHandle | null = null;
            // let foundDocsJson = false;
            for await (const entry of handle.values()) {
                if (entry.kind === 'file' && entry.name === 'docs.json') {
                    setConfigHandle(entry);
                    // foundDocsJson = true;
                }
                if (entry.kind === 'directory' && entry.name === 'docs') {
                    docs = entry;
                }
            }

            if (!docs) {
                throw new Error('No docs directory found');
            }

            const docsHandles = await iterateDirectory(docs);

            setHandles(docsHandles);
        } catch (e) {
            setError(e);
        } finally {
            setPending(false);
        }
    }, []);

    return { select, handles, error, pending, configHandle };
}



const cache = {
    text: '',
    config: '',
    props: null,
    urls: null,
};

function useLocalDocs() {
    return {};
}