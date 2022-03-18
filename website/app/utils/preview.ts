import { createContext, useContext } from 'react';

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
    imageUrls: {},
});

export function usePreviewMode(): PreviewMode {
    return useContext(PreviewModeContext);
}