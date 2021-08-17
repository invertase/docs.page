import { createContext } from 'react';

export type DebugMode = boolean;

export const DebugModeContext = createContext<DebugMode>(false);
