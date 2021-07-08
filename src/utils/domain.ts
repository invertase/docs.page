import { createContext } from 'react';

export type CustomDomain = string | null;

export const CustomDomainContext = createContext<CustomDomain>(null);
