import { createContext } from 'react';

export type PreviewMode = boolean;

export const PreviewModeContext = createContext<PreviewMode>(false);
