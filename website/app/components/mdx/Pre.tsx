import { useEffect, useState } from 'react';
import cx from 'classnames';
import CopyToClipboard from 'react-copy-to-clipboard';

export interface PreProps extends React.HTMLProps<HTMLPreElement> {
    title?: string;
    raw: string;
    html: string;
}


export function Pre(props: PreProps): JSX.Element {
    const [copied, setCopied] = useState<boolean>(false);
    let timeout: NodeJS.Timeout;

    useEffect(() => {
        if (copied) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [copied]);

    // Extract the data attributes from the component
    const title = props.title;
    const raw = decodeURIComponent(encodeURIComponent(props.raw));

    return (
        <>
            {!!title && (
                <div className="rounded-tr rounded-tl font-mono font-bold text-gray-300 text-sm px-4 py-2 border-b border-gray-700 bg-[#24292e]">
                    {title}
                </div>
            )}
            <div className="relative group">
                <div
                    className={cx('shiki-parent', {
                        'shiki-parent-title': !!title,
                    })}
                    dangerouslySetInnerHTML={{ __html: props.html }}
                />
                <div
                    className={cx(
                        'opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 mr-2 mt-2',
                        {
                            'opacity-100': copied,
                        },
                    )}
                >
                    <CopyToClipboard text={raw} onCopy={() => setCopied(true)}>
                        <button className="text-white text-xs font-mono bg-black hover:bg-black/40 transition-colors px-3 py-2 rounded-lg">
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </CopyToClipboard>
                </div>
            </div>
        </>
    );
}