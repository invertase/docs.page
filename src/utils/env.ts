import { createContext } from 'react';

export type Environment = 'production' | 'preview' | 'development';

export const EnvironmentContext = createContext<Environment>('development');
