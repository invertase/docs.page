import { useCallback, useState } from "react";

type FileSystemFileHandles = { [path: string]: FileSystemFileHandle };

interface DirectorySelector {
    select: () => void;
    fileHandles: FileSystemFileHandles | null;
    error: Error | null;
    pending: boolean;
    configHandle: FileSystemFileHandle | null;
}

export function useDirectorySelector(): DirectorySelector {
    const [error, setError] = useState<Error | null>(null);
    const [pending, setPending] = useState(false);
    const [fileHandles, setFileHandles] = useState<FileSystemFileHandles | null>(null);
    const [configHandle, setConfigHandle] = useState<FileSystemFileHandle | null>(null);

    const select = useCallback(async () => {
        setPending(true);
        try {
            const handle = (await window.showDirectoryPicker()) || null;

            let docs: FileSystemDirectoryHandle | null = null;
            let foundConfig = false;
            for await (const entry of handle.values()) {
                if (
                    !foundConfig &&
                    entry.kind === 'file' &&
                    ['docs.json', 'docs.yaml', 'docs.toml'].includes(entry.name)
                ) {
                    setConfigHandle(entry);
                    foundConfig = true;
                }
                if (entry.kind === 'directory' && entry.name === 'docs') {
                    docs = entry;
                }
            }

            if (!docs) {
                setError(new Error('No docs directory found'));
            } else {
                const docsHandles = await iterateDirectory(docs);
                setFileHandles(docsHandles);
            }
        } catch (e) {
        } finally {
            setPending(false);
        }
    }, []);

    return { select, fileHandles, error, pending, configHandle };
}

async function iterateDirectory(
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